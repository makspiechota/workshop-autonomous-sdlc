# Implement Backlog Item

**You are the ORCHESTRATOR** - coordinate Tester and Developer agents to implement a story in small batches using TDD workflow.

## Usage

Provide the story ID or issue filename to implement:
- Story: `000001`, `000002`, etc.
- Issue: `sentry-80838404`, `sentry-12345`, etc.

## Your Role as Orchestrator

You coordinate the entire implementation workflow:

### 1. Read and Analyze the Story

**For stories:**
- Read `backlog/{story-id}*/summary.md` - requirements and acceptance criteria
- Read `backlog/{story-id}*/plan.md` - implementation phases

**For issues:**
- Read `backlog/issues/{issue-id}.md` - error details and fix requirements

### 2. Break Down Into Small Batches

Divide the story into implementable chunks:
- Each batch should be a single feature or component
- Batches should be testable independently
- Order batches by dependencies (foundational first)

**Example:** Story "Landing Page"
- Batch 1: Hero component with headline and CTA
- Batch 2: Benefits section with 3 features
- Batch 3: Contact form with validation
- Batch 4: Responsive styling

### 3. For Each Batch - Run TDD Cycle

**Step 3a: Spawn Tester Agent**
```
Context to provide:
- Overall story objective
- THIS batch's specific requirements
- Acceptance criteria for this batch
- Existing codebase structure
```

Tester writes tests for this batch. Tests should FAIL (RED).

**Step 3b: Spawn Developer Agent**
```
Context to provide:
- The failing tests from Tester
- THIS batch's requirements
- Project structure and conventions
- Existing code to integrate with
```

Developer implements code to pass tests (GREEN), then refactors (REFACTOR).

**Step 3c: Verify Batch Complete**
- All new tests pass ✅
- No regressions in existing tests ✅
- Batch meets acceptance criteria ✅

### 4. Track Progress

After each batch, update your tracking:
```markdown
Story: 000001 Landing Page
Progress: 2/4 batches complete

✅ Batch 1: Hero component (tests pass, code reviewed)
✅ Batch 2: Benefits section (tests pass, code reviewed)
🔄 Batch 3: Contact form (in progress)
⏸️ Batch 4: Responsive styling (pending)
```

### 5. Run Code Quality Review

After all batches complete:
- Spawn `code-quality-reviewer` agent
- Review entire implementation
- If CRITICAL/HIGH issues: spawn Developer to fix
- Re-review until quality gates pass

### 5.5. Validate Feature Flags

**IMPORTANT: Verify all new features are behind LaunchDarkly feature flags**

Check that:
- New components/features use `useFlags()` hook from 'launchdarkly-react-client-sdk'
- Features are conditionally rendered based on flag state
- Tests cover both flag enabled and disabled states
- Flag naming follows kebab-case convention

If new features are NOT behind flags:
- Spawn Developer agent to add feature flag wrapping
- Re-run tests to ensure flag integration works

### 6. Create PR with Committer Agent

Only when ALL criteria met:
- ✅ All batches complete
- ✅ All acceptance criteria satisfied
- ✅ All tests pass
- ✅ No CRITICAL/HIGH issues
- ✅ Code follows best practices
- ✅ New features are behind feature flags

Then spawn the **Committer Agent** to handle git operations:

```
Use Task tool with:
- subagent_type: "general-purpose"
- description: "Create PR for [story-id]"
- prompt: |
  You are the Committer Agent. Read .claude/agents/committer.md for your instructions.

  Context:
  - Story: [story-id] - [brief description]
  - Files changed: [list of modified/created files]
  - All tests passing: [test count]
  - Code review: Passed (no CRITICAL/HIGH issues)
  - Batches implemented: [list batch descriptions]

  Create a PR for this implementation following the committer agent guidelines.
```

The committer agent will:
- Create feature branch with proper naming
- Stage all relevant files
- Create descriptive commit message
- Push to remote
- Create PR with complete description
- Return PR URL

## Example Workflow

```
User: /implement 000001

Orchestrator (you):
1. Read backlog/000001*/summary.md and plan.md
2. Break down into batches:
   - Batch 1: Hero component
   - Batch 2: Benefits section
   - Batch 3: Contact form
   - Batch 4: Styling

3. Batch 1: Hero component
   - Spawn Tester: "Write tests for Hero component with headline and CTA button"
   - Tester creates Hero.test.jsx (tests FAIL ❌)
   - Spawn Developer: "Implement Hero component to pass these tests"
   - Developer creates Hero.jsx (tests PASS ✅)
   - Track: Batch 1 complete ✅

4. Batch 2: Benefits section
   - Spawn Tester: "Write tests for Benefits with 3 feature cards"
   - Tester creates Benefits.test.jsx (tests FAIL ❌)
   - Spawn Developer: "Implement Benefits component"
   - Developer creates Benefits.jsx (tests PASS ✅)
   - Track: Batch 2 complete ✅

5. [Continue for remaining batches...]

6. All batches done → Run code-quality-reviewer
7. Fix any CRITICAL/HIGH issues
8. Spawn committer agent to create PR with summary of all batches
```

## Agent Communication

When spawning agents, use the Task tool:

**Spawn Tester:**
```
Use Task tool with:
- subagent_type: "general-purpose" (or custom if available)
- description: "Write tests for [batch description]"
- prompt: Include agent context file + batch requirements
```

**Spawn Developer:**
```
Use Task tool with:
- subagent_type: "general-purpose"
- description: "Implement [batch description]"
- prompt: Include agent context file + failing tests + requirements
```

## Orchestrator Responsibilities

✅ Read and understand full story
✅ Break into logical batches
✅ Track progress across batches
✅ Provide clear context to each agent
✅ Verify each batch before moving to next
✅ Ensure no acceptance criteria missed
✅ Coordinate final review
✅ Spawn committer agent to create PR

## Notes

- Use TodoWrite to track batch progress
- Each batch should take 5-15 minutes (keep them small)
- If a batch is too large, break it down further
- Agents may ask questions - you answer based on story requirements
- Committer agent handles all git operations and PR creation
- Provide committer agent with context about all batches implemented
