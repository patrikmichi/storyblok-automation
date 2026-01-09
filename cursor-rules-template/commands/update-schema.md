# Update Existing Schema

Update an existing Storyblok component schema and push changes.

## Steps

1. **Update Schema JSON**
   - Edit `schema-generator/schemas/storyblok/<component_name>.json`
   - Add/modify fields as needed
   - Ensure field positions are sequential
   - Update `pos` values if adding fields in middle

2. **Update Schema Mapper** (if needed)
   - If adding new field types, update `scripts/schema-mapper.ts`
   - Ensure mapper generates new fields correctly

3. **Update TypeScript Interfaces**
   - Update presentational component props interface
   - Add new prop types
   - Handle optional/required correctly

4. **Update Components**
   - Update presentational component to use new props
   - Update Storyblok wrapper to map new fields
   - Handle defaults appropriately

5. **Push to Storyblok**
   ```bash
   cd schema-generator
   npm run push:schema:n8n <component_name>
   ```
   - Uses n8n webhook workflow (`figma-storyblok-workflow/push-schema-to-storyblok.json`)
   - Automatically detects if component exists and updates accordingly
   - Returns detailed success message with component ID
   - Alternative (direct API): `npm run push:schema <component_name>`

6. **Test**
   - Verify new fields appear in Storyblok
   - Test field functionality
   - Verify component renders correctly

## Common Updates

- **Adding padding fields**: Add `padding_top` and `padding_bottom` (number)
- **Adding heading level**: Add `heading_level` (option: h1-h6)
- **Adding new options**: Add to `option` field's `options` array
- **Adding nested components**: Add `bloks` field with `component_whitelist`

## Important Notes

- Field positions (`pos`) must be unique and sequential
- Default values should match component defaults
- Required fields should have `required: true`
- Option fields need both `value` and `name` in options array

