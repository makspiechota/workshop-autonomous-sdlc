/**
 * LaunchDarkly Configuration Module
 *
 * Story 000003 - Feature Flags System (LaunchDarkly)
 * Batch 1: LaunchDarkly SDK Setup and Configuration
 *
 * Provides configuration for LaunchDarkly SDK initialization.
 */

/**
 * Generates an anonymous user context for LaunchDarkly
 * @returns {Object} Anonymous user context
 */
export function generateAnonymousUser() {
  return {
    kind: 'user',
    key: `anonymous-${crypto.randomUUID()}`,
    anonymous: true,
  }
}

/**
 * Gets LaunchDarkly configuration
 * @param {Object} options - Configuration options
 * @param {Object} options.context - Custom user context
 * @param {Object} options.options - Custom SDK options
 * @returns {Object} LaunchDarkly configuration
 */
export function getLDConfig({ context, options } = {}) {
  const clientSideID = import.meta.env.VITE_LAUNCHDARKLY_CLIENT_ID
  // Handle undefined, null, empty string, and the string "undefined"
  const validClientSideID =
    clientSideID &&
    clientSideID !== '' &&
    clientSideID !== 'undefined'
      ? clientSideID
      : undefined

  return {
    clientSideID: validClientSideID,
    context: context || generateAnonymousUser(),
    options: {
      bootstrap: 'localStorage',
      ...options,
    },
    isConfigured: !!validClientSideID,
  }
}
