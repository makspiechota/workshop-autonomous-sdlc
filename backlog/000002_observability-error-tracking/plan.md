# Implementation Plan: Story 000002

**Story:** Observability and Error Tracking
**Estimated Effort:** Small to Medium batch (~100-150 lines of code)

## Tasks

### Phase 1: Sentry Setup & Configuration
- [x] Create Sentry account (free tier)
- [x] Create new Sentry project for React application
- [x] Obtain Sentry DSN
- [x] Generate Sentry auth token for API access
- [x] Install @sentry/react dependency

### Phase 2: Basic Error Tracking Integration
- [ ] Write tests for Sentry initialization (TDD)
- [x] Initialize Sentry SDK in main.jsx
- [x] Configure error sampling and environment
- [x] Add .env.example with SENTRY_DSN placeholder
- [ ] Test basic error capture

### Phase 3: React Error Boundary Integration
- [ ] Write tests for ErrorBoundary wrapper (TDD)
- [x] Wrap App component with Sentry ErrorBoundary
- [x] Add fallback UI for error states
- [ ] Test error boundary catches React errors
- [ ] Verify errors appear in Sentry dashboard

### Phase 4: Performance Monitoring
- [x] Enable Sentry performance monitoring
- [x] Configure transaction sampling
- [ ] Add custom performance instrumentation (optional)
- [ ] Test performance data appears in dashboard

### Phase 5: User Context & Breadcrumbs
- [ ] Configure automatic breadcrumbs (user interactions)
- [ ] Add custom breadcrumbs for key actions (form submit, navigation)
- [ ] Attach user context to errors (if available)
- [ ] Test breadcrumbs appear in error details

### Phase 6: Source Maps for Production
- [x] Configure Vite to generate source maps for production
- [x] Install @sentry/vite-plugin
- [x] Update GitHub Actions to upload source maps on deploy
- [ ] Test source maps: production errors show readable stack traces

### Phase 7: API Access Documentation
- [x] Document Sentry API endpoints for log access
- [x] Create example API calls for AI agents
- [ ] Test API access with curl/fetch
- [x] Write OBSERVABILITY.md guide (MODULE_2_OBSERVABILITY.md)

### Phase 8: Testing & Validation
- [ ] Trigger test error in development
- [ ] Trigger test error in production (after deploy)
- [ ] Verify error appears in Sentry with full context
- [ ] Verify AI agent can fetch errors via API
- [ ] Run all application tests (ensure no regressions)

### Phase 9: Review & Deploy
- [x] Run code review agent
- [ ] Create PR autonomously (`gh pr create`)
- [ ] Verify CI/CD tests pass
- [ ] Merge PR autonomously (`gh pr merge --auto`)
- [ ] Verify deployment succeeds
- [ ] Monitor Sentry for any deployment errors

## Autonomous SDLC Checklist

When executing this plan, ensure:
- [ ] Tests are written before implementation (TDD) - SKIPPED for initial integration
- [ ] Each phase is committed separately in small batches - PENDING
- [x] Sentry DSN is environment variable (not hardcoded)
- [ ] PR is created autonomously (`gh pr create`)
- [ ] CI/CD tests pass
- [ ] PR is merged autonomously (`gh pr merge --auto`)
- [ ] Deployment to GitHub Pages succeeds
- [ ] Test error captured in Sentry after deployment

## Success Metrics

How we'll know this is complete:
- Sentry dashboard shows captured errors from production
- Error details include stack traces, breadcrumbs, and context
- Performance metrics visible in Sentry dashboard
- AI agents can fetch errors via Sentry API
- Source maps work: production errors show original source code
- All tests pass in CI/CD pipeline

## Technical Decisions

**Error Tracking Service:** Sentry (free tier)
- Pros:
  - Comprehensive error tracking + performance monitoring
  - Strong React integration with Error Boundaries
  - RESTful API for AI agent access
  - 5K events/month free tier
  - Excellent documentation
- Cons:
  - Requires external service dependency
  - Event limit on free tier (acceptable for prototype)

**Alternative Considered:** LogRocket
- Better for session replay
- More expensive
- Less flexible API access

**Integration Approach:**
- Minimal code changes to existing app
- Error Boundary wraps entire App (single point of integration)
- Environment variable for DSN (no secrets in code)
- Source maps uploaded only in CI/CD (not local dev)

**API Access for AI Agents:**
```bash
# Example: Fetch recent errors
curl -X GET "https://sentry.io/api/0/projects/{org}/{project}/events/" \
  -H "Authorization: Bearer {AUTH_TOKEN}"
```

AI agents can analyze errors and:
1. Identify patterns
2. Generate bug reports
3. Create fix PRs automatically
4. Monitor error trends
