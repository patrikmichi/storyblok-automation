import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { StoryblokSchema } from './validation.js';

/**
 * Convert to PascalCase
 */
export function toPascalCase(str: string): string {
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * Check if React component files exist
 */
export function checkComponentFiles(schema: StoryblokSchema, appRoot: string): {
  presentational: boolean;
  wrapper: boolean;
  registered: boolean;
  presentationalPath: string;
  wrapperPath: string;
} {
  const componentName = toPascalCase(schema.name);
  const presentationalPath = join(appRoot, 'src', 'components', 'presentational', `${componentName}.tsx`);
  const wrapperPath = join(appRoot, 'src', 'storyblok', 'components', `${schema.name}.tsx`);
  const generatedPath = join(appRoot, 'src', 'storyblok', 'generated.components.ts');

  const presentational = existsSync(presentationalPath);
  const wrapper = existsSync(wrapperPath);
  
  let registered = false;
  if (existsSync(generatedPath)) {
    const content = readFileSync(generatedPath, 'utf-8');
    registered = content.includes(`'${schema.name}':`);
  }

  return {
    presentational,
    wrapper,
    registered,
    presentationalPath,
    wrapperPath
  };
}

