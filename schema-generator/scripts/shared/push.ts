import { readFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { validateSchemaFile } from './validation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: resolve(__dirname, '../../../storyblok-app/.env.local') });

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;
const STORYBLOK_MANAGEMENT_TOKEN = process.env.STORYBLOK_MANAGEMENT_TOKEN;
const STORYBLOK_SPACE_ID = process.env.STORYBLOK_SPACE_ID;

export interface PushOptions {
  validate?: boolean;
  method?: 'n8n' | 'direct';
}

export async function pushSchemaToStoryblok(
  componentName: string,
  schemasRoot: string,
  options: PushOptions = { validate: true, method: 'n8n' }
): Promise<{ success: boolean; componentId?: string; message?: string }> {
  // Validate schema before pushing if enabled
  if (options.validate !== false) {
    const validation = await validateSchemaFile(componentName, schemasRoot);
    if (!validation.valid) {
      console.error(`\n   ❌ Validation failed for ${componentName}:`);
      validation.errors.forEach((error, index) => {
        const prefix = error.field ? `   [${error.field}]` : '   ';
        console.error(`${index + 1}. ${prefix} ${error.message}`);
      });
      return { success: false, message: 'Validation failed' };
    }
    console.log(`   ✅ Validation passed`);
  }

  // Try to find schema in both bloks and nested directories
  const bloksPath = join(schemasRoot, 'bloks', `${componentName}.json`);
  const nestedPath = join(schemasRoot, 'nested', `${componentName}.json`);
  
  let schemaContent: string;
  
  try {
    try {
      schemaContent = readFileSync(bloksPath, 'utf-8');
    } catch {
      schemaContent = readFileSync(nestedPath, 'utf-8');
    }
  } catch (error: any) {
    return { 
      success: false, 
      message: `Schema file not found: ${componentName}.json` 
    };
  }
  
  const schema = JSON.parse(schemaContent);

  // Use n8n webhook or direct API
  if (options.method === 'n8n' || !options.method) {
    return await pushViaN8n(componentName, schema);
  } else {
    return await pushViaDirectAPI(componentName, schema);
  }
}

async function pushViaN8n(componentName: string, schema: any): Promise<{ success: boolean; componentId?: string; message?: string }> {
  if (!N8N_WEBHOOK_URL) {
    return { 
      success: false, 
      message: 'N8N_WEBHOOK_URL not set in environment variables' 
    };
  }

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(schema),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { 
        success: false, 
        message: `HTTP ${response.status}: ${errorText}` 
      };
    }

    const responseText = await response.text();
    
    // Handle empty response (n8n might return empty body on success)
    if (!responseText || responseText.trim() === '') {
      return { 
        success: true, 
        message: 'Schema pushed successfully (n8n returned empty response)' 
      };
    }

    try {
      const result = JSON.parse(responseText) as { componentId?: string; message?: string; success?: boolean };
      return {
        success: result.success !== false,
        componentId: result.componentId,
        message: result.message || 'Schema pushed successfully'
      };
    } catch (parseError: any) {
      // If response is not JSON, treat HTTP 200 as success
      return { 
        success: true, 
        message: `Schema pushed (HTTP ${response.status})` 
      };
    }
  } catch (error: any) {
    return { 
      success: false, 
      message: `Error: ${error.message}` 
    };
  }
}

async function pushViaDirectAPI(componentName: string, schema: any): Promise<{ success: boolean; componentId?: string; message?: string }> {
  if (!STORYBLOK_MANAGEMENT_TOKEN || !STORYBLOK_SPACE_ID) {
    return { 
      success: false, 
      message: 'STORYBLOK_MANAGEMENT_TOKEN or STORYBLOK_SPACE_ID not set' 
    };
  }

  const MAPI_BASE_URL = `https://mapi.storyblok.com/v1/spaces/${STORYBLOK_SPACE_ID}`;

  try {
    // First, get all components to find the one we need
    const listUrl = `${MAPI_BASE_URL}/components`;
    const listResponse = await fetch(listUrl, {
      method: 'GET',
      headers: {
        'Authorization': STORYBLOK_MANAGEMENT_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    if (!listResponse.ok) {
      const error = await listResponse.text();
      return { 
        success: false, 
        message: `Failed to list components: ${error}` 
      };
    }

    const listData = await listResponse.json() as { components?: Array<{ id: string; name: string }> };
    const existingComponent = listData.components?.find((c) => c.name === componentName);

    if (existingComponent) {
      // Component exists, update it
      const updateUrl = `${MAPI_BASE_URL}/components/${existingComponent.id}`;
      const updateResponse = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Authorization': STORYBLOK_MANAGEMENT_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          component: schema,
        }),
      });

      if (updateResponse.ok) {
        const result = await updateResponse.json() as { component?: { id: string } };
        return {
          success: true,
          componentId: result.component?.id || existingComponent.id,
          message: `Component '${componentName}' updated successfully`
        };
      } else {
        const error = await updateResponse.text();
        return { 
          success: false, 
          message: `Failed to update component: ${error}` 
        };
      }
    } else {
      // Component doesn't exist, create it
      const createUrl = `${MAPI_BASE_URL}/components`;
      const createResponse = await fetch(createUrl, {
        method: 'POST',
        headers: {
          'Authorization': STORYBLOK_MANAGEMENT_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(schema),
      });

      if (createResponse.ok) {
        const result = await createResponse.json() as { component?: { id: string } };
        return {
          success: true,
          componentId: result.component?.id,
          message: `Component '${componentName}' created successfully`
        };
      } else {
        const error = await createResponse.text();
        return { 
          success: false, 
          message: `Failed to create component: ${error}` 
        };
      }
    }
  } catch (error: any) {
    return { 
      success: false, 
      message: `Error: ${error.message}` 
    };
  }
}

