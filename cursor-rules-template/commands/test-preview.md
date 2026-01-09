# Test Storyblok Preview

Test components in Storyblok preview mode and verify live editing works.

## Setup

1. **Start Dev Server**
   ```bash
   cd storyblok-app
   npm run dev
   ```

2. **Enable Preview Mode**
   - Visit: `http://localhost:3000/api/draft?secret=YOUR_SECRET&slug=test-page`
   - Or use Storyblok preview URL with `?_storyblok=1`

3. **Verify Bridge Connection**
   - Check browser console for: `✅ Storyblok Bridge connected`
   - Verify no connection errors

## Testing Checklist

- [ ] **Component Rendering**
  - [ ] All components render correctly
  - [ ] No console errors
  - [ ] No missing components

- [ ] **Live Editing**
  - [ ] Changes in Storyblok reflect immediately
  - [ ] No page refresh needed
  - [ ] Bridge events fire correctly

- [ ] **Dynamic Fields**
  - [ ] Padding top/bottom updates correctly
  - [ ] Heading level changes tag correctly
  - [ ] Background color changes work
  - [ ] Alignment changes work

- [ ] **Nested Components**
  - [ ] Nested components render
  - [ ] Can add/remove nested items
  - [ ] Nested component fields work

- [ ] **Metadata**
  - [ ] Page title updates from Storyblok
  - [ ] Meta description updates
  - [ ] SEO fields work

## Troubleshooting

- **Changes not updating**: Check `router.refresh()` in `StoryblokBridge.tsx`
- **Cache issues**: Clear `.next` and restart server
- **Bridge not connecting**: Verify `NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN` is set
- **404 errors**: Check slug resolution in `page.tsx`

