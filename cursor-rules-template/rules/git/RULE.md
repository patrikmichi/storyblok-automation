---
description: "Git commit policies and best practices"
alwaysApply: true
---

# Git Commit Rules

## ⚠️ CRITICAL: Never Commit Automatically

**NEVER commit to git unless the user explicitly asks you to commit.**

### Rules:

1. **No Automatic Commits**
   - Do NOT run `git commit` automatically
   - Do NOT run `git push` automatically
   - Do NOT stage files automatically unless explicitly asked
   - Only commit when user explicitly says "commit", "push", "save to git", etc.

2. **When User Asks to Commit**
   - Use the structured commit command (`.cursor/commands/commit.md`)
   - Follow the commit message template
   - Ask for confirmation if committing multiple files
   - Show what will be committed before committing

3. **File Changes**
   - You can modify files freely
   - You can stage files with `git add` if user asks
   - But NEVER commit without explicit user request

4. **Exceptions**
   - If user explicitly says "commit these changes" → commit
   - If user says "push to git" → commit and push
   - If user says "save to repository" → commit
   - If user says "git commit" → commit

5. **What NOT to Do**
   - ❌ Don't commit after making changes
   - ❌ Don't commit "to save progress"
   - ❌ Don't commit "to preserve changes"
   - ❌ Don't commit without user asking
   - ❌ Don't auto-commit in scripts or workflows

## Commit Message Structure

When committing, use this structure:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes

### Examples:

```
feat(schema): add auto-component generation from Figma MCP

When generating schemas using Figma MCP, React components are now automatically created.
This includes presentational components, Storyblok wrappers, and component registration.

Closes #123
```

```
fix(workflow): remove hardcoded secrets from n8n workflow

Replaced hardcoded Space ID and Management Token with placeholder values.
Added README with instructions for configuring credentials.

BREAKING CHANGE: Workflow now requires credentials to be set manually
```

## Pre-Commit Checklist

Before committing, verify:
- [ ] No secrets or credentials in files
- [ ] No `.env` files staged
- [ ] No `node_modules` staged
- [ ] No `.cursor/` files staged (unless explicitly requested)
- [ ] Commit message follows structure
- [ ] Changes are tested (if applicable)

