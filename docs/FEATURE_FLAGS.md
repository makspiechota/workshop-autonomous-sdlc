# Feature Flags with LaunchDarkly

This project uses LaunchDarkly for runtime feature flags, enabling safer deployments and controlled feature rollouts.

## Table of Contents

- [Overview](#overview)
- [Setup](#setup)
- [Usage](#usage)
- [Creating Flags](#creating-flags)
- [Best Practices](#best-practices)
- [Testing](#testing)

## Overview

LaunchDarkly provides runtime feature flags that allow you to:
- Toggle features on/off without redeployment
- Roll out features gradually to users
- Instantly disable problematic features
- Test in production safely

**Key Components:**
- LaunchDarkly React SDK (`launchdarkly-react-client-sdk`)
- Client-side ID for browser-based flag evaluation
- Anonymous user context (no PII collected)
- `useFlags()` hook for accessing flags in components

## Setup

### 1. LaunchDarkly Account

1. Create a free account at [https://launchdarkly.com](https://launchdarkly.com)
2. Create a new project (e.g., "Workshop Autonomous SDLC")
3. Navigate to Account Settings → Projects → Your Project
4. Copy the **Client-side ID** from the "Environments" section

### 2. Environment Variables

Add the client-side ID to your environment:

**Local Development (`.env`):**
```bash
VITE_LAUNCHDARKLY_CLIENT_ID=your-client-side-id-here
```

**Production (GitHub Actions):**
1. Go to your GitHub repository → Settings → Secrets and variables → Actions
2. Click "Variables" tab
3. Add new variable:
   - Name: `VITE_LAUNCHDARKLY_CLIENT_ID`
   - Value: Your LaunchDarkly client-side ID

Note: Client-side IDs are safe to expose in client code and are not secrets.

### 3. SDK Installation

The SDK is already installed:
```bash
npm install launchdarkly-react-client-sdk
```

## Usage

### In Components

Use the `useFlags()` hook to access feature flags:

```javascript
import { useFlags } from 'launchdarkly-react-client-sdk'

function MyComponent() {
  const { myFeatureFlag } = useFlags()

  return (
    <div>
      {myFeatureFlag && (
        <NewFeature />
      )}
      <ExistingContent />
    </div>
  )
}
```

### Flag Naming Convention

Use **kebab-case** for flag keys:
- `example-widget`
- `new-checkout-flow`
- `beta-dashboard`
- `experimental-ai-features`

In code, flags are accessed with camelCase:
```javascript
const { exampleWidget, newCheckoutFlow, betaDashboard } = useFlags()
```

### Conditional Rendering Patterns

**Simple boolean flag:**
```javascript
{myFlag && <Feature />}
```

**With fallback:**
```javascript
{myFlag ? <NewFeature /> : <OldFeature />}
```

**Multiple flags:**
```javascript
const { featureA, featureB } = useFlags()

return (
  <>
    {featureA && <FeatureA />}
    {featureB && <FeatureB />}
    <AlwaysVisible />
  </>
)
```

**Safe access (handles undefined during loading):**
```javascript
const flags = useFlags()
const isEnabled = flags?.myFlag ?? false
```

## Creating Flags

### In LaunchDarkly Dashboard

1. Log in to [LaunchDarkly](https://app.launchdarkly.com)
2. Select your project and environment
3. Click "Create flag"
4. Configure:
   - **Name**: Human-readable name (e.g., "Example Widget")
   - **Key**: kebab-case identifier (e.g., `example-widget`)
   - **Flag type**: Boolean
   - **Description**: What the flag controls
5. Set default value (usually `false` for new features)
6. Click "Save flag"

### Flag States

- **ON (true)**: Feature is visible to users
- **OFF (false)**: Feature is hidden
- **Default OFF**: Recommended for new features (safer rollout)

### Toggling Flags

1. Go to your flag in the dashboard
2. Toggle the switch for your environment
3. Changes propagate instantly (no deployment needed)
4. Verify in your application

## Best Practices

### 1. All New Features Behind Flags

Every new feature should be wrapped in a feature flag:

```javascript
// GOOD
function App() {
  const { newFeature } = useFlags()

  return (
    <div>
      {newFeature && <NewFeature />}
      <ExistingFeatures />
    </div>
  )
}

// BAD - direct implementation without flag
function App() {
  return (
    <div>
      <NewFeature />  {/* Not behind a flag! */}
      <ExistingFeatures />
    </div>
  )
}
```

### 2. Default to OFF

New flags should default to `false`:
- Safer rollout (nothing breaks by default)
- Explicit activation required
- Easy to test flag ON and OFF states

### 3. Clean Up Old Flags

Remove flags after features are fully rolled out:
1. Ensure flag is ON in all environments
2. Remove flag check from code
3. Delete flag from LaunchDarkly
4. Deploy cleanup

### 4. Document Flag Purpose

Add comments explaining what each flag controls:

```javascript
// Feature flag: example-widget
// Controls visibility of the promotional banner widget
// Added: 2025-01-15
// Remove after: 2025-02-01 (once stable)
const { exampleWidget } = useFlags()
```

### 5. Handle Loading States

Flags may be undefined while initializing:

```javascript
const { myFlag } = useFlags()

if (myFlag === undefined) {
  return <LoadingSpinner />
}

return myFlag ? <NewFeature /> : <OldFeature />
```

## Testing

### Mocking Flags in Tests

Use Vitest to mock the `useFlags()` hook:

```javascript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

// Mock LaunchDarkly SDK
vi.mock('launchdarkly-react-client-sdk', () => ({
  useFlags: vi.fn(() => ({ exampleWidget: true })),
  useLDClient: vi.fn(() => null)
}))

describe('MyComponent', () => {
  it('should render feature when flag is enabled', () => {
    const LD = require('launchdarkly-react-client-sdk')
    LD.useFlags.mockReturnValue({ myFeature: true })

    render(<MyComponent />)

    expect(screen.getByText('New Feature')).toBeInTheDocument()
  })

  it('should NOT render feature when flag is disabled', () => {
    const LD = require('launchdarkly-react-client-sdk')
    LD.useFlags.mockReturnValue({ myFeature: false })

    render(<MyComponent />)

    expect(screen.queryByText('New Feature')).not.toBeInTheDocument()
  })
})
```

### Test Both States

Always test both flag enabled and disabled:

```javascript
describe('Feature with flag', () => {
  it('renders when flag is true', () => {
    // Test with flag ON
  })

  it('does not render when flag is false', () => {
    // Test with flag OFF
  })

  it('handles undefined flag gracefully', () => {
    // Test loading state
  })
})
```

## Architecture

### Main Entry Point

LaunchDarkly is initialized in `src/main.jsx`:

```javascript
import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk'
import { getLDConfig } from './config/launchdarkly'

const ldConfig = getLDConfig()

async function initializeApp() {
  let AppWithFeatureFlags = App

  if (ldConfig.clientSideID) {
    AppWithFeatureFlags = await asyncWithLDProvider({
      clientSideID: ldConfig.clientSideID,
      context: ldConfig.context,
      options: ldConfig.options
    })(App)
  }

  // Render app...
}
```

### Configuration Module

`src/config/launchdarkly.js` provides centralized configuration:

```javascript
export function getLDConfig() {
  return {
    clientSideID: import.meta.env.VITE_LAUNCHDARKLY_CLIENT_ID,
    context: generateAnonymousUser(),
    options: {
      bootstrap: 'localStorage' // Faster subsequent loads
    }
  }
}
```

### Anonymous Users

We use anonymous user contexts (no PII):

```javascript
{
  kind: 'user',
  anonymous: true,
  key: 'anonymous-<random-uuid>'
}
```

## Troubleshooting

### Flags Not Loading

Check:
1. Client-side ID is correctly set in `.env`
2. LaunchDarkly SDK initialized without errors (check console)
3. Flag exists in LaunchDarkly dashboard
4. Environment matches (development/production)

### Flags Always Undefined

Check:
1. `asyncWithLDProvider` is properly wrapping App
2. Component is inside the LaunchDarkly provider
3. Browser has internet connection
4. No console errors from LaunchDarkly SDK

### Changes Not Reflecting

- Clear localStorage: `localStorage.clear()`
- Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)
- Check flag is toggled in correct environment
- Verify client-side ID matches environment

## Resources

- [LaunchDarkly React SDK Docs](https://docs.launchdarkly.com/sdk/client-side/react/react-web)
- [LaunchDarkly Dashboard](https://app.launchdarkly.com)
- [Best Practices Guide](https://docs.launchdarkly.com/guides/flags/best-practices)

## Example: Current Implementation

### ExampleWidget Component

Located at `src/components/ExampleWidget.jsx`:

```javascript
function ExampleWidget() {
  return (
    <div className="example-widget" role="banner">
      This is an example feature controlled by a LaunchDarkly feature flag!
    </div>
  )
}
```

### Usage in App

Located at `src/App.jsx`:

```javascript
import { useFlags } from 'launchdarkly-react-client-sdk'
import ExampleWidget from './components/ExampleWidget'

function App() {
  const { exampleWidget } = useFlags()

  return (
    <div className="app">
      {exampleWidget && <ExampleWidget />}
      <Hero />
      <Benefits />
      <ContactForm />
    </div>
  )
}
```

### Testing

Located at `src/components/ExampleWidget.test.jsx`:

```javascript
vi.mock('launchdarkly-react-client-sdk', () => ({
  useFlags: vi.fn(() => ({ exampleWidget: true }))
}))

it('renders when flag is enabled', () => {
  render(<App />)
  expect(screen.getByRole('banner')).toBeInTheDocument()
})
```

## Support

For issues with LaunchDarkly integration, check:
1. This documentation
2. Console errors in browser DevTools
3. LaunchDarkly dashboard for flag configuration
4. Project README for setup instructions
