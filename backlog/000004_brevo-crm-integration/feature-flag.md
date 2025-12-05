# Feature Flag: brevo-integration

**Story**: 000004
**Flag Key**: `brevo-integration`
**Type**: Boolean
**Default**: OFF

## LaunchDarkly Setup

1. Go to https://app.launchdarkly.com/[project]/features
2. Click "Create flag"
3. Configure:
   - **Name**: Brevo CRM Integration
   - **Key**: `brevo-integration` (exact match required)
   - **Type**: Boolean
   - **Tags**: story-000004
   - **Description**: "Enables Brevo CRM integration for contact form submissions"
4. Save with default: OFF

## Code Usage

```javascript
import { useFlags } from 'launchdarkly-react-client-sdk'
import { BrevoClient } from '../services/brevo'

function ContactForm() {
  const flags = useFlags()
  const flagData = flags?.['brevo-integration']
  const isEnabled = typeof flagData === 'object' ? flagData?.value : flagData

  const handleSubmit = async (formData) => {
    if (isEnabled) {
      const brevo = new BrevoClient()
      const result = await brevo.createContact({
        email: formData.email,
        firstName: formData.name,
        attributes: { message: formData.message }
      })

      if (!result.success) {
        console.error('Brevo integration failed:', result.error)
        // Handle error gracefully
      }
    }

    // Continue with normal form handling
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  )
}
```

## Rollout Plan

1. **Deploy (flag OFF)** - Zero impact
   - Code deployed but Brevo integration disabled
   - Contact form works exactly as before (submissions go nowhere)
   - No risk of breaking changes

2. **Configure Brevo** - Setup
   - Create Brevo account (free tier)
   - Get API key from Brevo dashboard
   - Add `VITE_BREVO_API_KEY` to production environment variables
   - Verify environment variable is set

3. **Internal test (toggle ON for team)** - Validation
   - Turn flag ON in LaunchDarkly
   - Submit test contact through form
   - Verify contact appears in Brevo dashboard
   - Check for any console errors
   - Test error scenarios (invalid email, network issues)

4. **Production (100%)** - Full rollout
   - If testing successful, keep flag ON
   - Monitor Brevo dashboard for incoming contacts
   - Monitor application logs for errors
   - Check form submission success rates

5. **Monitor** - Post-deployment
   - Watch for Brevo API errors in logs
   - Verify contacts appearing in Brevo
   - If issues detected: toggle OFF immediately (no redeploy needed)
   - Fix issues, then toggle back ON

6. **Remove flag (after 2 weeks stable)** - Cleanup
   - After 2 weeks of stable operation
   - Remove flag check from code
   - Make Brevo integration permanent
   - Delete flag from LaunchDarkly

## Testing Checklist

Before turning flag ON in production:

- [ ] Flag created in LaunchDarkly with key `brevo-integration`
- [ ] Brevo account created (free tier)
- [ ] Brevo API key obtained
- [ ] `VITE_BREVO_API_KEY` set in production environment
- [ ] Tests pass with flag ON
- [ ] Tests pass with flag OFF
- [ ] Form works correctly with flag OFF
- [ ] Form creates contacts with flag ON
- [ ] Error handling tested (network failures, invalid API key)

## Troubleshooting

### Flag is ON but contacts not appearing in Brevo

1. Check `VITE_BREVO_API_KEY` is set in environment
2. Check browser console for errors
3. Verify API key is valid (test in Brevo dashboard)
4. Check Brevo account hasn't exceeded rate limits

### Form breaks when flag is ON

1. Toggle flag OFF immediately (restores normal operation)
2. Check console errors for details
3. Review Brevo adapter error handling
4. Fix issues and test locally before turning back ON

### Want to rollback

1. Toggle flag OFF in LaunchDarkly (instant, no redeploy)
2. Contact form continues working (submissions go nowhere)
3. Fix issues at leisure
4. Toggle back ON when ready
