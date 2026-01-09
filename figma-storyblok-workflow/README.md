# n8n Workflow for Storyblok Schema Push

This folder contains n8n workflow files for automatically pushing Storyblok component schemas to your Storyblok space.

## 🔒 Security

**⚠️ IMPORTANT**: The workflow files use placeholder values for credentials. You must configure your actual credentials before using the workflow.

## Setup Instructions

### 1. Import Workflow

Import `push-schema-to-storyblok.json` into your n8n instance:

1. Open your n8n instance
2. Click "Import from File" or "Import from URL"
3. Select `push-schema-to-storyblok.json`

### 2. Configure Credentials

The workflow has a "Set Credentials" node that needs to be configured. You have two options:

#### Option A: Set in Workflow (Recommended for Testing)

1. Open the workflow in n8n
2. Find the "Set Credentials" node
3. Replace the placeholder values:
   - `YOUR_SPACE_ID` → Your Storyblok Space ID
   - `YOUR_MANAGEMENT_TOKEN` → Your Storyblok Management API token

#### Option B: Pass via Webhook Body (Recommended for Production)

The workflow supports receiving credentials in the webhook body. This is more secure as credentials aren't stored in the workflow.

Send credentials in your webhook request:

```json
{
  "name": "component_name",
  "display_name": "Component Display Name",
  "schema": { ... },
  "spaceId": "your_space_id",
  "managementToken": "your_management_token"
}
```

If credentials are provided in the webhook body, they will override the values in the "Set Credentials" node.

### 3. Get Your Storyblok Credentials

1. **Space ID**: Found in your Storyblok space settings or URL
2. **Management Token**: 
   - Go to Storyblok → Settings → Access tokens
   - Create a new Management API token
   - Copy the token (starts with something like `pSg2jFkHDU8HiCHoK1w9KQtt-...`)

### 4. Activate Workflow

1. Save the workflow in n8n
2. Activate the workflow
3. Copy the webhook URL (shown in the Webhook node)

## Usage

### Test the Webhook

Use the provided test script:

```bash
./test-webhook.sh [webhook-url] [schema-file]
```

Example:
```bash
./test-webhook.sh https://your-n8n.com/webhook/push-schema test-schema.json
```

### Push Schema via Script

From the `schema-generator` directory:

```bash
npm run push:schema:n8n [component_name]
```

This script reads `N8N_WEBHOOK_URL` from your environment variables.

## Workflow Overview

The workflow performs the following steps:

1. **Webhook** - Receives schema data via POST request
2. **Set Credentials** - Sets Storyblok Space ID and Management Token
3. **Process Schema** - Validates and formats the schema data
4. **List Components** - Checks if component already exists
5. **Component Exists?** - Routes to update or create
6. **Update/Create Component** - Updates existing or creates new component
7. **Format Response** - Formats success or error response
8. **Respond** - Returns JSON response to caller

## Environment Variables

If using the push script, set in `storyblok-app/.env.local`:

```env
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/push-schema
STORYBLOK_SPACE_ID=your_space_id
STORYBLOK_MANAGEMENT_TOKEN=your_management_token
```

## Troubleshooting

### Error: "Space ID and Management Token are required"

- Ensure credentials are set in the "Set Credentials" node, OR
- Pass `spaceId` and `managementToken` in the webhook body

### Error: "Component not found" or "Unauthorized"

- Verify your Management Token is valid and has the correct permissions
- Check that the Space ID matches your Storyblok space

### Webhook returns empty response

- Check n8n execution logs for detailed error messages
- Verify the workflow is activated
- Ensure the webhook URL is correct

## Files

- `push-schema-to-storyblok.json` - Main workflow file (import this)
- `workflow-community-simple.json` - Alternative workflow version
- `test-webhook.sh` - Script to test the webhook
- `test-schema.json` - Example schema for testing

