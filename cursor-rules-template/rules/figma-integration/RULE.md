---
description: "Figma MCP integration and design-to-code workflow"
globs: ["schema-generator/**/*.ts"]
alwaysApply: false
---

# Figma Integration Standards

## Workflow

**Default**: Orchestrated workflow - Schema generation automatically triggers full orchestration (validate → component → push)

### Orchestrated Workflow (Default) ⭐

**Single command** - Complete automation:

```bash
npm run generate:schema <component_name> "<Display Name>"
```

**What happens automatically:**
1. ✅ Schema generated
2. ✅ Schema validated
3. ✅ React component generated
4. ✅ Component registered in Next.js
5. ✅ Schema pushed to Storyblok

### Manual Orchestration (For Existing Schemas)

If schema already exists and you want to re-run orchestration:

```bash
npm run orchestrate <component_name> [options]
```

### Manual Workflow (Debugging)

For step-by-step control or debugging:

```bash
# 1. Generate schema (disable auto-orchestration in code)
npm run generate:schema <component_name> "<Display Name>"

# 2. Validate schema
npm run validate:schema <component_name>

# 3. Push to Storyblok
npm run push:schema:n8n <component_name>  (or push:schema for direct API)

# 4. Generate React component
npm run generate:component <component_name>

# 5. Test component (optional)
npm run test:component <component_name>
```

## Figma MCP Workflow

**CRITICAL**: When user provides a Figma URL, you MUST automatically:

1. **Get Design Context** (AUTOMATIC):
   - **Extract Node ID**: From URL `?node-id=1-155` → `1:155` (convert hyphens to colons)
   - **Call Figma MCP**: Use `mcp_figma_get_design_context` with extracted node ID
   - **Store Design Context**: Save the design code to `schema-generator/schemas/storyblok/figma-context/<component_name>.txt`
   - **Use for Implementation**: Stored context is automatically used by component generator to create full JSX and CSS

**Example Flow:**
- User: "generate schema for benefits_section from https://figma.com/design/...?node-id=1-155"
- You: 
  1. Extract node ID: `1:155`
  2. Call `mcp_figma_get_design_context` with `nodeId: "1:155"`
  3. Store result in `schema-generator/schemas/storyblok/figma-context/benefits_section.txt`
  4. Then run `npm run generate:schema benefits_section "Benefits Section"`

2. **Generate Schema**: Map Figma structure to Storyblok schema
   - **Important**: If schema already exists in repo, it will be skipped (no overwrite)
   - Check `schemas/storyblok/bloks/` and `schemas/storyblok/nested/` before generating
   - Common existing schemas: `primary_button`, `secondary_button`, `benefit_item`, `business_type_card`, `stat_item`

3. **Automatic Orchestration**: `generate:schema` automatically:
   - ✅ Validates schema structure
   - ✅ **Generates React component WITH FULL IMPLEMENTATION** (if Figma context available)
   - ✅ **Generates CSS Module WITH COMPLETE STYLES** (if Figma context available)
   - ✅ Registers component in Next.js
   - ✅ Pushes schema to Storyblok
   - ✅ **Runs code review** (TypeScript type checking & ESLint)

4. **Component Implementation**:
   - **With Figma context**: Fully implemented JSX and CSS matching Figma design
   - **Without Figma context**: Skeleton component with TODO comments
   - Component auto-registers in `generated.components.ts`
   - Next.js dev server auto-reloads (no manual restart needed)

5. **Component File Structure**:
   - **Presentational Component**: `storyblok-app/src/components/presentational/<ComponentName>.tsx`
     - Pure React component, no Storyblok dependencies
     - Reusable, testable, CMS-agnostic
   - **Storyblok Wrapper**: `storyblok-app/src/storyblok/components/<component_name>.tsx`
     - Maps Storyblok `blok` data to presentational props
     - Handles data transformation
     - Marked as `'use client'` for Next.js
   - **Why 2 files?**: Separation of concerns - UI logic separate from CMS integration

## Schema Mapping

When mapping Figma to Storyblok:

- Text layers → `text` or `textarea` fields
- Component variants → `option` fields
- Nested components → `bloks` fields
- Images → `asset` fields
- Links → `multilink` fields

## Design Accuracy

- Extract exact dimensions (width, height, x, y)
- Extract exact colors (hex values)
- Extract exact typography (font, size, weight, line height)
- Extract exact spacing (padding, margin, gap)
- Match Figma layout (flexbox, grid)

## Component Generation

When generating components from Figma:

1. Use exact Figma dimensions in CSS
2. Match Figma colors exactly
3. Use Figma typography specs
4. Preserve Figma layout structure
5. Handle responsive breakpoints if defined in Figma

## SVG Path Morphing

For animated shapes:

- Use exact SVG paths from Figma
- Normalize paths to unified coordinate system
- Use Motion.dev for smooth morphing
- Maintain fixed positions (no movement, rotation, scale)
- Only animate `d` (path data) and `fill` (color)

## Workflow Checklist

### Orchestrated Workflow (Default) - With Figma URL
- [ ] **User provides Figma URL**
- [ ] **Automatically extract node ID from URL** (`?node-id=1-155` → `1:155`)
- [ ] **Automatically call `mcp_figma_get_design_context`** with node ID
- [ ] **Automatically store design context** in `figma-context/<name>.txt`
- [ ] Generate schema: `npm run generate:schema <name> "<Display Name>"`
- [ ] Schema auto-validates
- [ ] **React component auto-generates WITH FULL IMPLEMENTATION** (uses stored Figma context)
- [ ] **CSS Module auto-generates WITH COMPLETE STYLES** (uses stored Figma context)
- [ ] Component auto-registers in Next.js
- [ ] Schema auto-pushes to Storyblok
- [ ] **Code review runs automatically** (TypeScript & ESLint checks)
- [ ] Fix any linting/type errors if found
- [ ] Verify in Storyblok dashboard

### Orchestrated Workflow (Default) - Without Figma URL
- [ ] Generate schema: `npm run generate:schema <name> "<Display Name>"`
- [ ] Schema auto-validates
- [ ] React component auto-generates as skeleton
- [ ] CSS Module auto-generates as placeholder
- [ ] Component auto-registers in Next.js
- [ ] Schema auto-pushes to Storyblok
- [ ] **Manually implement JSX and CSS**
- [ ] Verify in Storyblok dashboard

### Manual Orchestration (Existing Schema)
- [ ] Run orchestration: `npm run orchestrate <name>`
- [ ] Verify in Storyblok dashboard

### Manual Workflow (Debugging)
- [ ] Get Figma design context via MCP
- [ ] Generate schema: `npm run generate:schema <name> "<Display Name>"` (disable auto-orchestration in code)
- [ ] Validate: `npm run validate:schema <name>`
- [ ] Push: `npm run push:schema:n8n <name>` (or `push:schema`)
- [ ] Generate component: `npm run generate:component <name>`
- [ ] Test: `npm run test:component <name>` (optional)
- [ ] Verify in Storyblok dashboard
