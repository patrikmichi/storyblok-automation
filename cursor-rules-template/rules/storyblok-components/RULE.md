---
description: "Standards for Storyblok component development, schema generation, and integration"
alwaysApply: true
---

# Storyblok Component Development Standards

## Component Structure

When creating Storyblok components, follow this structure:

1. **Presentational Component** (`src/components/presentational/`)
   - Pure React component with TypeScript interfaces
   - Uses CSS Modules for styling
   - No Storyblok-specific logic
   - Accepts typed props matching Storyblok schema

2. **Storyblok Wrapper** (`src/storyblok/components/`)
   - Client component (`'use client'`)
   - Maps Storyblok `blok` data to presentational component props
   - Handles data normalization (case variations, defaults)
   - Registers in `src/storyblok/generated.components.ts`

3. **Schema** (`schema-generator/schemas/storyblok/`)
   - JSON schema matching Storyblok component structure
   - **Main bloks** go in `schemas/storyblok/bloks/` (sections like benefits_section, cta_section)
   - **Nested bloks** go in `schemas/storyblok/nested/` (items, buttons, cards like benefit_item, primary_button)
   - Includes all field types: `text`, `textarea`, `option`, `boolean`, `number`, `bloks`, `multilink`, `asset`
   - Field positions (`pos`) must be sequential
   - Default values where appropriate

## Schema Field Types

Use these Storyblok field types:

- `text` - Single line text input
- `textarea` - Multi-line text input
- `option` - Dropdown with predefined options
- `boolean` - Checkbox/toggle
- `number` - Numeric input (for padding, spacing, etc.)
- `bloks` - Nested components (with `restrict_components` and `component_whitelist`)
- `multilink` - URL/page/email link (use `link_type: ["url", "story", "email"]`)
- `asset` - Image/file upload (use `filetypes: ['images']`)

## Required Fields for Sections

All section components should include:

- `headline` (text, required)
- `heading_level` (option: h1-h6, default: h2) - **immediately after headline**
- `subtext` (textarea, optional)
- `show_subtext` (boolean, optional, where applicable)
- `alignment` (option: Left/Center, where applicable)
- `background` (option: White/Grey/Dark)
- `padding_top` (number, default: 96)
- `padding_bottom` (number, default: 96)
- Content blocks (benefits, business_cards, buttons, etc.)

## Field Ordering (Semantic Workflow)

Fields should be ordered semantically for intuitive Storyblok editing:

1. **Content/Text Fields** (pos: 0-3)
   - `headline` (pos: 0)
   - `heading_level` (pos: 1) - immediately after headline
   - `subtext` (pos: 2)
   - `show_subtext` (pos: 3, if applicable)

2. **Layout/Styling Options** (pos: 4-5)
   - `alignment` (pos: 4, if applicable)
   - `background` (pos: 5)

3. **Spacing** (pos: 6-7)
   - `padding_top` (pos: 6)
   - `padding_bottom` (pos: 7)

4. **Content Blocks** (pos: 8+)
   - `benefits`, `business_cards`, `primary_button`, `secondary_button`, etc.

5. **Component-Specific Options** (last)
   - `container`, `graphics`, etc.

## CSS Modules Standards

- Use CSS Modules (`.module.css`) for all component styles
- Import design tokens from `styles/tokens.css`
- Use CSS variables for colors, spacing, typography
- No inline styles except for dynamic values (padding, etc.)
- Follow Figma design specs exactly (dimensions, spacing, colors)

## Component Registration

1. Add wrapper component to `src/storyblok/components/`
2. Export from `src/storyblok/generated.components.ts`
3. Component name must match Storyblok schema `name` field

## Schema Generation Workflow

1. Generate schema: `cd schema-generator && npm run generate:schema <component_name>`
   - Main sections → saved to `schemas/storyblok/bloks/`
   - Nested components → saved to `schemas/storyblok/nested/`
2. Review generated schema in the appropriate directory
3. Push to Storyblok via n8n workflow: `cd schema-generator && npm run push:schema:n8n [component_name]`
   - Uses n8n webhook workflow (`figma-storyblok-workflow/push-schema-to-storyblok.json`)
   - Automatically detects if component exists and creates/updates accordingly
   - Returns detailed success message with component ID
   - Push all: `npm run push:schema:n8n` (requires updating script)
   - Push specific: `npm run push:schema:n8n benefits_section`
   - Alternative (direct API): `npm run push:schema [component_name]` (uses Storyblok API directly)
4. Create presentational component from Figma MCP
5. Create Storyblok wrapper component
6. Register in `generated.components.ts`

