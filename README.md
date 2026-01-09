# Storyblok Automation Workflow

Automated workflow for generating Storyblok component schemas and deploying them via n8n webhooks.

## 🚀 Quick Start Tutorial

### Prerequisites

- **Node.js 18+** installed
- **Storyblok account** with a space
- **Figma account** with access to design files
- **Figma MCP** configured in Cursor (for design-to-code workflow)
- **n8n workflow** deployed (optional, for automated deployment)
- **Storyblok Management API token**
- **Test page in Storyblok**: Create a test page or add components to an existing page so they're visible in the UI
- **Cursor IDE rules** (optional but recommended): Copy `cursor-rules-template/` to your `.cursor/` folder for automated workflows

### Step 1: Setup Environment

1. **Setup Cursor IDE rules (optional but recommended):**

```bash
# Copy Cursor rules and commands to your .cursor folder
cp -r cursor-rules-template/* .cursor/
```

This enables automated workflows in Cursor IDE. See [cursor-rules-template/README.md](./cursor-rules-template/README.md) for details.

2. **Clone and install dependencies:**

```bash
# Install schema generator dependencies
cd schema-generator
npm install

# Install Next.js app dependencies
cd ../storyblok-app
npm install
```

3. **Configure environment variables:**

Create `storyblok-app/.env.local`:

```env
# Storyblok Configuration
NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN=your_preview_token
STORYBLOK_PREVIEW_SECRET=your_secret_key
STORYBLOK_SPACE_ID=your_space_id
STORYBLOK_MANAGEMENT_TOKEN=your_management_token
STORYBLOK_REGION=eu

# n8n Webhook (optional, for automated deployment)
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/push-schema
```

### Step 2: Generate Schema and React Component

Generate a Storyblok component schema from Figma and automatically create the React component:

1. **Get Figma Design Context** (using Figma MCP in Cursor):
   - Use Figma MCP to get design context for your component
   - Extract node ID from Figma URL

2. **Generate Schema and Component**:
   ```bash
   cd schema-generator

   # Generate a schema (interactive prompt)
   npm run generate:schema benefits_section "Benefits Section"

   # Or generate without display name
   npm run generate:schema benefit_item
   ```

3. **React Component Auto-Creation**:
   - When using Cursor with Figma MCP, the React component is automatically created
   - Presentational component: `storyblok-app/src/components/presentational/ComponentName.tsx`
   - Storyblok wrapper: `storyblok-app/src/storyblok/components/component_name.tsx`
   - Auto-registered in `generated.components.ts`

The schema will be saved to:
- `schemas/storyblok/bloks/` - for main section components
- `schemas/storyblok/nested/` - for nested/reusable components

### Step 3: Deploy Schema to Storyblok

**Option A: Via n8n Webhook (Recommended)**

Push schemas through your n8n automation workflow:

```bash
# Push all schemas
npm run push:schema:n8n

# Push a specific schema
npm run push:schema:n8n benefits_section
```

**Option B: Direct API Push**

Push directly to Storyblok Management API:

```bash
# Push all schemas
npm run push:schema

# Push a specific schema
npm run push:schema benefits_section
```

### Step 4: Test in Next.js App

1. **Start the development server:**

```bash
cd storyblok-app
npm run dev
```

2. **Auto-Restart on Component Changes** 🔄:

- Next.js dev server automatically detects file changes
- When you create a new component, the dev server auto-reloads
- No manual restart needed - changes are hot-reloaded
- Component is immediately live at `http://localhost:3000`

3. **View your content:**

- Visit `http://localhost:3000` to see published content
- Visit `http://localhost:3000/api/draft?secret=YOUR_SECRET&slug=your-page-slug` for draft/preview mode

4. **Use Storyblok Visual Editor:**

The app includes Storyblok Bridge integration for live editing in the Storyblok CMS.

5. **Important: Create Test Page in Storyblok** 📝:

Before components are visible in the UI, you must:
- Create a test page in Storyblok, OR
- Add your new components to an existing page
- Publish the page (or use draft mode)
- Components will then appear at `http://localhost:3000`

### Step 5: Test Webhook (Optional)

If using n8n automation, test the webhook:

```bash
cd figma-storyblok-workflow

# Test with default webhook URL and test schema
./test-webhook.sh

# Or specify custom URL and schema file
./test-webhook.sh https://your-n8n.com/webhook/push-schema test-schema.json
```

## 📦 Project Structure

```
storyblok-automation/
├── schema-generator/          # Schema generation tool
│   ├── scripts/
│   │   ├── generate-schema.ts    # Generate schemas
│   │   ├── push-schema.ts        # Direct API push
│   │   └── push-schema-n8n.ts    # n8n webhook push
│   └── schemas/storyblok/         # Generated schemas
├── storyblok-app/             # Next.js application
│   ├── app/                    # Next.js pages
│   └── src/components/          # React components
└── figma-storyblok-workflow/   # n8n workflow files
    ├── push-schema-to-storyblok.json
    └── test-webhook.sh
```

## 🔄 Complete Workflow

1. **Get Figma Design** → Use Figma MCP to get design context
2. **Generate Schema** → `npm run generate:schema <component_name>` (auto-creates React component)
3. **Deploy to Storyblok** → `npm run push:schema:n8n` (via n8n) or `npm run push:schema` (direct)
4. **Create Test Page** → Create a page in Storyblok and add your components
5. **Auto-Reload** → Next.js dev server auto-reloads, component is live immediately
6. **Preview** → View in Next.js app at `http://localhost:3000`

## 📚 More Information

- **Schema Generator**: See [schema-generator/README.md](./schema-generator/README.md)
- **Scripts Reference**: See [docs/SCRIPTS_REFERENCE.md](./docs/SCRIPTS_REFERENCE.md) for detailed script documentation
- **Troubleshooting**: See [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) for common issues and solutions
- **Architecture**: See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for design decisions and patterns
- **Next.js App**: See [storyblok-app/README.md](./storyblok-app/README.md)
- **n8n Workflow**: Import `figma-storyblok-workflow/push-schema-to-storyblok.json` into your n8n instance

## 🔒 Security

⚠️ **Never commit secrets!** The repository excludes:
- `.env` files
- `.cursor/` folder
- `node_modules/`
- Secret files and credentials

Always use environment variables for tokens and API keys.

