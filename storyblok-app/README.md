# Storyblok Next.js App

Next.js application with Storyblok integration for rendering live content blocks.

## Setup

```bash
cd storyblok-app
npm install
```

## Environment Variables

Create a `.env.local` file:

```env
# Storyblok Configuration
NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN=your_preview_token_from_storyblok
STORYBLOK_PREVIEW_SECRET=your_secret_key_123
STORYBLOK_SPACE_ID=your_space_id
STORYBLOK_MANAGEMENT_TOKEN=your_management_token
STORYBLOK_REGION=eu
```

## Development

```bash
npm run dev
```

Visit `http://localhost:3000` to see your Storyblok content.

### Auto-Reload on Component Changes 🔄

- Next.js dev server automatically detects file changes
- When you create a new component, the dev server auto-reloads
- No manual restart needed - changes are hot-reloaded
- Component is immediately live at `http://localhost:3000`

### Important: Create Test Page in Storyblok 📝

Before components are visible in the UI, you must:
- Create a test page in Storyblok, OR
- Add your new components to an existing page
- Publish the page (or use draft mode)
- Components will then appear at `http://localhost:3000`

## Preview Mode

To enable Storyblok preview mode, visit:
```
http://localhost:3000/api/draft?secret=YOUR_SECRET&slug=your-page-slug
```

## Structure

```
storyblok-app/
├── app/                    # Next.js App Router pages
│   ├── [...slug]/          # Dynamic routes for Storyblok pages
│   └── api/                # API routes (draft mode, preview)
├── components/             # Shared React components
│   └── StoryblokBridge.tsx # Storyblok Visual Editor Bridge
├── src/
│   ├── components/
│   │   └── presentational/ # Presentational React components
│   └── storyblok/
│       └── components/     # Storyblok wrapper components
├── styles/                 # Global styles and design tokens
├── schemas/                # Storyblok schema references
└── package.json
```

## Features

- ✅ Storyblok Visual Editor integration
- ✅ Draft mode and preview support
- ✅ Dynamic page routing
- ✅ Component registration system
- ✅ CSS Modules with design tokens
- ✅ Motion.dev animations

