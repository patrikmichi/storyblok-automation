import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { pushSchemaToStoryblok } from './shared/push.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const schemasRoot = join(__dirname, '..', 'schemas', 'storyblok');

async function pushSchema(componentName: string) {
  console.log(`\n📤 Pushing schema to n8n: ${componentName}`);
  
  const result = await pushSchemaToStoryblok(componentName, schemasRoot, {
    validate: true,
    method: 'n8n'
  });

  if (result.success) {
    console.log(`   ✅ ${result.message}`);
    if (result.componentId) {
      console.log(`   Component ID: ${result.componentId}`);
    }
    return true;
  } else {
    console.error(`   ❌ ${result.message}`);
    return false;
  }
}

async function pushAllSchemas() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('📤 Pushing all schemas to Storyblok via n8n...\n');
    
    // Main bloks (sections)
    const bloksToUpdate = [
      'benefits_section',
      'business_types_section',
      'cta_section',
      'default-page',
    ];
    
    // Nested bloks (items, buttons, cards)
    const nestedToUpdate = [
      'benefit_item',
      'business_type_card',
      'primary_button',
      'secondary_button',
    ];
    
    const componentsToUpdate = [...bloksToUpdate, ...nestedToUpdate];

    let successCount = 0;
    let failCount = 0;

    for (const componentName of componentsToUpdate) {
      const success = await pushSchema(componentName);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Failed: ${failCount}`);
  } else {
    // Push specific component
    const componentName = args[0];
    await pushSchema(componentName);
  }
}

pushAllSchemas().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});

