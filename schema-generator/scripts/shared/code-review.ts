/**
 * Code review utilities for validating generated components
 */

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const appRoot = join(__dirname, '..', '..', '..', 'storyblok-app');

export interface CodeReviewResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  typecheckPassed: boolean;
  lintPassed: boolean;
}

/**
 * Run code review checks on generated components
 */
export async function runCodeReview(componentName?: string): Promise<CodeReviewResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  let typecheckPassed = false;
  let lintPassed = false;

  console.log(`\n🔍 Step 4: Running code review...`);

  // TypeScript type checking
  try {
    console.log(`   📝 Running TypeScript type check...`);
    const { stdout, stderr } = await execAsync('npm run typecheck', {
      cwd: appRoot,
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
    });

    if (stderr && stderr.trim()) {
      // TypeScript errors go to stderr
      const errorLines = stderr.split('\n').filter(line => line.includes('error TS'));
      if (errorLines.length > 0) {
        errors.push(...errorLines);
        console.log(`   ⚠️  TypeScript errors found: ${errorLines.length}`);
      } else {
        typecheckPassed = true;
        console.log(`   ✅ TypeScript type check passed`);
      }
    } else {
      typecheckPassed = true;
      console.log(`   ✅ TypeScript type check passed`);
    }
  } catch (error: any) {
    // execAsync throws on non-zero exit code
    const errorOutput = error.stderr || error.stdout || error.message;
    const errorLines = errorOutput.split('\n').filter((line: string) => line.includes('error TS'));
    
    if (errorLines.length > 0) {
      errors.push(...errorLines);
      console.log(`   ⚠️  TypeScript errors found: ${errorLines.length}`);
      
      // Show first few errors
      const previewErrors = errorLines.slice(0, 5);
      previewErrors.forEach((err: string) => {
        console.log(`      ${err}`);
      });
      if (errorLines.length > 5) {
        console.log(`      ... and ${errorLines.length - 5} more errors`);
      }
    } else {
      // Unexpected error
      errors.push(`TypeScript check failed: ${error.message}`);
      console.log(`   ❌ TypeScript check failed: ${error.message}`);
    }
  }

  // ESLint checking
  try {
    console.log(`   🔍 Running ESLint...`);
    const { stdout, stderr } = await execAsync('npm run lint', {
      cwd: appRoot,
      maxBuffer: 10 * 1024 * 1024,
    });

    if (stderr && stderr.trim() && !stderr.includes('Warning:')) {
      // ESLint errors
      const errorLines = stderr.split('\n').filter((line: string) => 
        line.includes('error') || line.includes('Error')
      );
      if (errorLines.length > 0) {
        errors.push(...errorLines);
        console.log(`   ⚠️  ESLint errors found`);
      }
    }

    // Check for warnings in stdout
    if (stdout && stdout.includes('warning')) {
      const warningLines = stdout.split('\n').filter((line: string) => line.includes('warning'));
      warnings.push(...warningLines);
    }

    lintPassed = !errors.some(err => err.includes('lint') || err.includes('ESLint'));
    if (lintPassed) {
      console.log(`   ✅ ESLint check passed`);
    }
  } catch (error: any) {
    // ESLint may exit with non-zero on errors, but that's expected
    const errorOutput = error.stderr || error.stdout || '';
    
    if (errorOutput.includes('error')) {
      const errorLines = errorOutput.split('\n').filter((line: string) => 
        line.includes('error') && !line.includes('Warning')
      );
      if (errorLines.length > 0) {
        errors.push(...errorLines);
        console.log(`   ⚠️  ESLint errors found`);
      }
    } else {
      // If no errors in output, lint passed
      lintPassed = true;
      console.log(`   ✅ ESLint check passed`);
    }
  }

  const success = errors.length === 0 && typecheckPassed && lintPassed;

  if (success) {
    console.log(`   ✅ Code review passed - no issues found\n`);
  } else {
    console.log(`   ⚠️  Code review found issues:\n`);
    if (errors.length > 0) {
      console.log(`   ❌ Errors (${errors.length}):`);
      errors.slice(0, 10).forEach((err, index) => {
        console.log(`      ${index + 1}. ${err}`);
      });
      if (errors.length > 10) {
        console.log(`      ... and ${errors.length - 10} more errors`);
      }
    }
    if (warnings.length > 0) {
      console.log(`   ⚠️  Warnings (${warnings.length}):`);
      warnings.slice(0, 5).forEach((warn, index) => {
        console.log(`      ${index + 1}. ${warn}`);
      });
    }
    console.log();
  }

  return {
    success,
    errors,
    warnings,
    typecheckPassed,
    lintPassed,
  };
}

