import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export interface SchemaField {
  type: string;
  required?: boolean;
  description?: string;
  pos?: number;
  options?: Array<{ value: string; name: string }>;
  component_whitelist?: string[];
  restrict_components?: boolean;
  [key: string]: any;
}

export interface StoryblokSchema {
  name: string;
  display_name: string;
  is_nestable: boolean;
  is_root: boolean;
  schema: Record<string, SchemaField>;
}

export interface ValidationError {
  field?: string;
  message: string;
}

export const VALID_FIELD_TYPES = [
  'text',
  'textarea',
  'number',
  'boolean',
  'option',
  'multilink',
  'asset',
  'bloks',
  'richtext',
  'markdown',
  'date',
  'datetime',
  'file',
  'image',
  'video',
  'custom',
];

export function validateSchemaStructure(schema: StoryblokSchema, componentName: string): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate schema structure
  if (!schema.name) {
    errors.push({ message: 'Schema missing "name" field' });
  }

  if (!schema.display_name) {
    errors.push({ message: 'Schema missing "display_name" field' });
  }

  if (schema.name !== componentName) {
    errors.push({ 
      message: `Schema name "${schema.name}" does not match component name "${componentName}"` 
    });
  }

  if (typeof schema.is_nestable !== 'boolean') {
    errors.push({ message: 'Schema "is_nestable" must be a boolean' });
  }

  if (typeof schema.is_root !== 'boolean') {
    errors.push({ message: 'Schema "is_root" must be a boolean' });
  }

  if (!schema.schema || typeof schema.schema !== 'object') {
    errors.push({ message: 'Schema missing or invalid "schema" field' });
    return errors; // Can't continue without schema
  }

  // Validate fields
  const fieldNames = Object.keys(schema.schema);
  const positions: number[] = [];

  for (const [fieldName, field] of Object.entries(schema.schema)) {
    // Validate field type
    if (!field.type) {
      errors.push({ field: fieldName, message: 'Field missing "type"' });
      continue;
    }

    if (!VALID_FIELD_TYPES.includes(field.type)) {
      errors.push({ 
        field: fieldName, 
        message: `Invalid field type "${field.type}". Valid types: ${VALID_FIELD_TYPES.join(', ')}` 
      });
    }

    // Validate position
    if (field.pos !== undefined) {
      if (typeof field.pos !== 'number') {
        errors.push({ field: fieldName, message: 'Field "pos" must be a number' });
      } else if (positions.includes(field.pos)) {
        errors.push({ field: fieldName, message: `Duplicate position ${field.pos}` });
      } else {
        positions.push(field.pos);
      }
    }

    // Validate required field
    if (field.required !== undefined && typeof field.required !== 'boolean') {
      errors.push({ field: fieldName, message: 'Field "required" must be a boolean' });
    }

    // Validate option fields
    if (field.type === 'option') {
      if (!field.options || !Array.isArray(field.options)) {
        errors.push({ field: fieldName, message: 'Option field must have "options" array' });
      } else {
        for (const option of field.options) {
          if (!option.value || !option.name) {
            errors.push({ field: fieldName, message: 'Option must have "value" and "name"' });
          }
        }
      }
    }

    // Validate bloks fields
    if (field.type === 'bloks') {
      if (field.restrict_components && !field.component_whitelist) {
        errors.push({ 
          field: fieldName, 
          message: 'Bloks field with restrict_components must have component_whitelist' 
        });
      }
    }
  }

  // Check for sequential positions
  if (positions.length > 0) {
    const sortedPositions = [...positions].sort((a, b) => a - b);
    for (let i = 0; i < sortedPositions.length; i++) {
      if (sortedPositions[i] !== i) {
        errors.push({ 
          message: `Field positions are not sequential. Expected ${i}, found ${sortedPositions[i]}` 
        });
        break;
      }
    }
  }

  return errors;
}

export function checkNestedComponents(schema: StoryblokSchema, schemasRoot: string): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const [fieldName, field] of Object.entries(schema.schema)) {
    if (field.type === 'bloks' && field.component_whitelist) {
      for (const nestedComponentName of field.component_whitelist) {
        const nestedBloksPath = join(schemasRoot, 'bloks', `${nestedComponentName}.json`);
        const nestedNestedPath = join(schemasRoot, 'nested', `${nestedComponentName}.json`);
        
        if (!existsSync(nestedBloksPath) && !existsSync(nestedNestedPath)) {
          errors.push({ 
            field: fieldName,
            message: `Referenced nested component "${nestedComponentName}" schema not found` 
          });
        }
      }
    }
  }

  return errors;
}

export async function validateSchemaFile(componentName: string, schemasRoot: string): Promise<{ valid: boolean; errors: ValidationError[] }> {
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
      valid: false,
      errors: [{ message: `Schema file not found: ${componentName}.json` }]
    };
  }

  const schema: StoryblokSchema = JSON.parse(schemaContent);

  // Validate schema structure
  const schemaErrors = validateSchemaStructure(schema, componentName);
  const nestedErrors = checkNestedComponents(schema, schemasRoot);

  const allErrors = [...schemaErrors, ...nestedErrors];

  return {
    valid: allErrors.length === 0,
    errors: allErrors
  };
}

