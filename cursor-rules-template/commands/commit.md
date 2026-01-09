# Commit Changes to Git

Create a structured commit with proper message format.

## Commit Message Structure

Follow this template for commit messages:

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

### Scope (optional):
- `schema`: Schema generation changes
- `component`: React component changes
- `workflow`: n8n workflow changes
- `docs`: Documentation updates
- `config`: Configuration changes

### Subject:
- Use imperative mood: "add" not "added" or "adds"
- First letter lowercase
- No period at the end
- Max 72 characters

### Body (optional):
- Explain what and why, not how
- Wrap at 72 characters
- Separate from subject with blank line

### Footer (optional):
- Reference issues: `Closes #123`
- Breaking changes: `BREAKING CHANGE: description`

## Examples

### Simple Feature
```
feat(schema): add auto-component generation from Figma MCP

When generating schemas using Figma MCP, React components are now automatically created.
This includes presentational components, Storyblok wrappers, and component registration.
```

### Bug Fix
```
fix(workflow): remove hardcoded secrets from n8n workflow

Replaced hardcoded Space ID and Management Token with placeholder values.
Added README with instructions for configuring credentials.
```

### Documentation
```
docs: update README with Figma MCP prerequisites

Added Figma MCP and Figma designs to prerequisites section.
Documented auto-restart behavior for Next.js dev server.
```

### Multiple Changes
```
feat: add component generation and validation scripts

- Add generate-component.ts for auto-generating React components
- Add validate-schema.ts for schema validation
- Add test-component.ts for component testing
- Add button schema generation methods

Closes #45
```

## Workflow

1. **Check what will be committed:**
   ```bash
   git status
   git diff --cached
   ```

2. **Verify no secrets:**
   - No `.env` files
   - No hardcoded tokens
   - No credentials

3. **Stage files:**
   ```bash
   git add <files>
   ```

4. **Create commit:**
   ```bash
   git commit -m "<type>(<scope>): <subject>" -m "<body>"
   ```

5. **Push (if requested):**
   ```bash
   git push
   ```

## Pre-Commit Checklist

- [ ] No secrets or credentials in files
- [ ] No `.env` files staged
- [ ] No `node_modules` staged
- [ ] No `.cursor/` files staged (unless explicitly requested)
- [ ] Commit message follows structure
- [ ] Changes are tested (if applicable)
- [ ] User explicitly asked to commit

