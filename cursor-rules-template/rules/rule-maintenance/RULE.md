---
description: "Automatically update and improve rules when issues are detected and fixed"
alwaysApply: true
---

# Rule Maintenance & Auto-Update

## Automatic Rule Updates

When you detect an issue, fix it through prompting, and the fix reveals that a rule needs updating, **automatically update the relevant rule file** to prevent the same issue from recurring.

## When to Update Rules

Update rules when:

1. **Pattern or Standard Changes**
   - A fix reveals a better pattern or approach
   - A standard needs to be clarified or corrected
   - A workflow step is missing or incorrect

2. **Common Issues Recurring**
   - The same mistake happens multiple times
   - A rule doesn't cover a common scenario
   - A rule is ambiguous or unclear

3. **Best Practices Evolve**
   - New best practices are discovered
   - Tooling or framework updates require rule changes
   - Team standards evolve

4. **Missing Guidance**
   - A fix requires knowledge not documented in rules
   - A rule doesn't cover an edge case
   - A workflow step is missing

## How to Update Rules

1. **Identify the Relevant Rule**
   - Determine which rule file needs updating
   - Check if multiple rules need updates
   - Consider if a new rule is needed

2. **Update the Rule File**
   - Edit the `RULE.md` file directly
   - Add clarifications, examples, or corrections
   - Update workflows or standards
   - Add missing steps or guidance

3. **Document the Change**
   - Add a comment or note about what was updated
   - Explain why the change was made
   - Reference the issue that prompted the update

4. **Verify Rule Structure**
   - Ensure frontmatter metadata is correct
   - Verify `alwaysApply`, `globs`, or `description` are appropriate
   - Check that the rule is scoped correctly

## Update Examples

### Example 1: Adding Missing Step
**Issue**: Schema push fails because component doesn't exist check is wrong.
**Fix**: Update push-schema.ts to list components first, then find by name.
**Rule Update**: Add to `figma-integration/RULE.md`:
```markdown
## Schema Push Workflow
- Always list all components first, then find by name
- Use component ID for updates, not name
```

### Example 2: Clarifying Ambiguity
**Issue**: Developer unsure when to use inline styles vs CSS Modules.
**Fix**: Clarify that dynamic values (padding, colors from Storyblok) use inline styles.
**Rule Update**: Update `css-modules/RULE.md`:
```markdown
## Dynamic Styles
- Use inline styles for values from Storyblok (padding_top, padding_bottom, colors)
- Use CSS Modules for static styles
- Never mix unless necessary
```

### Example 3: Adding Missing Field
**Issue**: New component missing required `heading_level` field.
**Fix**: Add heading_level to schema and component.
**Rule Update**: Update `storyblok-components/RULE.md`:
```markdown
## Required Fields for Sections
- All sections MUST include heading_level field (option: h1-h6, default: h2)
```

## Proactive Rule Improvement

When fixing issues, ask yourself:

- "Would this issue have been prevented if a rule existed?"
- "Is this pattern documented in the rules?"
- "Should this fix be codified as a standard?"
- "Are there similar issues this rule should prevent?"

If yes to any, update the relevant rule immediately.

## Rule Update Checklist

When updating a rule:

- [ ] Rule file identified and located
- [ ] Change is clear and actionable
- [ ] Examples added if needed
- [ ] Related rules checked for consistency
- [ ] Frontmatter metadata still appropriate
- [ ] Rule scope (alwaysApply/globs) still correct

## Commands Update

If a command workflow changes, also update the relevant command file in `.cursor/commands/`:

- Update step-by-step instructions
- Add new steps or remove outdated ones
- Update checklists
- Add troubleshooting steps

## Continuous Improvement

Rules should evolve with the project. Don't hesitate to:

- Split large rules into focused, composable rules
- Merge redundant rules
- Update examples to reflect current patterns
- Remove outdated guidance
- Add new rules for new patterns or tools

## Communication

When updating rules:

1. **Mention the update** in your response
2. **Explain what changed** and why
3. **Reference the issue** that prompted it
4. **Suggest reviewing** the updated rule if significant

Example: "I've updated `.cursor/rules/storyblok-components/RULE.md` to clarify that all section components must include `heading_level` and `padding_top`/`padding_bottom` fields. This was missing from the schema generation workflow and caused the issue we just fixed."

