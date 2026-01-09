#!/usr/bin/env node
/**
 * Orchestration script for the complete workflow:
 * 1. Generate schema
 * 2. Validate schema
 * 3. Generate React component
 * 4. Push to Storyblok
 */

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import { pushSchemaToStoryblok } from './shared/push.js';
import { validateSchemaFile } from './shared/validation.js';
import { runCodeReview } from './shared/code-review.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const schemasRoot = join(__dirname, '..', 'schemas', 'storyblok');
const appRoot = join(__dirname, '..', '..', 'storyblok-app');

interface OrchestrationOptions {
  skipValidation?: boolean;
  skipComponentGeneration?: boolean;
  skipPush?: boolean;
  skipCodeReview?: boolean;
  pushMethod?: 'n8n' | 'direct';
}

async function generateComponent(componentName: string): Promise<boolean> {
  // Dynamically import generate-component script logic
  try {
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);
    
    const result = await execAsync(`npm run generate:component ${componentName}`, {
      cwd: join(__dirname, '..')
    });
    
    return true; // If no error thrown, it succeeded
  } catch (error: any) {
    console.error(`   ❌ Failed to generate component: ${error.message}`);
    return false;
  }
}

async function orchestrateWorkflow(
  componentName: string,
  options: OrchestrationOptions = {}
): Promise<boolean> {
  console.log(`\n🚀 Orchestrating workflow for: ${componentName}\n`);

  // Step 1: Check if schema exists
  const bloksPath = join(schemasRoot, 'bloks', `${componentName}.json`);
  const nestedPath = join(schemasRoot, 'nested', `${componentName}.json`);
  
  if (!existsSync(bloksPath) && !existsSync(nestedPath)) {
    console.error(`❌ Schema not found: ${componentName}.json`);
    console.error(`   Please generate the schema first using: npm run generate:schema ${componentName}`);
    return false;
  }

  // Step 2: Validate schema
  if (options.skipValidation !== true) {
    console.log(`📋 Step 1: Validating schema...`);
    const validation = await validateSchemaFile(componentName, schemasRoot);
    
    if (!validation.valid) {
      console.error(`\n❌ Schema validation failed:\n`);
      validation.errors.forEach((error, index) => {
        const prefix = error.field ? `   [${error.field}]` : '   ';
        console.error(`${index + 1}. ${prefix} ${error.message}`);
      });
      return false;
    }
    console.log(`   ✅ Validation passed\n`);
  } else {
    console.log(`   ⏭️  Skipping validation\n`);
  }

  // Step 3: Generate React component
  if (options.skipComponentGeneration !== true) {
    console.log(`📦 Step 2: Generating React component...`);
    const componentGenerated = await generateComponent(componentName);
    if (!componentGenerated) {
      console.error(`   ❌ Component generation failed\n`);
      return false;
    }
    console.log(`   ✅ Component generated\n`);
  } else {
    console.log(`   ⏭️  Skipping component generation\n`);
  }

  // Step 4: Push to Storyblok
  if (options.skipPush !== true) {
    console.log(`📤 Step 3: Pushing to Storyblok...`);
    const pushResult = await pushSchemaToStoryblok(componentName, schemasRoot, {
      validate: false, // Already validated
      method: options.pushMethod || 'n8n'
    });
    
    if (!pushResult.success) {
      console.error(`   ❌ Push failed: ${pushResult.message}\n`);
      return false;
    }
    
    console.log(`   ✅ Pushed to Storyblok: ${componentName}`);
    if (pushResult.componentId) {
      console.log(`   📦 Component ID: ${pushResult.componentId}`);
    }
    if (pushResult.message) {
      console.log(`   📝 ${pushResult.message}`);
    }
    console.log();
  } else {
    console.log(`   ⏭️  Skipping push\n`);
  }

  // Step 5: Code Review (linting and type checking)
  if (options.skipCodeReview !== true) {
    const reviewResult = await runCodeReview(componentName);
    
    if (!reviewResult.success) {
      console.log(`\n⚠️  Code review found issues. Please fix them before deploying.`);
      console.log(`   Run 'npm run lint' and 'npm run typecheck' in storyblok-app for details.\n`);
      // Don't fail the workflow, just warn
    }
  } else {
    console.log(`   ⏭️  Skipping code review\n`);
  }

  console.log(`✅ Workflow completed successfully!\n`);
  return true;
}

// Main execution
const args = process.argv.slice(2);

if (args.length < 1) {
  console.error('Usage: npm run orchestrate <component_name> [options]');
  console.error('\nOptions:');
  console.error('  --skip-validation          Skip schema validation');
  console.error('  --skip-component           Skip React component generation');
  console.error('  --skip-push                Skip pushing to Storyblok');
  console.error('  --skip-code-review         Skip code review (linting & type checking)');
  console.error('  --push-method=<n8n|direct> Push method (default: n8n)');
  console.error('\nExample:');
  console.error('  npm run orchestrate stats_section');
  console.error('  npm run orchestrate stats_section --skip-component');
  console.error('  npm run orchestrate stats_section --push-method=direct');
  process.exit(1);
}

const componentName = args[0];
const options: OrchestrationOptions = {};

// Parse options
for (let i = 1; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--skip-validation') {
    options.skipValidation = true;
  } else if (arg === '--skip-component') {
    options.skipComponentGeneration = true;
  } else if (arg === '--skip-push') {
    options.skipPush = true;
  } else if (arg === '--skip-code-review') {
    options.skipCodeReview = true;
  } else if (arg.startsWith('--push-method=')) {
    const method = arg.split('=')[1] as 'n8n' | 'direct';
    options.pushMethod = method;
  }
}

orchestrateWorkflow(componentName, options)
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });

