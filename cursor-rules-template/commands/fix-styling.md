# Fix Styling Issues

Systematically fix styling issues to match Figma designs.

## Steps

1. **Identify Issue**
   - Compare current render with Figma design
   - Note specific discrepancies (spacing, colors, typography, layout)

2. **Check CSS Module**
   - Review `ComponentName.module.css`
   - Verify design tokens are used correctly
   - Check for hardcoded values that should use tokens

3. **Verify Figma Specs**
   - Get exact dimensions from Figma
   - Get exact colors (hex values)
   - Get exact typography (font, size, weight, line height)
   - Get exact spacing (padding, margin, gap)

4. **Update CSS**
   - Match Figma dimensions exactly
   - Use exact hex colors
   - Use exact typography values
   - Use exact spacing values
   - Remove any approximations

5. **Check Dynamic Styles**
   - Verify inline styles for dynamic values
   - Ensure padding_top/padding_bottom work correctly
   - Check heading_level renders correct tag

6. **Test**
   - Clear Next.js cache: `rm -rf .next`
   - Restart dev server
   - Verify in browser
   - Check Storyblok preview

## Common Issues

- **Black background**: Check `globals.css` and `layout.tsx` for background overrides
- **Wrong spacing**: Verify padding/margin values match Figma exactly
- **Wrong typography**: Check font family, size, weight, line height
- **Layout issues**: Verify flexbox/grid properties match Figma
- **Colors**: Use exact hex values from Figma, not approximations

## CSS Module Best Practices

- Use design tokens: `var(--color-primary)`
- Match Figma exactly: no approximations
- Use CSS variables for consistency
- Keep dynamic styles inline (padding, colors from Storyblok)

