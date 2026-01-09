# Storyblok Schema Generator

A standalone tool for generating Storyblok component schemas from Figma designs.

## Setup

```bash
cd schema-generator
npm install
```

## Workflow

### 🚀 Orchestrated Workflow (Default)

**Complete automation** - Schema generation automatically triggers orchestration (validate → component → push):

```bash
npm run generate:schema <component_name> "<Display Name>"
```

**What happens automatically:**
1. ✅ Schema generated
2. ✅ Schema validated
3. ✅ React component generated
4. ✅ Component registered in Next.js
5. ✅ Schema pushed to Storyblok

**Example:**
```bash
npm run generate:schema stats_section "Stats Section"
```

This single command will:
- Generate the schema file
- Validate the schema structure
- Generate React presentational component
- Generate Storyblok wrapper component
- Register component in `generated.components.ts`
- Push schema to Storyblok (via n8n)

### 🎯 Manual Orchestration (For Existing Schemas)

If you already have a schema and want to re-run orchestration:

```bash
npm run orchestrate <component_name> [options]
```

**Options:**
- `--skip-validation` - Skip schema validation
- `--skip-component` - Skip React component generation
- `--skip-push` - Skip pushing to Storyblok
- `--push-method=<n8n|direct>` - Push method (default: n8n)

**Example:**
```bash
# Re-run orchestration for existing schema
npm run orchestrate stats_section

# Skip component generation
npm run orchestrate stats_section --skip-component

# Use direct API instead of n8n
npm run orchestrate stats_section --push-method=direct
```

### 🔧 Manual Workflow

**Step-by-step control** - Run each step individually:

```bash
# Step 1: Generate schema (no auto-push)
# Edit generate-schema.ts to set autoPush: false, or use manual push below

# Step 2: Validate schema
npm run validate:schema <component_name>

# Step 3: Push to Storyblok (choose method)
npm run push:schema:n8n <component_name>    # Via n8n webhook
npm run push:schema <component_name>         # Via direct API

# Step 4: Generate React component
npm run generate:component <component_name>

# Step 5: Test component
npm run test:component <component_name>
```

## Scripts Reference

### Core Scripts

| Script | Purpose | Auto Features |
|--------|---------|--------------|
| `generate:schema` | Generate schema from Figma | ✅ Auto-validates<br>✅ Auto-pushes to Storyblok<br>⏭️ Skips if exists |
| `generate:component` | Generate React components | ✅ Auto-registers in Next.js<br>⏭️ Skips if exists |
| `orchestrate` | Complete workflow | ✅ Validates<br>✅ Generates component<br>✅ Pushes to Storyblok |

### Manual/Debug Scripts

| Script | Purpose | Use Case |
|--------|---------|----------|
| `validate:schema` | Validate schema structure | Debug schema issues |
| `push:schema:n8n` | Push via n8n webhook | Manual push, debugging |
| `push:schema` | Push via direct API | Manual push, no n8n |
| `test:component` | Test component setup | Verify component works |

### Utility Scripts

| Script | Purpose |
|--------|---------|
| `schema-mapper.ts` | Core mapping logic (not run directly) |

## Detailed Usage

### 1. Generate Schema

Generate a schema for a component:

```bash
npm run generate:schema <block_name> [display_name]
```

**Important**: If a schema already exists in the repository, it will be automatically skipped to prevent overwriting existing schemas. Common existing schemas include:
- `primary_button` (nested)
- `secondary_button` (nested)
- `benefit_item` (nested)
- `business_type_card` (nested)
- `stat_item` (nested)

**What it does:**
- Generates schema JSON file
- Auto-validates schema structure
- Auto-pushes to Storyblok (via n8n)
- Skips if schema already exists

**Examples:**
```bash
# Generate benefits section schema
npm run generate:schema benefits_section "Benefits Section"

# Generate nested benefit item schema (will skip if exists)
npm run generate:schema benefit_item

# Generate business types section (includes nested card)
npm run generate:schema business_types_section

# Generate button schemas (will skip if already exist)
npm run generate:schema primary_button
npm run generate:schema secondary_button
```

### 2. Generate React Component

Auto-generate React component from schema:

```bash
npm run generate:component <component_name>
```

**Important**: If components already exist, they will be automatically skipped to prevent overwriting. To regenerate, delete the existing files first.

**What it creates:**
- Presentational component: `storyblok-app/src/components/presentational/ComponentName.tsx`
- CSS Module: `ComponentName.module.css`
- Storyblok wrapper: `storyblok-app/src/storyblok/components/component_name.tsx`
- Updates `generated.components.ts` registration (always updated, even if components exist)

**Example:**
```bash
npm run generate:component benefits_section
```

### 3. Validate Schema

Validate a schema before pushing:

```bash
npm run validate:schema <component_name>
```

**Checks:**
- Schema structure validity
- Field types are valid
- Component name matches
- React components exist
- Component is registered
- Nested components exist

**Example:**
```bash
npm run validate:schema benefits_section
```

### 4. Push Schema to Storyblok

Push schemas to Storyblok (manual):

```bash
# Push via n8n webhook (recommended)
npm run push:schema:n8n <component_name>

# Push via direct API
npm run push:schema <component_name>

# Push all schemas
npm run push:schema:n8n
npm run push:schema
```

**Note**: `generate:schema` already auto-pushes, so manual push is only needed if:
- You disabled auto-push
- You're re-pushing an existing schema
- You're debugging push issues

### 5. Test Component

Generate test data and verify component setup:

```bash
npm run test:component <component_name>
```

**What it does:**
- Checks component files exist
- Generates test data from schema
- Creates test page code
- Verifies all fields are accessible

**Example:**
```bash
npm run test:component benefits_section
```

## Output

Generated schemas are saved to `schemas/storyblok/` directory, organized by type:

- **`bloks/`** - Main section components (benefits_section, business_types_section, cta_section, default-page, stats_section)
- **`nested/`** - Nested/reusable components (benefit_item, business_type_card, primary_button, secondary_button, stat_item)

## Structure

```
schema-generator/
├── scripts/
│   ├── orchestrate.ts         # Complete workflow orchestration
│   ├── generate-schema.ts     # Generate schemas (with auto-validation & push)
│   ├── generate-component.ts  # Auto-generate React components
│   ├── validate-schema.ts     # Validate schemas (manual)
│   ├── test-component.ts      # Test component setup (manual)
│   ├── push-schema.ts         # Push schemas via direct API (manual)
│   ├── push-schema-n8n.ts     # Push schemas via n8n webhook (manual)
│   ├── schema-mapper.ts       # Schema mapping logic (core utility)
│   └── shared/
│       ├── validation.ts      # Shared validation utilities
│       ├── push.ts            # Shared push utilities
│       ├── schema-loader.ts   # Schema file loading utilities
│       └── component-checker.ts # Component file checking utilities
├── schemas/
│   └── storyblok/
│       ├── bloks/           # Main section components
│       └── nested/          # Nested/reusable components
├── package.json
├── tsconfig.json
└── README.md
```

## Workflow Decision Tree

```
Start with Figma Design
    │
    ├─→ Orchestrated Workflow (Default) ⭐
    │   └─→ npm run generate:schema <name>     (schema → validate → component → push)
    │
    ├─→ Manual Orchestration (Existing Schema)
    │   └─→ npm run orchestrate <name>          (validate + component + push)
    │
    └─→ Manual Workflow (Debugging)
        ├─→ npm run generate:schema <name>     (schema only - disable auto-orchestration in code)
        ├─→ npm run validate:schema <name>    (validate)
        ├─→ npm run push:schema:n8n <name>    (push)
        ├─→ npm run generate:component <name> (component)
        └─→ npm run test:component <name>      (test)
```

## Best Practices

1. **Use Automatic Workflow** for new components
2. **Use Orchestrated Workflow** when schema already exists
3. **Use Manual Workflow** for debugging or when you need step-by-step control
4. **Always validate** before pushing to production
5. **Test components** after generation to ensure everything works
