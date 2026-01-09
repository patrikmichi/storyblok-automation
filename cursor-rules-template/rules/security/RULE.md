---
description: "Prevent committing secrets, API keys, tokens, webhook URLs, and environment variables to git"
alwaysApply: true
---

# Security & Secrets Protection

## Never Commit Secrets

**CRITICAL**: Never commit, push, or include in git:
- Environment variables (`.env`, `.env.local`, `.env.*`)
- API keys and tokens
- Webhook URLs with secrets
- Passwords and credentials
- Private keys and certificates
- Management tokens
- Access tokens
- Secret keys

## Protected Patterns

The following patterns are automatically excluded via `.gitignore`:

### Environment Files
- `.env`
- `.env.*` (all variants)
- `*.env`
- `*.env.local`
- `*.env.development.local`
- `*.env.test.local`
- `*.env.production.local`

### Secret Files
- `secrets/` directory
- `*.secret`
- `*.key`
- `*.pem`
- `*.p12`
- `*.pfx`
- `credentials.json`
- `config.json`
- `.secrets`

### Webhook Secrets
- `*webhook*.secret`
- `*webhook*.key`
- `webhook-config.json`

### API Keys & Tokens
- Files matching `*api*key*`
- Files matching `*token*`
- Files matching `*password*`
- Files matching `*auth*`

## Before Committing

**ALWAYS** check:

1. **No `.env` files** in staging:
   ```bash
   git status
   git diff --cached
   ```

2. **No hardcoded secrets** in code:
   - Check for hardcoded API keys
   - Check for hardcoded tokens
   - Check for hardcoded webhook URLs with secrets
   - Check for hardcoded passwords

3. **Use environment variables**:
   ```typescript
   // ✅ GOOD
   const token = process.env.STORYBLOK_MANAGEMENT_TOKEN;
   
   // ❌ BAD
   const token = "sk_live_abc123...";
   ```

4. **Use `.env.example`** files:
   - Create `.env.example` with placeholder values
   - Document required environment variables
   - Never include actual values

## Code Review Checklist

Before pushing code, verify:

- [ ] No `.env` files are tracked
- [ ] No hardcoded API keys or tokens
- [ ] No hardcoded webhook URLs with secrets
- [ ] No passwords in code or config files
- [ ] Environment variables are used for all secrets
- [ ] `.env.example` files exist with placeholders
- [ ] README documents required environment variables

## Common Mistakes to Avoid

### ❌ Don't Do This:

```typescript
// Hardcoded token
const API_KEY = "sk_live_abc123xyz";

// Hardcoded webhook URL with secret
const WEBHOOK_URL = "https://n8n.example.com/webhook/push?secret=abc123";

// Hardcoded password
const PASSWORD = "myPassword123";
```

### ✅ Do This Instead:

```typescript
// Use environment variables
const API_KEY = process.env.STORYBLOK_MANAGEMENT_TOKEN;
if (!API_KEY) {
  throw new Error("STORYBLOK_MANAGEMENT_TOKEN is required");
}

// Use environment variables for webhooks
const WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;
if (!WEBHOOK_URL) {
  throw new Error("N8N_WEBHOOK_URL is required");
}
```

## Git Operations

### Before Pushing

1. **Check what will be pushed**:
   ```bash
   git status
   git diff --cached
   ```

2. **Verify no secrets**:
   ```bash
   # Check for common secret patterns
   git diff --cached | grep -i "api.*key\|token\|password\|secret"
   ```

3. **If secrets found**:
   - Remove from staging: `git reset HEAD <file>`
   - Add to `.gitignore` if not already
   - Use environment variables instead

### If Secrets Were Committed

**If secrets were accidentally committed**:

1. **Remove from git history** (if not yet pushed):
   ```bash
   git rm --cached <file>
   git commit --amend
   ```

2. **If already pushed**:
   - Rotate/revoke the exposed secrets immediately
   - Use `git filter-branch` or BFG Repo-Cleaner to remove from history
   - Force push (coordinate with team)
   - Update all affected services with new secrets

## Project-Specific Secrets

### Storyblok
- `STORYBLOK_MANAGEMENT_TOKEN` - Never commit
- `NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN` - Public token, but still use env
- `STORYBLOK_PREVIEW_SECRET` - Never commit
- `STORYBLOK_SPACE_ID` - Can be public, but prefer env

### n8n Webhooks
- `N8N_WEBHOOK_URL` - May contain secrets in query params
- Webhook URLs with `?secret=` parameters - Never commit

### Scripts
- Check `test-webhook.sh` and similar scripts for hardcoded URLs
- Use environment variables or command-line arguments

## Environment Variable Examples

### `.env.example` Template

```env
# Storyblok Configuration
NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN=your_preview_token_here
STORYBLOK_PREVIEW_SECRET=your_secret_key_here
STORYBLOK_SPACE_ID=your_space_id_here
STORYBLOK_MANAGEMENT_TOKEN=your_management_token_here
STORYBLOK_REGION=eu

# n8n Webhook
N8N_WEBHOOK_URL=https://n8n.example.com/webhook/push-schema
```

## Automated Checks

Consider adding pre-commit hooks to:
- Detect common secret patterns
- Prevent committing `.env` files
- Warn about potential secrets in code

## When in Doubt

**If unsure whether something is a secret:**
- Treat it as a secret
- Use environment variables
- Add to `.gitignore`
- Document in `.env.example`

**Remember**: It's better to be overly cautious than to expose secrets.

