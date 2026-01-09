# Cursor IDE Rules and Commands Template

This folder contains Cursor IDE rules and commands template for the Storyblok automation workflow.

## Setup

To use these rules in your Cursor IDE:

1. **Copy the contents** to your `.cursor` folder:
   ```bash
   cp -r cursor-rules-template/* .cursor/
   ```

2. **Or manually copy specific rules** you need:
   - Copy `.cursor/rules/figma-integration/` for Figma MCP workflow
   - Copy `.cursor/commands/generate-schema.md` for schema generation
   - Copy other rules as needed

## What's Included

### Commands (`.cursor/commands/`)
- `generate-schema.md` - Generate Storyblok schema from Figma design
- `create-component.md` - Create new React components
- `update-schema.md` - Update existing schemas
- `code-review.md` - Run code review checks
- `commit.md` - Structured commit template
- `test-preview.md` - Test components in preview mode
- `fix-styling.md` - Fix styling issues

### Rules (`.cursor/rules/`)
- `figma-integration/RULE.md` - Automated Figma → Storyblok workflow
- `storyblok-components/RULE.md` - Storyblok component patterns
- `git/RULE.md` - Git commit guidelines
- `security/RULE.md` - Security best practices
- `css-modules/RULE.md` - CSS Modules patterns
- `nextjs-app-router/RULE.md` - Next.js App Router patterns
- `rule-maintenance/RULE.md` - Rule maintenance guidelines

## Usage

After copying, Cursor will automatically use these rules when:
- Generating schemas from Figma designs
- Creating React components
- Committing code
- Reviewing code

## Customization

Feel free to modify these rules to match your team's preferences. The rules are designed to be:
- **Modular**: Use only what you need
- **Customizable**: Adapt to your workflow
- **Extensible**: Add your own rules

## Notes

- These are **templates** - customize them for your needs
- Don't commit your `.cursor` folder (it's in `.gitignore`)
- Share improvements back to the `cursor-rules-template` folder

