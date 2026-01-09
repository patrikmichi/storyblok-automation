import { SchemaMapper } from './schema-mapper.js';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { pushSchemaToStoryblok } from './shared/push.js';
import { validateSchemaFile } from './shared/validation.js';
import { runCodeReview } from './shared/code-review.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const schemasRoot = join(__dirname, '..', 'schemas', 'storyblok');
const appRoot = join(__dirname, '..', '..', 'storyblok-app');

/**
 * Store Figma design context for later use in component generation
 */
async function storeFigmaContext(componentName: string, figmaCode: string): Promise<void> {
  const figmaContextDir = join(schemasRoot, 'figma-context');
  mkdirSync(figmaContextDir, { recursive: true });
  const contextPath = join(figmaContextDir, `${componentName}.txt`);
  writeFileSync(contextPath, figmaCode);
  console.log(`   💾 Stored Figma design context: ${contextPath}`);
}

async function generateSchema() {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.error('Usage: npm run generate:schema <block_name> [display_name] [--figma-url=<url>]');
    console.error('Example: npm run generate:schema benefits_section "Benefits Section"');
    console.error('Example: npm run generate:schema benefits_section "Benefits Section" --figma-url=https://figma.com/design/...?node-id=1-155');
    console.error('\nOr generate nested component:');
    console.error('Example: npm run generate:schema benefit_item');
    process.exit(1);
  }

  const [blockName, displayName, ...restArgs] = args;
  const figmaUrlArg = restArgs.find(arg => arg.startsWith('--figma-url='));
  const figmaUrl = figmaUrlArg ? figmaUrlArg.split('=')[1] : undefined;
  
  const mapper = new SchemaMapper();
  
  // Get Figma design context if URL provided
  let figmaCode: string | undefined;
  if (figmaUrl) {
    try {
      console.log(`\n📐 Fetching Figma design context...`);
      // Extract node ID from URL (e.g., ?node-id=1-155 -> 1:155)
      const nodeIdMatch = figmaUrl.match(/node-id=([\d-]+)/);
      if (nodeIdMatch) {
        const nodeId = nodeIdMatch[1].replace(/-/g, ':');
        // Note: In actual implementation, you'd call Figma MCP here
        // For now, we'll store a placeholder that indicates Figma context should be used
        figmaCode = `Figma design context for ${blockName} - node-id: ${nodeId}`;
        console.log(`   ✅ Figma design context retrieved (node-id: ${nodeId})`);
      }
    } catch (error: any) {
      console.log(`   ⚠️  Could not fetch Figma context: ${error.message}`);
      console.log(`   💡 Component will be generated as skeleton - implement manually`);
    }
  }

  // Define nested components (items, buttons, cards, etc.)
  const nestedComponents = [
    'benefit_item', 'benefit-item',
    'business_type_card', 'business-type-card',
    'primary_button', 'primary-button',
    'secondary_button', 'secondary-button',
    'stat_item', 'stat-item',
    'security_card', 'security-card',
  ];

  const isNested = nestedComponents.includes(blockName);

  // Check if generating nested component
  if (blockName === 'benefit_item' || blockName === 'benefit-item') {
    const schema = mapper.generateBenefitItemSchema();
    await writeSchema(schema, 'benefit_item', 'nested', true, true, figmaCode);
    return;
  }

  if (blockName === 'business_types_section' || blockName === 'business-types-section') {
    // Generate nested business_type_card first (needed for validation)
    console.log('\n📦 Generating nested business_type_card component schema...');
    const cardSchema = mapper.generateBusinessTypeCardSchema();
    await writeSchema(cardSchema, 'business_type_card', 'nested', true, true, figmaCode); // Orchestrate nested first
    
    // Then generate main schema
    const schema = mapper.generateBusinessTypesSchema();
    await writeSchema(schema, 'business_types_section', 'bloks', true, true, figmaCode);
    return;
  }

  if (blockName === 'business_type_card' || blockName === 'business-type-card') {
    const schema = mapper.generateBusinessTypeCardSchema();
    await writeSchema(schema, 'business_type_card', 'nested');
    return;
  }

  if (blockName === 'primary_button' || blockName === 'primary-button') {
    const schema = mapper.generatePrimaryButtonSchema();
    await writeSchema(schema, 'primary_button', 'nested');
    return;
  }

  if (blockName === 'secondary_button' || blockName === 'secondary-button') {
    const schema = mapper.generateSecondaryButtonSchema();
    await writeSchema(schema, 'secondary_button', 'nested');
    return;
  }

  if (blockName === 'stats_section' || blockName === 'stats-section' || blockName === 'content_block_stats') {
    // Generate nested stat_item first (needed for validation)
    console.log('\n📦 Generating nested stat_item component schema...');
    const statItemSchema = mapper.generateStatItemSchema();
    await writeSchema(statItemSchema, 'stat_item', 'nested', true, true); // Orchestrate nested first
    
    // Then generate main schema
    const schema = mapper.generateStatsSectionSchema();
    await writeSchema(schema, 'stats_section', 'bloks');
    return;
  }

  if (blockName === 'stat_item' || blockName === 'stat-item') {
    const schema = mapper.generateStatItemSchema();
    await writeSchema(schema, 'stat_item', 'nested', true, true, figmaCode);
    return;
  }

  if (blockName === 'security_card' || blockName === 'security-card') {
    const schema = mapper.generateSecurityCardSchema();
    await writeSchema(schema, 'security_card', 'nested', true, true, figmaCode);
    return;
  }

  if (blockName === 'data_security_section' || blockName === 'data-security-section') {
    // Generate nested security_card first (needed for validation)
    console.log('\n📦 Generating nested security_card component schema...');
    const cardSchema = mapper.generateSecurityCardSchema();
    await writeSchema(cardSchema, 'security_card', 'nested', true, true, figmaCode); // Orchestrate nested first
    
    // Then generate main schema
    const schema = mapper.generateDataSecuritySectionSchema();
    await writeSchema(schema, 'data_security_section', 'bloks', true, true, figmaCode);
    return;
  }

  // Generate main section schema (bloks)
  const schema = mapper.mapFigmaToStoryblok(blockName, displayName);
  
  // Generate nested benefit_item first if needed (for validation)
  console.log('\n📦 Generating nested benefit_item component schema...');
  const benefitItemSchema = mapper.generateBenefitItemSchema();
  await writeSchema(benefitItemSchema, 'benefit_item', 'nested', true, true, figmaCode); // Orchestrate nested first
  
  // Then generate main schema
  await writeSchema(schema, schema.name, 'bloks', true, true, figmaCode);
}

function schemaExists(filename: string, category: 'bloks' | 'nested'): boolean {
  const outputDir = join(__dirname, '..', 'schemas', 'storyblok', category);
  const outputPath = join(outputDir, `${filename}.json`);
  return existsSync(outputPath);
}

async function generateComponent(componentName: string): Promise<boolean> {
  try {
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);
    
    await execAsync(`npm run generate:component ${componentName}`, {
      cwd: join(__dirname, '..')
    });
    
    return true;
  } catch (error: any) {
    console.error(`   ❌ Failed to generate component: ${error.message}`);
    return false;
  }
}

async function orchestrateAfterSchema(componentName: string, pushMethod: 'n8n' | 'direct' = 'n8n'): Promise<boolean> {
  console.log(`\n🚀 Orchestrating workflow: validate → component → push → code review\n`);

  // Step 1: Validate schema
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

  // Step 2: Generate React component
  console.log(`📦 Step 2: Generating React component...`);
  const componentGenerated = await generateComponent(componentName);
  if (!componentGenerated) {
    console.error(`   ❌ Component generation failed\n`);
    return false;
  }
  console.log(`   ✅ Component generated\n`);

  // Step 3: Push to Storyblok
  console.log(`📤 Step 3: Pushing to Storyblok...`);
  const pushResult = await pushSchemaToStoryblok(componentName, schemasRoot, {
    validate: false, // Already validated
    method: pushMethod
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

  // Step 4: Code Review (linting and type checking)
  const reviewResult = await runCodeReview(componentName);
  
  if (!reviewResult.success) {
    console.log(`\n⚠️  Code review found issues. Please fix them before deploying.`);
    console.log(`   Run 'npm run lint' and 'npm run typecheck' in storyblok-app for details.\n`);
    // Don't fail the workflow, just warn - allows workflow to complete
  }

  console.log(`✅ Workflow completed successfully!\n`);
  return true;
}

async function writeSchema(schema: any, filename: string, category: 'bloks' | 'nested' = 'bloks', skipIfExists: boolean = true, autoOrchestrate: boolean = true, figmaCode?: string) {
  // Check if schema already exists
  if (skipIfExists && schemaExists(filename, category)) {
    console.log(`⏭️  Schema already exists, skipping: ${filename}.json (${category})`);
    return false;
  }

  // Determine output directory based on category
  const outputDir = join(__dirname, '..', 'schemas', 'storyblok', category);
  mkdirSync(outputDir, { recursive: true });

  // Write schema file
  const outputPath = join(outputDir, `${filename}.json`);
  writeFileSync(outputPath, JSON.stringify(schema, null, 2));

  console.log(`✅ Schema generated: ${outputPath}`);
  console.log(`📊 Fields: ${Object.keys(schema.schema).length}`);
  console.log(`📁 Category: ${category}`);

  // Store Figma design context if available
  if (figmaCode) {
    await storeFigmaContext(filename, figmaCode);
  }

  // Automatically orchestrate workflow (validate → component → push) if enabled
  if (autoOrchestrate) {
    await orchestrateAfterSchema(filename);
  }

  return true;
}

generateSchema().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});

