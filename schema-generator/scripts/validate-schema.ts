import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { validateSchemaFile, validateSchemaStructure, checkNestedComponents } from './shared/validation.js';
import { checkComponentFiles } from './shared/component-checker.js';
import { loadSchema } from './shared/schema-loader.js';
import { ValidationError } from './shared/validation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function validateSchemaFileCLI(componentName: string) {
  const schemasRoot = join(__dirname, '..', 'schemas', 'storyblok');
  const appRoot = join(__dirname, '..', '..', 'storyblok-app');

  try {
    const { schema } = loadSchema(componentName, schemasRoot);

    console.log(`\n🔍 Validating schema: ${componentName}`);
    console.log(`   Display Name: ${schema.display_name}`);
    console.log(`   Fields: ${Object.keys(schema.schema).length}\n`);

    // Validate schema structure
    const schemaErrors = validateSchemaStructure(schema, componentName);
    const nestedErrors = checkNestedComponents(schema, schemasRoot);
    
    // Check React components
    const componentFiles = checkComponentFiles(schema, appRoot);
    const reactErrors: ValidationError[] = [];
    if (!componentFiles.presentational) {
      reactErrors.push({ message: `Presentational component not found: ${componentFiles.presentationalPath}` });
    }
    if (!componentFiles.wrapper) {
      reactErrors.push({ message: `Storyblok wrapper not found: ${componentFiles.wrapperPath}` });
    }
    if (!componentFiles.registered) {
      reactErrors.push({ message: `Component not registered in generated.components.ts` });
    }

    const allErrors = [...schemaErrors, ...reactErrors, ...nestedErrors];

    if (allErrors.length === 0) {
      console.log('✅ Schema validation passed!');
      console.log('   ✓ Schema structure is valid');
      console.log('   ✓ Field types are valid');
      console.log('   ✓ React components exist');
      console.log('   ✓ Component is registered');
      console.log('   ✓ Nested components exist');
      return true;
    } else {
      console.error('❌ Schema validation failed:\n');
      allErrors.forEach((error, index) => {
        const prefix = error.field ? `   [${error.field}]` : '   ';
        console.error(`${index + 1}. ${prefix} ${error.message}`);
      });
      return false;
    }
  } catch (error: any) {
    console.error(`❌ ${error.message}`);
    return false;
  }
}

const args = process.argv.slice(2);

if (args.length < 1) {
  console.error('Usage: npm run validate:schema <component_name>');
  console.error('Example: npm run validate:schema benefits_section');
  process.exit(1);
}

validateSchemaFileCLI(args[0]).then((success) => {
  process.exit(success ? 0 : 1);
}).catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});

