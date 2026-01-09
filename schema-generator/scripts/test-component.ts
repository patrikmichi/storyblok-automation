import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { loadSchema } from './shared/schema-loader.js';
import { checkComponentFiles, toPascalCase } from './shared/component-checker.js';
import { StoryblokSchema } from './shared/validation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function generateTestData(schema: StoryblokSchema): any {
  const testData: any = {
    _uid: 'test-uid-123',
    component: schema.name,
  };

  for (const [fieldName, field] of Object.entries(schema.schema)) {
    if (field.default_value !== undefined) {
      testData[fieldName] = field.default_value;
    } else {
      switch (field.type) {
        case 'text':
        case 'textarea':
          testData[fieldName] = `Test ${fieldName}`;
          break;
        case 'number':
          testData[fieldName] = 0;
          break;
        case 'boolean':
          testData[fieldName] = false;
          break;
        case 'option':
          if (field.options && field.options.length > 0) {
            testData[fieldName] = field.options[0].value;
          } else {
            testData[fieldName] = 'option1';
          }
          break;
        case 'multilink':
          testData[fieldName] = {
            url: 'https://example.com',
            linktype: 'url',
          };
          break;
        case 'asset':
          testData[fieldName] = 'https://example.com/image.jpg';
          break;
        case 'bloks':
          testData[fieldName] = [];
          break;
        default:
          testData[fieldName] = null;
      }
    }
  }

  return testData;
}

function generateTestPage(schema: StoryblokSchema, testData: any): string {
  const componentName = toPascalCase(schema.name);
  const wrapperName = `${componentName}Blok`;
  const importPath = `@/src/storyblok/components/${schema.name}`;

  return `// Test page for ${schema.display_name}
// Add this to a test page in Storyblok or use in development

import ${wrapperName} from '${importPath}'

const testData = ${JSON.stringify(testData, null, 2)}

export default function TestPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Testing: ${schema.display_name}</h1>
      <${wrapperName} blok={testData} />
    </div>
  )
}
`;
}

async function testComponent(componentName: string) {
  const schemasRoot = join(__dirname, '..', 'schemas', 'storyblok');
  const appRoot = join(__dirname, '..', '..', 'storyblok-app');

  let schema: StoryblokSchema;
  try {
    const loaded = loadSchema(componentName, schemasRoot);
    schema = loaded.schema;
  } catch (error: any) {
    console.error(`❌ ${error.message}`);
    process.exit(1);
  }

  console.log(`\n🧪 Testing component: ${componentName}`);
  console.log(`   Display Name: ${schema.display_name}\n`);

  // Check component files
  const files = checkComponentFiles(schema, appRoot);
  
  console.log('📁 Component Files:');
  console.log(`   Presentational: ${files.presentational ? '✅' : '❌'}`);
  console.log(`   Storyblok Wrapper: ${files.wrapper ? '✅' : '❌'}`);
  console.log(`   Registered: ${files.registered ? '✅' : '❌'}`);

  if (!files.presentational || !files.wrapper || !files.registered) {
    console.error('\n❌ Component files are missing. Run: npm run generate:component ' + componentName);
    process.exit(1);
  }

  // Generate test data
  const testData = generateTestData(schema);
  console.log('\n📊 Test Data Generated:');
  console.log(JSON.stringify(testData, null, 2));

  // Generate test page code
  const testPageCode = generateTestPage(schema, testData);
  const testPagePath = join(__dirname, '..', '..', 'storyblok-app', 'test', `${componentName}.test.tsx`);
  const testDir = join(__dirname, '..', '..', 'storyblok-app', 'test');
  mkdirSync(testDir, { recursive: true });
  writeFileSync(testPagePath, testPageCode);
  console.log(`\n✅ Test page generated: ${testPagePath}`);

  // Check schema fields accessibility
  console.log('\n🔍 Schema Fields Check:');
  const fieldNames = Object.keys(schema.schema);
  let allAccessible = true;

  for (const fieldName of fieldNames) {
    if (testData[fieldName] !== undefined) {
      console.log(`   ✅ ${fieldName}: accessible`);
    } else {
      console.log(`   ❌ ${fieldName}: not accessible`);
      allAccessible = false;
    }
  }

  // Check nested components
  const nestedFields = Object.entries(schema.schema).filter(([_, f]) => f.type === 'bloks');
  if (nestedFields.length > 0) {
    console.log('\n🔗 Nested Components:');
    for (const [fieldName, field] of nestedFields) {
      if (field.component_whitelist) {
        console.log(`   ${fieldName}: ${field.component_whitelist.join(', ')}`);
      }
    }
  }

  console.log('\n✅ Component test complete!');
  console.log('\n📝 Next steps:');
  console.log(`   1. Review test data: ${JSON.stringify(testData, null, 2)}`);
  console.log(`   2. Add component to a test page in Storyblok`);
  console.log(`   3. View at http://localhost:3000`);
  console.log(`   4. Test all fields and variants`);

  return allAccessible;
}

const args = process.argv.slice(2);

if (args.length < 1) {
  console.error('Usage: npm run test:component <component_name>');
  console.error('Example: npm run test:component benefits_section');
  process.exit(1);
}

testComponent(args[0]).then((success) => {
  process.exit(success ? 0 : 1);
}).catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});

