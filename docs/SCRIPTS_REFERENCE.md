# Scripts Reference

## All Scripts Are Needed

All scripts serve a purpose in the workflow. None are redundant.

## Script Purposes

### Core Workflow Scripts

#### 1. `generate-schema.ts` ⭐ **Primary Script**
- **Purpose**: Generate Storyblok schema from component name
- **Auto-features**: 
  - ✅ Auto-validates schema structure
  - ✅ Auto-pushes to Storyblok (via n8n)
  - ⏭️ Skips if schema already exists
- **Use case**: First step in any workflow
- **Command**: `npm run generate:schema <name> "<Display Name>"`

#### 2. `generate-component.ts` ⭐ **Primary Script**
- **Purpose**: Generate React components from schema
- **Auto-features**:
  - ✅ Auto-registers in `generated.components.ts`
  - ⏭️ Skips if components already exist
- **Use case**: After schema generation
- **Command**: `npm run generate:component <name>`

#### 3. `orchestrate.ts` ⭐ **Orchestration Script**
- **Purpose**: Complete workflow orchestration
- **What it does**:
  - Validates existing schema
  - Generates React component
  - Pushes to Storyblok
  - **Runs code review** (TypeScript type checking & ESLint)
- **Use case**: When schema already exists, run full workflow
- **Command**: `npm run orchestrate <name> [options]`
- **Options**: `--skip-validation`, `--skip-component`, `--skip-push`, `--skip-code-review`
- **Note**: Requires schema to exist first

### Manual/Debug Scripts

#### 4. `validate-schema.ts` 🔧 **Manual Validation**
- **Purpose**: Validate schema structure manually
- **Use case**: 
  - Debugging schema issues
  - Manual validation before push
  - CI/CD validation
- **Command**: `npm run validate:schema <name>`
- **Why needed**: `generate-schema` auto-validates, but manual validation is useful for debugging

#### 5. `push-schema-n8n.ts` 🔧 **Manual Push (n8n)**
- **Purpose**: Push schema to Storyblok via n8n webhook
- **Use case**:
  - Re-pushing existing schema
  - Manual push when auto-push is disabled
  - Debugging push issues
  - Pushing multiple schemas
- **Command**: `npm run push:schema:n8n [<name>]`
- **Why needed**: `generate-schema` auto-pushes, but manual push is useful for re-pushing or debugging

#### 6. `push-schema.ts` 🔧 **Manual Push (Direct API)**
- **Purpose**: Push schema to Storyblok via direct API
- **Use case**:
  - When n8n is not available
  - Direct API access preferred
  - Debugging API issues
- **Command**: `npm run push:schema [<name>]`
- **Why needed**: Alternative to n8n, useful when n8n is unavailable

#### 7. `test-component.ts` 🔧 **Manual Testing**
- **Purpose**: Test component setup and generate test data
- **Use case**:
  - Verify component works correctly
  - Generate test data
  - Debug component issues
- **Command**: `npm run test:component <name>`
- **Why needed**: Useful for debugging and verification

### Utility Scripts

#### 9. `schema-mapper.ts` 🛠️ **Core Utility**
- **Purpose**: Map Figma structures to Storyblok schemas
- **Use case**: Used by `generate-schema.ts` internally
- **Not run directly**: Imported by other scripts
- **Why needed**: Core mapping logic, required for schema generation

## Workflow Comparison

### Automatic Workflow
```
generate-schema.ts  →  generate-component.ts
   (schema + push)      (component + register)
```

### Orchestrated Workflow
```
generate-schema.ts  →  orchestrate.ts
   (schema only)         (validate + component + push + code review)
```

### Manual Workflow
```
generate-schema.ts  →  validate-schema.ts  →  push-schema-n8n.ts  →  generate-component.ts  →  test-component.ts
   (schema only)         (validate)            (push)                  (component)              (test)
```

## Why All Scripts Are Needed

1. **Different use cases**: Automatic vs manual vs orchestrated workflows
2. **Debugging**: Manual scripts help debug issues
3. **Flexibility**: Users can choose their preferred workflow
4. **CI/CD**: Manual scripts can be used in automation
5. **Testing**: Test script verifies component setup
6. **Alternative methods**: Both n8n and direct API push options

## Script Dependencies

```
schema-mapper.ts (core utility)
    ↓
generate-schema.ts (uses mapper)
    ↓
validate-schema.ts (validates generated schema)
    ↓
push-schema-n8n.ts / push-schema.ts (pushes validated schema)
    ↓
generate-component.ts (generates components from schema)
    ↓
test-component.ts (tests generated components)
    ↓
code-review.ts (validates TypeScript & ESLint)
    ↓
orchestrate.ts (orchestrates: validate → component → push → code review)
```

## Recommendation

- **For new components**: Use automatic workflow (`generate-schema` → `generate-component`)
- **For existing schemas**: Use orchestrated workflow (`orchestrate`)
- **For debugging**: Use manual workflow (step-by-step)
- **For CI/CD**: Use manual scripts for granular control

