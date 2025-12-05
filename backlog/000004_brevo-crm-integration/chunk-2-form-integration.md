# Chunk 2: Contact Form Integration

**Story**: 000004
**Type**: Technical Foundation
**Feature Flag**: `brevo-integration`
**Estimated Effort**: Small (~1.5h, ~60 lines, 2 files)

## Objective

Integrate Brevo adapter into contact form submission handler behind feature flag `brevo-integration`.

## Implementation Approach

Using TDD:
- RED: Write failing tests using `it.todo` for test design review
- GREEN: Implement integration to pass tests after approval
- REFACTOR: Clean up and optimize

## Files Affected

- `src/components/ContactForm.jsx` (modify) - Add Brevo integration
- `src/components/ContactForm.test.jsx` (modify) - Add integration tests

## Test Cases (RED Phase)

**These will be written as `it.todo` for the test design review PR:**

1. **Happy Path**:
   - [ ] Submits form and creates Brevo contact when flag ON
   - [ ] Shows success message after successful submission
   - [ ] Clears form after successful submission

2. **Edge Cases**:
   - [ ] Handles form submission when flag OFF (no Brevo call)
   - [ ] Shows appropriate message when flag OFF

3. **Error Handling**:
   - [ ] Shows error message when Brevo API fails
   - [ ] Form remains functional when Brevo fails
   - [ ] Logs errors without breaking user experience

4. **Feature Flag States**:
   - [ ] Flag ON: Form creates Brevo contact
   - [ ] Flag OFF: Form doesn't call Brevo (graceful no-op)
   - [ ] Flag undefined: Treats as OFF
   - [ ] No errors when flag OFF

## Implementation Details (GREEN Phase)

**After tests are reviewed and approved, implement:**

1. Create LaunchDarkly flag `brevo-integration` in dashboard
2. Import Brevo client and useFlags hook:
   ```javascript
   import { useFlags } from 'launchdarkly-react-client-sdk'
   import { BrevoClient } from '../services/brevo'
   ```

3. Check flag before Brevo integration:
   ```javascript
   const handleSubmit = async (formData) => {
     const flags = useFlags()
     const flagData = flags?.['brevo-integration']
     const isBrevoEnabled = typeof flagData === 'object' ? flagData?.value : flagData

     if (isBrevoEnabled) {
       const brevo = new BrevoClient()
       const result = await brevo.createContact({
         email: formData.email,
         firstName: formData.name,
         attributes: { message: formData.message }
       })

       if (!result.success) {
         console.error('Brevo integration failed:', result.error)
         // Show error message to user
       }
     }

     // Continue with normal form handling
   }
   ```

**Key considerations**:
- Feature flag check before any Brevo call
- Graceful degradation if Brevo fails
- User sees appropriate feedback
- Form works regardless of flag state

## Acceptance Criteria

- [ ] Tests written using `it.todo` (for review PR)
- [ ] Tests approved and merged
- [ ] Tests converted to actual implementations
- [ ] All tests passing
- [ ] Flag integration working (ON/OFF states)
- [ ] Code follows project conventions
- [ ] No breaking changes to form
- [ ] Code quality review passes
- [ ] Deployed to production with flag OFF
- [ ] Zero user impact with flag OFF

## Review Checklist

**Test Design Review (RED)**:
- [ ] Test cases cover happy path
- [ ] Test cases cover both flag states (ON/OFF)
- [ ] Test cases cover error scenarios
- [ ] Tests verify graceful degradation
- [ ] Tests use `it.todo` (will pass CI)

**Implementation Review (GREEN + REFACTOR)**:
- [ ] All tests passing
- [ ] Code follows conventions
- [ ] Flag correctly implemented
- [ ] Error handling is graceful
- [ ] No breaking changes
- [ ] Ready for deployment

## Deployment Strategy

1. **Test PR**: Merge tests with `it.todo` (passes CI)
2. **Implementation PR**: Convert `it.todo` to real tests + implement integration
3. **Deploy**: With flag OFF (zero impact, contacts still go nowhere)
4. **Verify**: Tests pass in CI/CD, form still works
5. **Configure**: Set `VITE_BREVO_API_KEY` in production environment
6. **Toggle**: Turn flag ON for internal testing
7. **Monitor**: Check Brevo dashboard for test contacts
8. **Rollout**: Keep ON if working, OFF if issues detected

## Notes

- Flag OFF is the safe default (no change in behavior)
- Flag ON enables Brevo integration
- Form must work perfectly regardless of flag state
- This completes the story - both chunks deployed
