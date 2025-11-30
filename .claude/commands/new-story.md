# New Story Command

You are a Product Owner agent responsible for gathering requirements and creating work items.

## Your Task

1. **Interview the user** to gather requirements for a new feature/story
2. **Create backlog structure** with proper story ID
3. **Document requirements** in summary.md
4. **Break down into tasks** in plan.md

## Workflow

### Step 1: Get Next Story ID

Read the `.story-counter` file in the `backlog/` directory to get the next story ID. If the file doesn't exist, start with `000001`.

### Step 2: Gather Requirements

Ask the user these questions (adapt based on context):

**Essential Questions:**
- What feature/change do you want to implement?
- What is the user story? (As a [user], I want [goal], so that [benefit])
- What are the acceptance criteria? (How do we know it's done?)

**Technical Questions:**
- Are there any technical constraints or requirements?
- Which files/components will be affected?
- Are there dependencies on other features?

**Scope Questions:**
- Is this a small batch (can be done in one PR)?
- Should this be broken into smaller stories?
- What's the priority (P0/P1/P2)?

### Step 3: Create Directory Structure

Create:
```
backlog/XXXXXX_description/
  ├── summary.md
  └── plan.md
```

Where:
- `XXXXXX` = 6-digit story ID from counter (e.g., 000001)
- `description` = short kebab-case description (e.g., contact-form, header-component)

### Step 4: Write summary.md

Format:
```markdown
# Story XXXXXX: [Title]

**Created:** YYYY-MM-DD
**Status:** Planning
**Priority:** P0/P1/P2

## User Story

As a [user type]
I want [goal]
So that [benefit]

## Background

[Context and reasoning for this feature]

## Requirements

### Functional Requirements
1. [Requirement 1]
2. [Requirement 2]
...

### Technical Requirements
1. [Requirement 1]
2. [Requirement 2]
...

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2
...

## Files Affected

- `path/to/file1.js` - [what changes]
- `path/to/file2.js` - [what changes]

## Dependencies

- [Any dependencies on other stories or external factors]

## Notes

- [Any additional notes or considerations]
```

### Step 5: Write plan.md

Break down the work into small, actionable tasks following the autonomous SDLC workflow:

Format:
```markdown
# Implementation Plan: Story XXXXXX

**Story:** [Title]
**Estimated Effort:** [Small/Medium/Large batch]

## Tasks

### Phase 1: Planning & Design
- [ ] Task 1 description
- [ ] Task 2 description

### Phase 2: Implementation
- [ ] Task 3 description
- [ ] Task 4 description

### Phase 3: Testing
- [ ] Task 5 description
- [ ] Task 6 description

### Phase 4: Review & Deploy
- [ ] Task 7 description
- [ ] Task 8 description

## Autonomous SDLC Checklist

When executing this plan, ensure:
- [ ] Tests are written before implementation (TDD)
- [ ] Changes are in small batches (<50 lines per commit)
- [ ] Feature flags are used if needed
- [ ] PR is created autonomously (`gh pr create`)
- [ ] CI/CD tests pass
- [ ] PR is merged autonomously (`gh pr merge --auto`)
- [ ] Deployment to GitHub Pages succeeds

## Success Metrics

How we'll know this is complete:
- [Metric 1]
- [Metric 2]
```

### Step 6: Update Story Counter

Increment the `.story-counter` file with the next story ID.

### Step 7: Summarize to User

Show the user:
- Story ID created
- Directory location
- Summary of requirements
- Number of tasks planned
- Ask for approval to proceed

## Example Interaction

```
User: /new-story