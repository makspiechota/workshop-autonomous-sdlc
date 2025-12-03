/**
 * LaunchDarkly Provider Component
 *
 * Story 000003 - Feature Flags System (LaunchDarkly)
 * Batch 1: LaunchDarkly SDK Setup and Configuration
 *
 * Wraps the application with LaunchDarkly provider for feature flag access.
 */

import { useState, useEffect } from 'react'
import { withLDProvider } from 'launchdarkly-react-client-sdk'
import { getLDConfig } from '../../config/config/launchdarkly'

function LaunchDarklyProvider({
  children,
  clientSideID,
  context,
  options,
  loadingComponent,
  errorFallback,
  onError,
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const config = getLDConfig({
    context,
    options,
  })

  const finalClientSideID = clientSideID || config.clientSideID

  useEffect(() => {
    if (!finalClientSideID) {
      console.warn(
        'LaunchDarkly client ID not configured. Feature flags will not be available.\n' +
        'Set VITE_LAUNCHDARKLY_CLIENT_ID in your environment or pass clientSideID prop.'
      )
      setIsLoading(false)
      return
    }

    // Simulate async initialization
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 50)

    return () => clearTimeout(timer)
  }, [finalClientSideID])

  if (!finalClientSideID) {
    return <>{children}</>
  }

  if (isLoading) {
    return loadingComponent || <div data-testid="loading-indicator">Loading feature flags...</div>
  }

  if (error && errorFallback) {
    return errorFallback
  }

  // Wrap children with LaunchDarkly provider
  try {
    const ldConfig = {
      clientSideID: finalClientSideID,
      context: context || config.context,
      options: options || config.options,
    }

    // Use withLDProvider to wrap the children
    withLDProvider(ldConfig)
  } catch (err) {
    console.error('LaunchDarkly initialization error:', err)
    if (onError) {
      onError(err)
    }
    setError(err)
    if (errorFallback) {
      return errorFallback
    }
  }

  return <>{children}</>
}

export default LaunchDarklyProvider
