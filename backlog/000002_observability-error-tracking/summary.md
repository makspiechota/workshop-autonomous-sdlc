# Story 000002: Observability and Error Tracking

**Created:** 2025-12-01
**Status:** Planning
**Priority:** P1

## User Story

As a developer and AI agent
I want to capture and analyze user errors from the React application
So that I can identify issues, monitor application health, and automatically fix bugs

## Background

Currently, we have no visibility into errors that users encounter in the deployed React application on GitHub Pages. When something breaks in production, we have no way to:
- Know that an error occurred
- Understand what caused it
- See the user context (browser, actions taken)
- Track error frequency and patterns

This story adds observability through Sentry integration, enabling both human developers and AI agents to:
- Monitor application health in real-time
- Access error logs programmatically via API
- Track user interactions and performance metrics
- Automatically analyze errors and generate fixes

## Requirements

### Functional Requirements
1. Capture all JavaScript errors in the React application
2. Track user interactions (clicks, form submissions, navigation)
3. Monitor performance metrics (page load, component render times)
4. Provide dashboard for human review (Sentry web UI)
5. Enable API access for AI agents to fetch and analyze logs
6. Automatically attach context to errors (user actions, browser info, app state)

### Technical Requirements
1. Integrate Sentry React SDK (@sentry/react)
2. Configure Sentry error boundaries for React components
3. Set up performance monitoring
4. Configure source maps for production debugging
5. Add Sentry DSN to environment configuration
6. Create API access token for AI agent integration
7. Implement error grouping and filtering
8. Set up alerts for critical errors (optional)

## Acceptance Criteria

- [ ] Sentry SDK integrated into React application
- [ ] Error boundary wraps the entire app
- [ ] All unhandled errors are captured and sent to Sentry
- [ ] User interactions are tracked (breadcrumbs)
- [ ] Performance metrics are collected
- [ ] Source maps uploaded for production builds
- [ ] Dashboard accessible with error details and stack traces
- [ ] API access configured for programmatic log retrieval
- [ ] Documentation written for AI agent log access
- [ ] Test error captured successfully in Sentry dashboard

## Files Affected

- `package.json` - Add @sentry/react dependency
- `src/main.jsx` - Initialize Sentry SDK
- `src/App.jsx` - Wrap with Sentry ErrorBoundary
- `.github/workflows/deploy.yml` - Upload source maps on deployment
- `vite.config.js` - Configure source map generation
- `.env.example` - Add SENTRY_DSN environment variable
- `docs/OBSERVABILITY.md` - NEW: Documentation for accessing logs

## Dependencies

- Sentry account (free tier)
- Sentry project created
- Sentry DSN obtained
- Sentry auth token for API access

## Notes

- Free tier: 5K events/month (sufficient for prototype)
- Sentry automatically captures React errors via Error Boundaries
- Performance monitoring is optional but recommended
- AI agents can use Sentry API to fetch errors: `GET /api/0/projects/{org}/{project}/events/`
- Consider adding custom context (user ID from form submissions, feature flags)
