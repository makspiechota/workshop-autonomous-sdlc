# Chunk 1: Brevo API Adapter

**Story**: 000004
**Type**: Technical Foundation
**Feature Flag**: N/A (adapter class, not user-facing)
**Estimated Effort**: Small (~1.5h, ~80 lines, 2 files)

## Objective

Create a Brevo API adapter class that handles contact creation with proper error handling and logging.

## Implementation Approach

Using TDD:
- RED: Write failing tests using `it.todo` for test design review
- GREEN: Implement adapter class to pass tests after approval
- REFACTOR: Clean up and optimize

## Files Affected

- `src/services/brevo.js` (create) - Brevo API adapter class
- `src/services/brevo.test.js` (create) - Test suite
- `.env.example` (modify) - Add BREVO_API_KEY example

## Test Cases (RED Phase)

**These will be written as `it.todo` for the test design review PR:**

1. **Happy Path**:
   - [ ] Creates contact successfully with valid data
   - [ ] Returns success response with contact ID
   - [ ] Sends correct API request format to Brevo

2. **Edge Cases**:
   - [ ] Handles missing optional fields gracefully
   - [ ] Handles duplicate contact (email already exists)
   - [ ] Validates email format before API call

3. **Error Handling**:
   - [ ] Handles network errors gracefully
   - [ ] Handles invalid API key (401 error)
   - [ ] Handles rate limiting (429 error)
   - [ ] Handles Brevo API errors (4xx, 5xx)
   - [ ] Logs errors without exposing API key
   - [ ] Never throws exceptions (returns error objects)

4. **Configuration**:
   - [ ] Reads API key from environment variable
   - [ ] Uses correct Brevo API v3 endpoint
   - [ ] Sets correct headers (API key, content-type)

## Implementation Details (GREEN Phase)

**After tests are reviewed and approved, implement:**

1. Create Brevo adapter class:
   ```javascript
   // src/services/brevo.js
   class BrevoClient {
     constructor(apiKey = import.meta.env.VITE_BREVO_API_KEY) {
       this.apiKey = apiKey
       this.baseUrl = 'https://api.brevo.com/v3'
     }

     async createContact({ email, firstName, lastName, attributes = {} }) {
       // Implementation here
     }
   }
   ```

2. Use fetch API for HTTP requests
3. Handle all error cases gracefully (no thrown exceptions)
4. Return structured response: `{ success: boolean, data?: any, error?: string }`
5. Add console.error for logging (without exposing API key)
6. Validate email format before API call

**Key considerations**:
- API key must come from environment variable
- Never log API key in errors
- Always return success/error object (never throw)
- Use Brevo API v3 documentation: https://developers.brevo.com/reference/createcontact-1

## Acceptance Criteria

- [ ] Tests written using `it.todo` (for review PR)
- [ ] Tests approved and merged
- [ ] Tests converted to actual implementations
- [ ] All tests passing
- [ ] Adapter class follows project conventions
- [ ] Error handling comprehensive
- [ ] No API key leakage in logs
- [ ] Code quality review passes
- [ ] Deployed to production (safe, not called yet)

## Review Checklist

**Test Design Review (RED)**:
- [ ] Test cases cover happy path
- [ ] Test cases cover edge cases (duplicates, missing fields)
- [ ] Test cases cover all error scenarios
- [ ] Tests verify no API key leakage
- [ ] Tests use `it.todo` (will pass CI)

**Implementation Review (GREEN + REFACTOR)**:
- [ ] All tests passing
- [ ] Code follows conventions
- [ ] Error handling is comprehensive
- [ ] No security issues (API key exposure)
- [ ] Ready for deployment

## Deployment Strategy

1. **Test PR**: Merge tests with `it.todo` (passes CI)
2. **Implementation PR**: Convert `it.todo` to real tests + implement adapter
3. **Deploy**: Safe deployment (adapter not called yet, just exists)
4. **Verify**: Tests pass in CI/CD, no runtime errors
5. **Next**: Move to Chunk 2 (form integration with flag)
