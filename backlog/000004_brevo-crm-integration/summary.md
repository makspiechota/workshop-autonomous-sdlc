# Story 000004: Brevo CRM Integration

**Created**: 2025-12-05
**Type**: Technical Foundation
**Status**: Planning
**Priority**: P1
**Feature Flag**: `brevo-integration`
**Estimated Effort**: Small (2-3h)

## Objective

Integrate Brevo (formerly Sendinblue) CRM to collect contact form submissions and enable email marketing capabilities.

## Background

Currently, the contact form on the landing page doesn't store submissions anywhere. We need a proper CRM/marketing automation platform with:
- Contact storage and management
- Email marketing capabilities (campaigns, automation)
- Generous free tier (Brevo offers 300 emails/day, unlimited contacts)

This integration enables future email marketing campaigns while keeping infrastructure costs at zero.

## Requirements

### Functional Requirements

1. Contact form submissions must create contacts in Brevo
2. All current form fields must be captured (name, email, message, etc.)
3. Integration must be behind feature flag for safe rollout
4. Failed Brevo API calls must not break the form (graceful degradation)

### Technical Requirements

1. **Feature Flag**: Behind `brevo-integration` flag (LaunchDarkly)
2. Create Brevo API adapter class with error handling
3. Use Brevo REST API v3 for contact creation
4. Store Brevo API key in environment variables (not committed)
5. Add comprehensive test coverage (including flag states)

## Acceptance Criteria

- [ ] Feature behind LaunchDarkly flag `brevo-integration`
- [ ] Flag OFF: Form submissions don't send to Brevo (no impact)
- [ ] Flag ON: Form submissions create contacts in Brevo
- [ ] Tests cover both flag states (ON/OFF)
- [ ] Tests cover API success and failure scenarios
- [ ] API errors don't break form submission (logged but graceful)
- [ ] Brevo API key stored in .env (not committed to git)
- [ ] All tests pass
- [ ] Code quality review passes

## Files Affected

- `src/services/brevo.js` (create) - Brevo API adapter
- `src/services/brevo.test.js` (create) - Brevo adapter tests
- `src/components/ContactForm.jsx` (modify) - Add Brevo integration
- `src/components/ContactForm.test.jsx` (modify) - Add integration tests
- `.env.example` (modify) - Add VITE_BREVO_API_KEY
- `docs/BREVO_SETUP.md` (create) - Setup instructions

## Dependencies

- Brevo account (free tier)
- Brevo API key
- LaunchDarkly flag `brevo-integration` created

## Deployment Strategy

**Type B - Technical Foundation with Feature Flag:**

1. Deploy with flag OFF (zero impact, contacts still go nowhere)
2. Create Brevo account and get API key
3. Configure `VITE_BREVO_API_KEY` in production environment
4. Toggle flag ON for internal testing
5. Verify contact creation works
6. Monitor for errors in production
7. Gradual rollout if successful (or keep ON if working well)

## Notes

- Brevo free tier: 300 emails/day (9,000/month), unlimited contacts
- API documentation: https://developers.brevo.com/
- Consider adding email templates setup in future story
- This is foundation for future email marketing campaigns
