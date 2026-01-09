import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { loadSchema } from './shared/schema-loader.js';
import { toPascalCase, checkComponentFiles } from './shared/component-checker.js';
import { StoryblokSchema, SchemaField } from './shared/validation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function getTypeScriptType(field: SchemaField, fieldName: string): string {
  const isRequired = field.required !== false;
  const optional = isRequired ? '' : '?';

  switch (field.type) {
    case 'text':
    case 'textarea':
      return `string${optional}`;
    case 'number':
      return `number${optional}`;
    case 'boolean':
      return `boolean${optional}`;
    case 'option':
      if (field.options && field.options.length > 0) {
        const values = field.options.map(opt => `'${opt.value}'`).join(' | ');
        return `${values}${optional}`;
      }
      return `string${optional}`;
    case 'multilink':
      return `{\n    url?: string\n    cached_url?: string\n    id?: string\n    email?: string\n    linktype?: string\n  }${optional}`;
    case 'asset':
      return `string${optional}`;
    case 'bloks':
      return `Array<{\n    _uid: string\n    component: string\n    [key: string]: any\n  }>${optional}`;
    default:
      return `any${optional}`;
  }
}

function generatePresentationalComponent(schema: StoryblokSchema, figmaCode?: string): string {
  const componentName = toPascalCase(schema.name);
  const propsName = `${componentName}Props`;
  const fileName = componentName;
  const cssModuleName = `${fileName}.module.css`;

  // Generate props interface
  const props: string[] = [];
  const propDescriptions: string[] = [];

  for (const [fieldName, field] of Object.entries(schema.schema)) {
    const tsType = getTypeScriptType(field, fieldName);
    const description = field.description ? `  // ${field.description}` : '';
    props.push(`  ${fieldName}: ${tsType}${description}`);
    
    if (field.description) {
      propDescriptions.push(` * @param ${fieldName} - ${field.description}`);
    }
  }

  props.push('  className?: string');

  // Check if we have Figma code to generate actual implementation
  if (figmaCode) {
    return generateComponentFromFigma(schema, figmaCode);
  }

  // Generate skeleton component code (fallback)
  // Determine imports needed
  const skeletonImports: string[] = [`import styles from './${cssModuleName}'`];
  if (schema.schema.headline) {
    skeletonImports.push(`import { SectionHeader } from './SectionHeader'`);
  }

  // Generate skeleton JSX
  let skeletonJSX = '';
  skeletonJSX += `    <div className={\`\${styles.section \${className}}\`}>\n`;
  skeletonJSX += `      <div className={styles.container}>\n`;
  
  if (schema.schema.headline) {
    const hasAlignment = schema.schema.alignment !== undefined;
    const hasShowSubtext = schema.schema.show_subtext !== undefined;
    const alignmentProp = hasAlignment ? `alignment={alignment || 'Center'}` : `alignment="Center"`;
    const showSubtextProp = hasShowSubtext ? `showSubtext={show_subtext !== false}` : `showSubtext={true}`;
    const darkModeProp = `darkMode={${schema.schema.background ? `background === 'Dark'` : 'false'}}`;
    
    skeletonJSX += `        <SectionHeader\n`;
    skeletonJSX += `          headline={headline}\n`;
    skeletonJSX += `          headingLevel={heading_level || 'h2'}\n`;
    if (schema.schema.subtext) {
      skeletonJSX += `          subtext={subtext}\n`;
    }
    skeletonJSX += `          ${showSubtextProp}\n`;
    skeletonJSX += `          ${alignmentProp}\n`;
    skeletonJSX += `          ${darkModeProp}\n`;
    skeletonJSX += `        />\n`;
  }
  
  skeletonJSX += `        {/* TODO: Implement component content based on Figma design */}\n`;
  skeletonJSX += `      </div>\n`;
  skeletonJSX += `    </div>\n`;

  const componentCode = `${skeletonImports.join('\n')}

export interface ${propsName} {
${props.join('\n')}
}

/**
 * ${schema.display_name} Component
${propDescriptions.join('\n')}
 */
export function ${componentName}({
${Object.keys(schema.schema).map(key => `  ${key},`).join('\n')}
  className = '',
}: ${propsName}) {
  return (
${skeletonJSX}  )
}
`;

  return componentCode;
}

/**
 * Generate component implementation from Figma design
 */
function generateComponentFromFigma(schema: StoryblokSchema, figmaCode: string): string {
  const componentName = toPascalCase(schema.name);
  const propsName = `${componentName}Props`;
  const cssModuleName = `${componentName}.module.css`;

  // Generate props interface
  const props: string[] = [];
  for (const [fieldName, field] of Object.entries(schema.schema)) {
    const tsType = getTypeScriptType(field, fieldName);
    props.push(`  ${fieldName}: ${tsType}`);
  }
  props.push('  className?: string');

  // Build JSX structure
  let jsx = '';
  jsx += `    <div className={\`\${styles.section} \${background === 'White' ? styles.sectionWhite : background === 'Grey' ? styles.sectionGrey : background === 'Dark' ? styles.sectionDark : styles.sectionWhite} \${className}\`}\n`;
  jsx += `      style={{\n`;
  jsx += `        paddingTop: \`\${padding_top || 96}px\`,\n`;
  jsx += `        paddingBottom: \`\${padding_bottom || 96}px\`,\n`;
  jsx += `      }}\n`;
  jsx += `    >\n`;
  jsx += `      <div className={styles.container}>\n`;
  
  // Header - Use shared SectionHeader component
  if (schema.schema.headline) {
    const hasAlignment = schema.schema.alignment !== undefined;
    const hasShowSubtext = schema.schema.show_subtext !== undefined;
    const alignmentProp = hasAlignment ? `alignment={alignment || 'Center'}` : `alignment="Center"`;
    const showSubtextProp = hasShowSubtext ? `showSubtext={show_subtext !== false}` : `showSubtext={true}`;
    const darkModeProp = `darkMode={${schema.schema.background ? `background === 'Dark'` : 'false'}}`;
    
    jsx += `        <SectionHeader\n`;
    jsx += `          headline={headline}\n`;
    jsx += `          headingLevel={heading_level || 'h2'}\n`;
    if (schema.schema.subtext) {
      jsx += `          subtext={subtext}\n`;
    }
    jsx += `          ${showSubtextProp}\n`;
    jsx += `          ${alignmentProp}\n`;
    jsx += `          ${darkModeProp}\n`;
    jsx += `        />\n`;
  }

  // Benefits grid
  if (schema.schema.benefits) {
    jsx += `        <div className={styles.benefitsGrid}>\n`;
    jsx += `          {benefits?.map((benefit) => (\n`;
    jsx += `            <BenefitItem key={benefit._uid} {...benefit} />\n`;
    jsx += `          ))}\n`;
    jsx += `        </div>\n`;
  }

  jsx += `      </div>\n`;
  jsx += `    </div>\n`;

  // Determine imports needed
  const imports: string[] = [`import styles from './${cssModuleName}'`];
  if (schema.schema.headline) {
    imports.push(`import { SectionHeader } from './SectionHeader'`);
  }
  if (schema.schema.benefits) {
    imports.push(`import { BenefitItem } from './BenefitItem'`);
  }

  const componentCode = `${imports.join('\n')}

export interface ${propsName} {
${props.join('\n')}
}

export function ${componentName}({
${Object.keys(schema.schema).map(key => `  ${key},`).join('\n')}
  className = '',
}: ${propsName}) {
  return (
${jsx}  )
}
`;

  return componentCode;
}

/**
 * Generate CSS from Figma design context
 */
function generateCSSFromFigma(schema: StoryblokSchema, figmaCode: string): string {
  const componentName = toCamelCase(schema.name);
  
  let css = `/* ${schema.display_name} - Exact Figma specs */\n\n`;

  // Section styles
  css += `.section {\n`;
  css += `  display: flex;\n`;
  css += `  flex-direction: column;\n`;
  css += `  align-items: center;\n`;
  css += `  padding-left: 0;\n`;
  css += `  padding-right: 0;\n`;
  css += `  width: 100%;\n`;
  css += `}\n\n`;

  css += `.sectionWhite {\n`;
  css += `  background-color: #FFFFFF;\n`;
  css += `}\n\n`;

  css += `.sectionGrey {\n`;
  css += `  background-color: #F7F7F7;\n`;
  css += `}\n\n`;

  css += `.sectionDark {\n`;
  css += `  background-color: #042A47;\n`;
  css += `}\n\n`;

  // Container
  css += `.container {\n`;
  css += `  display: flex;\n`;
  css += `  flex-direction: column;\n`;
  css += `  gap: 48px;\n`;
  css += `  align-items: center;\n`;
  css += `  width: 100%;\n`;
  css += `  max-width: 1216px;\n`;
  css += `}\n\n`;

  // Header styles are handled by shared SectionHeader component
  // No need to generate header CSS here

  // Benefits grid
  if (schema.schema.benefits) {
    css += `.benefitsGrid {\n`;
    css += `  display: flex;\n`;
    css += `  flex-wrap: wrap;\n`;
    css += `  gap: 32px;\n`;
    css += `  align-items: flex-start;\n`;
    css += `  width: 100%;\n`;
    css += `}\n\n`;
  }

  return css;
}

function generateStoryblokWrapper(schema: StoryblokSchema): string {
  const componentName = toPascalCase(schema.name);
  const wrapperName = `${componentName}Blok`;
  const fileName = schema.name;
  const importPath = `@/src/components/presentational/${componentName}`;

  // Generate blok interface
  const blokProps: string[] = ['  _uid: string', `  component: '${schema.name}'`];
  
  for (const [fieldName, field] of Object.entries(schema.schema)) {
    const tsType = getTypeScriptType(field, fieldName);
    blokProps.push(`  ${fieldName}: ${tsType}`);
  }

  // Generate wrapper code
  const wrapperCode = `'use client'

import { ${componentName} } from '${importPath}'

interface ${wrapperName} {
${blokProps.join('\n')}
}

export default function ${wrapperName}({ blok }: { blok: ${wrapperName} }) {
  return (
    <${componentName}
${Object.keys(schema.schema).map(key => `      ${key}={blok.${key}}`).join('\n')}
    />
  )
}
`;

  return wrapperCode;
}

function updateGeneratedComponents(schema: StoryblokSchema, appRoot: string): void {
  const generatedPath = join(appRoot, 'src', 'storyblok', 'generated.components.ts');
  
  if (!existsSync(generatedPath)) {
    console.error(`❌ generated.components.ts not found at ${generatedPath}`);
    return;
  }

  let content = readFileSync(generatedPath, 'utf-8');
  const pascalComponentName = toPascalCase(schema.name);
  const importPath = `./components/${schema.name}`;

  // Check if import already exists
  if (content.includes(`from '${importPath}'`)) {
    console.log(`   ⚠️  Component already imported in generated.components.ts`);
    return;
  }

  // Add import
  const importRegex = /(import .+ from '\.\/components\/.+'\n)/g;
  const lastImport = content.match(importRegex);
  if (lastImport) {
    const lastImportIndex = content.lastIndexOf(lastImport[lastImport.length - 1]);
    const insertIndex = lastImportIndex + lastImport[lastImport.length - 1].length;
    content = content.slice(0, insertIndex) + `import ${pascalComponentName} from '${importPath}'\n` + content.slice(insertIndex);
  } else {
    // No imports found, add after React import
    const reactImportIndex = content.indexOf("import React from 'react'");
    if (reactImportIndex !== -1) {
      const insertIndex = content.indexOf('\n', reactImportIndex) + 1;
      content = content.slice(0, insertIndex) + `import ${pascalComponentName} from '${importPath}'\n` + content.slice(insertIndex);
    }
  }

  // Add to storyblokComponents map
  const mapRegex = /export const storyblokComponents: Record<string, React\.ComponentType<\{ blok: any \}>> = \{([\s\S]*?)\}/;
  const mapMatch = content.match(mapRegex);
  
  if (mapMatch) {
    const mapContent = mapMatch[1];
    const entries = mapContent.trim().split('\n').filter((line: string) => line.trim() && !line.trim().startsWith('//'));
    
    // Check if entry already exists
    if (entries.some((entry: string) => entry.includes(`'${schema.name}'`))) {
      console.log(`   ⚠️  Component already registered in storyblokComponents`);
      return;
    }

    // Add new entry
    const lastEntry = entries[entries.length - 1];
    const newEntry = `  '${schema.name}': ${pascalComponentName},`;
    const updatedMapContent = mapContent.trim() + (mapContent.trim() ? '\n' : '') + newEntry;
    
    content = content.replace(mapRegex, `export const storyblokComponents: Record<string, React.ComponentType<{ blok: any }>> = {${updatedMapContent}\n}`);
  }

  writeFileSync(generatedPath, content);
  console.log(`   ✅ Updated generated.components.ts`);
}

async function generateComponent(componentName: string) {
  const schemasRoot = join(__dirname, '..', 'schemas', 'storyblok');
  
  let schema: StoryblokSchema;
  try {
    const loaded = loadSchema(componentName, schemasRoot);
    schema = loaded.schema;
  } catch (error: any) {
    console.error(`❌ ${error.message}`);
    process.exit(1);
  }
  const appRoot = join(__dirname, '..', '..', 'storyblok-app');

  const pascalComponentName = toPascalCase(schema.name);
  
  console.log(`\n📦 Generating React component for: ${componentName}`);
  console.log(`   Display Name: ${schema.display_name}`);

  // Check if components already exist
  const componentFiles = checkComponentFiles(schema, appRoot);
  const presentationalDir = join(appRoot, 'src', 'components', 'presentational');
  const presentationalPath = componentFiles.presentationalPath;
  const cssModulePath = join(presentationalDir, `${pascalComponentName}.module.css`);
  const wrapperPath = componentFiles.wrapperPath;

  if (componentFiles.presentational && componentFiles.wrapper) {
    console.log(`\n⏭️  Component already exists, skipping generation:`);
    console.log(`   - Presentational: ${presentationalPath}`);
    console.log(`   - Wrapper: ${wrapperPath}`);
    console.log(`\n💡 To regenerate, delete the existing files first.`);
    return;
  }

  // Try to load Figma design context if available
  let figmaCode: string | undefined;
  const figmaContextPath = join(schemasRoot, 'figma-context', `${componentName}.txt`);
  if (existsSync(figmaContextPath)) {
    try {
      figmaCode = readFileSync(figmaContextPath, 'utf-8');
      console.log(`   📐 Using Figma design context for implementation`);
    } catch {
      // Ignore if can't read
    }
  }

  // Generate presentational component (with Figma code if available)
  const presentationalCode = generatePresentationalComponent(schema, figmaCode);
  mkdirSync(presentationalDir, { recursive: true });
  
  if (!componentFiles.presentational) {
    writeFileSync(presentationalPath, presentationalCode);
    console.log(`   ✅ Created: ${presentationalPath}`);
  } else {
    console.log(`   ⏭️  Skipped (exists): ${presentationalPath}`);
  }

  // Generate CSS module (with Figma styles if available)
  if (!existsSync(cssModulePath)) {
    const cssCode = figmaCode ? generateCSSFromFigma(schema, figmaCode) : `.${toCamelCase(schema.name)} {\n  /* Add your styles here */\n}\n`;
    writeFileSync(cssModulePath, cssCode);
    console.log(`   ✅ Created: ${cssModulePath}`);
  } else {
    console.log(`   ⏭️  Skipped (exists): ${cssModulePath}`);
  }

  // Generate Storyblok wrapper
  const wrapperCode = generateStoryblokWrapper(schema);
  const wrapperDir = join(appRoot, 'src', 'storyblok', 'components');
  mkdirSync(wrapperDir, { recursive: true });
  
  if (!componentFiles.wrapper) {
    writeFileSync(wrapperPath, wrapperCode);
    console.log(`   ✅ Created: ${wrapperPath}`);
  } else {
    console.log(`   ⏭️  Skipped (exists): ${wrapperPath}`);
  }

  // Update generated.components.ts (always update registration)
  updateGeneratedComponents(schema, appRoot);

  console.log(`\n✅ Component generation complete!`);
  console.log(`\n📝 Next steps:`);
  console.log(`   1. Implement the component JSX in ${presentationalPath}`);
  console.log(`   2. Add styles to ${cssModulePath}`);
  console.log(`   3. Test the component in Storyblok`);
}

const args = process.argv.slice(2);

if (args.length < 1) {
  console.error('Usage: npm run generate:component <component_name>');
  console.error('Example: npm run generate:component benefits_section');
  process.exit(1);
}

generateComponent(args[0]).catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});

