/**
 * Feature Flags Hook
 *
 * Story 000003 - Feature Flags System (LaunchDarkly)
 * Batch 1: LaunchDarkly SDK Setup and Configuration
 *
 * Provides a convenient API for accessing LaunchDarkly feature flags.
 */

import { useFlags, useLDClient } from 'launchdarkly-react-client-sdk'

/**
 * Utility function to get a feature flag value
 * @param {Object} flags - Flags object
 * @param {string} key - Flag key
 * @param {*} defaultValue - Default value if flag doesn't exist
 * @returns {*} Flag value or default
 */
export function getFeatureFlag(flags, key, defaultValue = false) {
  return flags[key] !== undefined ? flags[key] : defaultValue
}

/**
 * Utility function to check if a feature is enabled
 * @param {Object} flags - Flags object
 * @param {string} key - Flag key
 * @returns {boolean} True if enabled, false otherwise
 */
export function isFeatureEnabled(flags, key) {
  return !!flags[key]
}

/**
 * Hook for accessing LaunchDarkly feature flags
 * @returns {Object} Feature flags API
 */
export function useFeatureFlags() {
  let flags = {}
  let client = null

  try {
    flags = useFlags() || {}
    client = useLDClient()
  } catch (error) {
    console.error('Error accessing LaunchDarkly:', error)
  }

  return {
    flags,
    client,
    isReady: !!client,
    getFlag: (key, defaultValue = false) => getFeatureFlag(flags, key, defaultValue),
    isEnabled: (key) => isFeatureEnabled(flags, key),
  }
}
