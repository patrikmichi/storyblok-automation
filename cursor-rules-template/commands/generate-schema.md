# Generate Schema Command

Command documentation for `npm run generate:schema` - generates Storyblok component schemas and automatically creates React components.

**Note**: For complete workflow behavior and automatic Figma context fetching, see `.cursor/rules/figma-integration/RULE.md`

## Workflow

**Default**: Orchestrated workflow - Schema generation automatically triggers full orchestration (validate → component → push)

**Single command** does everything:
```bash
npm run generate:schema <component_name> "<Display Name>"
```

## Steps

### Step 1: Get Figma Design Context (AUTOMATIC)

**IMPORTANT**: This step is handled automatically by Cursor rules (see `.cursor/rules/figma-integration/RULE.md`).

When a Figma URL is provided:
1. Node ID is extracted from URL (e.g., `?node-id=1-155` → `1:155`)
2. Figma MCP is called: `mcp_figma_get_design_context` with the node ID
3. Design context is stored: `schema-generator/schemas/storyblok/figma-context/<component_name>.txt`
4. Stored context is used automatically during component generation

**Example:**
- User provides: `https://www.figma.com/design/KNvBxsCxfkNefMKROxIV2R/Storyblok-automation?node-id=1-155`
- Cursor automatically extracts `1:155` and fetches design context
- Context is stored in `schema-generator/schemas/storyblok/figma-context/benefits_section.txt`

### Step 2: Generate Schema (Auto-Orchestrates)

**Single command** automatically:
1. Generates schema
2. Validates schema
3. Generates React component **WITH FULL IMPLEMENTATION** (if Figma context available)
4. Generates CSS Module **WITH COMPLETE STYLES** (if Figma context available)
5. Registers component in Next.js
6. Pushes schema to Storyblok
7. **Runs code review** (TypeScript type checking & ESLint)

```bash
cd schema-generator
npm run generate:schema <component_name> "<Display Name>"
```

**What happens automatically:**
- ✅ Schema file created
- ✅ Schema structure validated
- ✅ **React component generated with full JSX implementation** (if Figma context available)
- ✅ **CSS Module generated with complete styles** (if Figma context available)
- ✅ Component registered in Next.js
- ✅ Schema pushed to Storyblok (via n8n)
- ✅ **Code review runs** (TypeScript type checking & ESLint)
- ⏭️ Skips if schema/components already exist

**If Figma context is available:**
- Component JSX is fully implemented based on Figma design
- CSS Module contains all styles matching Figma specs
- No manual implementation needed!

**If Figma context is NOT available:**
- Component is generated as skeleton (TODO comments)
- CSS Module is empty (placeholder)
- Manual implementation required

### Step 3: Component Generation Details

**What it creates:**

- **Presentational Component**: `storyblok-app/src/components/presentational/<ComponentName>.tsx`
  - **With Figma context**: Fully implemented JSX matching Figma design
  - **Without Figma context**: Skeleton with TODO comments
  - Uses CSS Modules for styling
  - Matches exact Figma structure, colors, typography, spacing

- **CSS Module**: `<ComponentName>.module.css`
  - **With Figma context**: Complete styles matching Figma specs
  - **Without Figma context**: Empty placeholder
  - Uses exact Figma colors, fonts, spacing
  - Responsive and accessible

- **Storyblok Wrapper**: `storyblok-app/src/storyblok/components/<component_name>.tsx`
  - Mark as `'use client'`
  - Map Storyblok `blok` props to presentational component props
  - Handle data normalization
  - Process nested components if applicable
  - **Why 2 files?**: Separation of concerns - presentational components are reusable and CMS-agnostic, wrappers handle Storyblok-specific data transformation

- **Register Component**: Update `storyblok-app/src/storyblok/generated.components.ts`
  - Add import statement
  - Add to `storyblokComponents` map
  - Component name must match schema `name` field exactly

### Step 4: Auto-Restart Dev Server 🔄
- Next.js dev server automatically detects file changes
- Component will be live at `http://localhost:3000` immediately
- No manual restart needed - changes are hot-reloaded

## Workflow Example

### With Figma URL (Full Automation)
```bash
# 1. User provides Figma URL
# 2. Cursor automatically:
#    - Gets Figma design context via MCP
#    - Stores it in figma-context/<name>.txt
# 3. Run schema generation
npm run generate:schema benefits_section "Benefits Section"

# Result: Fully implemented component with styles!
```

### Without Figma URL (Skeleton)
```bash
npm run generate:schema benefits_section "Benefits Section"

# Result: Skeleton component - manual implementation needed
```

## Component Implementation from Figma

When Figma design context is available, the component generator:

1. **Analyzes Figma structure**:
   - Layout (flexbox, grid)
   - Components hierarchy
   - Nested components

2. **Extracts design tokens**:
   - Colors (exact hex values)
   - Typography (font, size, weight, line height)
   - Spacing (padding, margin, gap)
   - Dimensions (width, height)

3. **Generates JSX**:
   - Matches Figma component structure
   - Uses schema fields for dynamic content
   - Handles conditional rendering (variants, optional fields)
   - Maps nested components correctly

4. **Generates CSS**:
   - Converts Tailwind classes to CSS Modules
   - Uses exact Figma colors and typography
   - Preserves layout and spacing
   - Handles responsive breakpoints

## Checklist

### With Figma URL (Full Automation)
- [ ] User provides Figma URL
- [ ] **Automatically get Figma design context via MCP**
- [ ] **Store design context in figma-context/<name>.txt**
- [ ] Generate schema: `npm run generate:schema <name> "<Display Name>"`
- [ ] Schema auto-validated
- [ ] **React component auto-generated with full JSX implementation**
- [ ] **CSS Module auto-generated with complete styles**
- [ ] Component auto-registered in `generated.components.ts`
- [ ] Schema auto-pushed to Storyblok
- [ ] Dev server auto-reloaded
- [ ] Component tested in Storyblok preview

### Without Figma URL (Manual Implementation)
- [ ] Generate schema: `npm run generate:schema <name> "<Display Name>"`
- [ ] Schema auto-validated
- [ ] React component generated as skeleton
- [ ] CSS Module generated as placeholder
- [ ] Component auto-registered
- [ ] Schema auto-pushed
- [ ] **Manually implement JSX based on Figma design**
- [ ] **Manually add CSS styles**
- [ ] Component tested in Storyblok preview

## Important Notes

1. **Figma Context Storage**: Design context is stored in `schema-generator/schemas/storyblok/figma-context/` for reuse
2. **Auto-Implementation**: When Figma context is available, components are fully implemented automatically
3. **Manual Fallback**: Without Figma context, components are skeletons requiring manual implementation
4. **Skip Behavior**: Existing components are never overwritten - delete first to regenerate
