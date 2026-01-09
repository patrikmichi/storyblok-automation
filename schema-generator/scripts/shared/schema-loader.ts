import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { StoryblokSchema } from './validation.js';

/**
 * Load a schema file from either bloks or nested directory
 */
export function loadSchema(componentName: string, schemasRoot: string): { schema: StoryblokSchema; path: string } {
  const bloksPath = join(schemasRoot, 'bloks', `${componentName}.json`);
  const nestedPath = join(schemasRoot, 'nested', `${componentName}.json`);
  
  let schemaContent: string;
  let schemaPath: string;
  
  try {
    schemaContent = readFileSync(bloksPath, 'utf-8');
    schemaPath = bloksPath;
  } catch {
    try {
      schemaContent = readFileSync(nestedPath, 'utf-8');
      schemaPath = nestedPath;
    } catch (error: any) {
      throw new Error(`Schema file not found: ${componentName}.json\n   Checked: ${bloksPath}\n   Checked: ${nestedPath}`);
    }
  }

  const schema: StoryblokSchema = JSON.parse(schemaContent);
  return { schema, path: schemaPath };
}

/**
 * Check if a schema file exists
 */
export function schemaExists(componentName: string, schemasRoot: string): boolean {
  const bloksPath = join(schemasRoot, 'bloks', `${componentName}.json`);
  const nestedPath = join(schemasRoot, 'nested', `${componentName}.json`);
  return existsSync(bloksPath) || existsSync(nestedPath);
}

