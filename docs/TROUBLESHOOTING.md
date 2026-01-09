# Troubleshooting Guide

Common issues and solutions for the Storyblok automation workflow.

## Table of Contents

- [Schema Generation Issues](#schema-generation-issues)
- [Component Generation Issues](#component-generation-issues)
- [Validation Errors](#validation-errors)
- [Push to Storyblok Failures](#push-to-storyblok-failures)
- [TypeScript/ESLint Errors](#typescripteslint-errors)
- [Components Not Showing in UI](#components-not-showing-in-ui)
- [Figma MCP Issues](#figma-mcp-issues)
- [n8n Webhook Issues](#n8n-webhook-issues)
- [Next.js App Issues](#nextjs-app-issues)

## Schema Generation Issues

### Schema Already Exists Error

**Error**: `⏭️ Schema already exists, skipping: <name>.json`

**Solution**: This is expected behavior - schemas are never overwritten. To regenerate:
1. Delete the schema file: `schema-generator/schemas/storyblok/bloks/<name>.json` or `nested/<name>.json`
2. Run `npm run generate:schema <name>` again

### Invalid Component Name

**Error**: Schema generation fails with validation errors

**Solution**: 
- Use snake_case for component names (e.g., `benefits_section`, not `benefitsSection`)
- Avoid special characters
- Check that the component name matches Storyblok naming conventions

### Missing Nested Component

**Error**: Validation fails because nested component doesn't exist

**Solution**: Generate nested components first:
```bash
# Generate nested component first
npm run generate:schema benefit_item

# Then generate parent component
npm run generate:schema benefits_section "Benefits Section"
```

## Component Generation Issues

### Component Already Exists

**Error**: `⏭️ Component already exists, skipping generation`

**Solution**: This prevents overwriting. To regenerate:
1. Delete the component files:
   - `storyblok-app/src/components/presentational/<ComponentName>.tsx`
   - `storyblok-app/src/components/presentational/<ComponentName>.module.css`
   - `storyblok-app/src/storyblok/components/<component_name>.tsx`
2. Run `npm run generate:component <name>` again

### Component Not Registered

**Error**: Component doesn't appear in `generated.components.ts`

**Solution**: 
1. Check that component generation completed successfully
2. Manually verify `generated.components.ts` has the import and entry
3. If missing, run `npm run generate:component <name>` again (registration always updates)

### Missing Import in Generated Components

**Error**: Import statement not added to `generated.components.ts`

**Solution**:
1. Check the component name matches exactly (case-sensitive)
2. Verify the Storyblok wrapper file exists at `storyblok-app/src/storyblok/components/<name>.tsx`
3. Re-run component generation: `npm run generate:component <name>`

## Validation Errors

### Schema Structure Invalid

**Error**: `❌ Schema validation failed: [field] Invalid field type`

**Solution**:
1. Check the schema JSON file for syntax errors
2. Verify field types match Storyblok field types: `text`, `textarea`, `number`, `boolean`, `option`, `bloks`, `asset`, `multilink`
3. Ensure `pos` values are sequential (0, 1, 2, ...)
4. Run `npm run validate:schema <name>` for detailed errors

### React Component Missing

**Error**: `❌ React component not found: <ComponentName>.tsx`

**Solution**:
1. Generate the component: `npm run generate:component <name>`
2. Verify the file exists at `storyblok-app/src/components/presentational/<ComponentName>.tsx`
3. Check the component name matches (PascalCase for presentational, snake_case for schema)

### Component Not Registered

**Error**: `❌ Component not registered in generated.components.ts`

**Solution**:
1. Run `npm run generate:component <name>` to update registration
2. Manually check `storyblok-app/src/storyblok/generated.components.ts` for the entry
3. Ensure the component name in the map matches the schema `name` field exactly

### Nested Component Missing

**Error**: `❌ Nested component not found: <nested_name>`

**Solution**:
1. Generate the nested component first: `npm run generate:schema <nested_name>`
2. Verify the nested component schema exists
3. Check that the parent schema references the correct nested component name in `component_whitelist`

## Push to Storyblok Failures

### Unauthorized Error

**Error**: `401 Unauthorized` or `Component not found`

**Solution**:
1. Verify your Management Token is valid:
   - Go to Storyblok → Settings → Access tokens
   - Ensure token has Management API permissions
   - Check token hasn't expired
2. Verify Space ID matches your Storyblok space
3. Check environment variables are set correctly in `storyblok-app/.env.local`

### Network Error

**Error**: `Network request failed` or `ECONNREFUSED`

**Solution**:
1. Check your internet connection
2. Verify n8n webhook URL is correct (if using n8n)
3. Check n8n workflow is activated
4. Try direct API push: `npm run push:schema <name>` instead of n8n

### Component Already Exists in Storyblok

**Error**: `Component already exists` (but you want to update it)

**Solution**: This is normal - the push will update the existing component. If you want to create a new one:
1. Use a different component name
2. Or delete the component in Storyblok dashboard first

### Invalid Schema Format

**Error**: `Invalid schema format` or `Missing required fields`

**Solution**:
1. Validate the schema first: `npm run validate:schema <name>`
2. Check the schema JSON structure matches Storyblok requirements
3. Ensure all required fields (`name`, `display_name`, `schema`) are present
4. Verify field types are valid Storyblok types

## TypeScript/ESLint Errors

### TypeScript Errors After Component Generation

**Error**: `error TS2304: Cannot find name 'X'` or similar

**Solution**:
1. Check that React is imported: `import React from 'react'`
2. Verify JSX namespace: Use `React.JSX.IntrinsicElements` instead of `JSX.IntrinsicElements`
3. Check that all imports are correct
4. Run `npm run typecheck` in `storyblok-app` for detailed errors
5. Fix the errors in the generated component files

### ESLint Errors

**Error**: ESLint warnings or errors in generated components

**Solution**:
1. Run `npm run lint` in `storyblok-app` to see all errors
2. Fix common issues:
   - Missing prop types
   - Unused variables
   - Missing dependencies in useEffect
3. Code review runs automatically - check the output for specific errors

### Component Props Type Mismatch

**Error**: `Type 'X' is not assignable to type 'Y'`

**Solution**:
1. Check the schema field types match the TypeScript types
2. Verify optional fields use `?` in TypeScript (e.g., `field?: string`)
3. Check that option fields use union types (e.g., `'Left' | 'Center'`)
4. Ensure nested components have correct type definitions

## Components Not Showing in UI

### Component Not Visible After Generation

**Error**: Component doesn't appear in Next.js app

**Solution**:
1. **Create a test page in Storyblok** (required!):
   - Go to Storyblok dashboard
   - Create a new page or edit existing page
   - Add your component to the page
   - Publish or save as draft
2. Verify component is registered in `generated.components.ts`
3. Check Next.js dev server is running: `npm run dev` in `storyblok-app`
4. Visit `http://localhost:3000` or the page URL

### Component Shows as Raw JSON

**Error**: Component renders as JSON object instead of UI

**Solution**:
1. Check component is registered in `generated.components.ts`
2. Verify the component name in the map matches exactly (case-sensitive)
3. Check that the Storyblok wrapper component exists and is correct
4. Verify the presentational component is properly implemented

### Component Not Found Error

**Error**: `Component '<name>' not found` in browser console

**Solution**:
1. Check `generated.components.ts` has the component entry
2. Verify the component name matches the schema `name` field exactly
3. Ensure the Storyblok wrapper component exists at `storyblok-app/src/storyblok/components/<name>.tsx`
4. Restart Next.js dev server: `npm run dev`

### Draft Mode Not Working

**Error**: Draft content not showing in preview

**Solution**:
1. Use the correct draft URL format:
   ```
   http://localhost:3000/api/draft?secret=YOUR_SECRET&slug=your-page-slug
   ```
2. Verify `STORYBLOK_PREVIEW_SECRET` is set correctly in `.env.local`
3. Check the secret matches the one in Storyblok settings
4. Ensure the page slug is correct

## Figma MCP Issues

### Figma Design Context Not Retrieved

**Error**: Component generated as skeleton (no Figma implementation)

**Solution**:
1. Verify Figma MCP is configured in Cursor
2. Check the Figma URL has a valid node ID: `?node-id=1-155`
3. Extract node ID correctly: `1-155` → `1:155` (hyphens to colons)
4. Manually call `mcp_figma_get_design_context` with the node ID
5. Store the design context in `schema-generator/schemas/storyblok/figma-context/<name>.txt`

### Figma Code Not Used

**Error**: Component generated but doesn't match Figma design

**Solution**:
1. Check that Figma context file exists: `schema-generator/schemas/storyblok/figma-context/<name>.txt`
2. Verify the context file contains valid design code
3. Re-generate component: `npm run generate:component <name>` (will use stored context)
4. If context is missing, re-fetch from Figma and store it

### Invalid Node ID

**Error**: Figma MCP returns error for node ID

**Solution**:
1. Verify the node ID format: `1:155` (colon, not hyphen)
2. Check the node exists in the Figma file
3. Ensure you have access to the Figma file
4. Try extracting node ID from a different part of the design

## n8n Webhook Issues

### Webhook Returns Empty Response

**Error**: No response from n8n webhook

**Solution**:
1. Check n8n execution logs for detailed error messages
2. Verify the workflow is activated in n8n
3. Ensure the webhook URL is correct
4. Check that `N8N_WEBHOOK_URL` environment variable is set
5. Test the webhook manually: `./figma-storyblok-workflow/test-webhook.sh`

### Credentials Not Set

**Error**: "Space ID and Management Token are required"

**Solution**:
1. **Option A**: Set in n8n workflow "Set Credentials" node
2. **Option B**: Pass in webhook body:
   ```json
   {
     "spaceId": "your_space_id",
     "managementToken": "your_management_token",
     ...
   }
   ```
3. Verify credentials are valid in Storyblok dashboard

### Webhook Timeout

**Error**: Request timeout or connection timeout

**Solution**:
1. Check n8n instance is running and accessible
2. Verify network connectivity
3. Check n8n execution logs for slow operations
4. Try direct API push instead: `npm run push:schema <name>`

## Next.js App Issues

### Dev Server Not Auto-Reloading

**Error**: Changes not reflected after component generation

**Solution**:
1. Check Next.js dev server is running: `npm run dev`
2. Verify file changes are detected (check terminal for "compiled" messages)
3. Hard refresh browser: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
4. Check for TypeScript errors preventing compilation
5. Restart dev server if needed

### Build Errors

**Error**: `npm run build` fails with TypeScript or import errors

**Solution**:
1. Run `npm run typecheck` to see all TypeScript errors
2. Fix all TypeScript errors before building
3. Check that all imports are correct
4. Verify all components are properly registered
5. Ensure environment variables are set for production build

### Storyblok Bridge Not Working

**Error**: Visual editor not connecting or not updating

**Solution**:
1. Verify `NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN` is set correctly
2. Check that Storyblok Bridge script is loaded (check browser console)
3. Ensure you're in preview/draft mode
4. Check browser console for Bridge connection errors
5. Verify the access token has preview permissions

## General Debugging Tips

### Enable Verbose Logging

Add `--verbose` flag or check script outputs for detailed error messages.

### Check File Paths

Verify all file paths are correct:
- Schemas: `schema-generator/schemas/storyblok/bloks/` or `nested/`
- Components: `storyblok-app/src/components/presentational/`
- Wrappers: `storyblok-app/src/storyblok/components/`

### Verify Environment Variables

Check all required environment variables are set:
```bash
# In storyblok-app/.env.local
NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN
STORYBLOK_PREVIEW_SECRET
STORYBLOK_SPACE_ID
STORYBLOK_MANAGEMENT_TOKEN
STORYBLOK_REGION
N8N_WEBHOOK_URL  # Optional
```

### Check Component Registration

Always verify `storyblok-app/src/storyblok/generated.components.ts`:
- Import statement exists
- Component entry in `storyblokComponents` map
- Component name matches exactly (case-sensitive)

### Common Mistakes

1. **Wrong naming convention**: Use `snake_case` for schemas, `PascalCase` for React components
2. **Missing test page**: Components won't show without a Storyblok page
3. **Environment variables not loaded**: Restart dev server after changing `.env.local`
4. **Case sensitivity**: Component names must match exactly between schema and registration

## Still Having Issues?

1. Check the [Scripts Reference](./SCRIPTS_REFERENCE.md) for script usage
2. Review the [Architecture Guide](./ARCHITECTURE.md) for design decisions
3. Check individual README files:
   - [Main README](../README.md)
   - [Schema Generator README](../schema-generator/README.md)
   - [Next.js App README](../storyblok-app/README.md)
   - [n8n Workflow README](../figma-storyblok-workflow/README.md)

