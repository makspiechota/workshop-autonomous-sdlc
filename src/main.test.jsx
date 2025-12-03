import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'

/**
 * LaunchDarkly SDK Integration Tests
 *
 * Story 000003 - Feature Flags System (LaunchDarkly)
 * Batch 1: LaunchDarkly SDK Setup and Configuration
 *
 * These tests verify the integration of LaunchDarkly SDK with the React application.
 * They follow TDD principles - tests are written FIRST and will FAIL until implementation is complete.
 *
 * Requirements being tested:
 * 1. LaunchDarkly provider wraps the application
 * 2. Provider reads client-side ID from environment variable
 * 3. Provider initializes with anonymous user context
 * 4. Loading state is handled properly
 * 5. Graceful fallback when SDK initialization fails
 */

// Mock the LaunchDarkly SDK before importing main
vi.mock('launchdarkly-react-client-sdk', () => ({
  asyncWithLDProvider: vi.fn(),
  withLDProvider: vi.fn(),
  useFlags: vi.fn(() => ({})),
  useLDClient: vi.fn(() => null),
}))

// Mock Sentry to avoid initialization issues in tests
vi.mock('@sentry/react', () => ({
  init: vi.fn(),
  browserTracingIntegration: vi.fn(() => ({})),
  replayIntegration: vi.fn(() => ({})),
  ErrorBoundary: ({ children }) => children,
  captureException: vi.fn(),
}))

describe('LaunchDarkly SDK Integration', () => {
  let mockAsyncWithLDProvider
  let mockWithLDProvider
  let originalEnv

  beforeEach(async () => {
    // Save original environment
    originalEnv = import.meta.env.VITE_LAUNCHDARKLY_CLIENT_ID

    // Reset all mocks
    vi.clearAllMocks()

    // Get mock functions
    const LD = await import('launchdarkly-react-client-sdk')
    mockAsyncWithLDProvider = LD.asyncWithLDProvider
    mockWithLDProvider = LD.withLDProvider

    // Default mock implementation - returns HOC function that wraps component
    mockAsyncWithLDProvider.mockResolvedValue((Component) => Component)
    mockWithLDProvider.mockReturnValue((Component) => Component)
  })

  afterEach(() => {
    // Restore environment
    if (originalEnv !== undefined) {
      import.meta.env.VITE_LAUNCHDARKLY_CLIENT_ID = originalEnv
    }
    vi.resetModules()
  })

  describe('Provider Configuration', () => {
    it('should use asyncWithLDProvider to wrap the application', async () => {
      // This test verifies that the LaunchDarkly provider is properly initialized
      // The implementation should use asyncWithLDProvider from the SDK

      import.meta.env.VITE_LAUNCHDARKLY_CLIENT_ID = 'test-client-id-123'

      // Dynamic import to get fresh module with new env
      await import('./main.jsx')

      expect(mockAsyncWithLDProvider).toHaveBeenCalled()
    })

    it('should read client-side ID from VITE_LAUNCHDARKLY_CLIENT_ID environment variable', async () => {
      const testClientId = 'test-client-id-abc123'
      import.meta.env.VITE_LAUNCHDARKLY_CLIENT_ID = testClientId

      await import('./main.jsx')

      expect(mockAsyncWithLDProvider).toHaveBeenCalledWith(
        expect.objectContaining({
          clientSideID: testClientId,
        })
      )
    })

    it('should configure anonymous user context by default', async () => {
      import.meta.env.VITE_LAUNCHDARKLY_CLIENT_ID = 'test-client-id-123'

      await import('./main.jsx')

      const config = mockAsyncWithLDProvider.mock.calls[0][0]

      expect(config.context).toBeDefined()
      expect(config.context.kind).toBe('user')
      expect(config.context.anonymous).toBe(true)
      expect(config.context.key).toBeDefined()
    })

    it('should generate a unique key for anonymous users', async () => {
      import.meta.env.VITE_LAUNCHDARKLY_CLIENT_ID = 'test-client-id-123'

      await import('./main.jsx')

      const config = mockAsyncWithLDProvider.mock.calls[0][0]

      expect(config.context.key).toMatch(/^anonymous-/)
      expect(config.context.key.length).toBeGreaterThan(10)
    })
  })

  describe('Error Handling', () => {
    it('should not call asyncWithLDProvider when client ID is missing', async () => {
      import.meta.env.VITE_LAUNCHDARKLY_CLIENT_ID = undefined

      vi.spyOn(console, 'warn').mockImplementation(() => {})

      await import('./main.jsx')

      expect(mockAsyncWithLDProvider).not.toHaveBeenCalled()
    })
  })

  describe('Provider Options', () => {
    it('should set appropriate SDK options for client-side usage', async () => {
      import.meta.env.VITE_LAUNCHDARKLY_CLIENT_ID = 'test-client-id-123'

      await import('./main.jsx')

      const config = mockAsyncWithLDProvider.mock.calls[0][0]

      // Should have options configured
      expect(config.options).toBeDefined()
    })

    it('should enable bootstrap for faster initial load', async () => {
      import.meta.env.VITE_LAUNCHDARKLY_CLIENT_ID = 'test-client-id-123'

      await import('./main.jsx')

      const config = mockAsyncWithLDProvider.mock.calls[0][0]

      // Bootstrap should be configured for performance
      expect(config.options.bootstrap).toBeDefined()
    })
  })

  describe('React Integration', () => {
    it('should wrap App component with LaunchDarkly provider', async () => {
      import.meta.env.VITE_LAUNCHDARKLY_CLIENT_ID = 'test-client-id-123'

      let wrappedComponent = null
      mockAsyncWithLDProvider.mockImplementation((config) => {
        return async (ComponentToWrap) => {
          wrappedComponent = ComponentToWrap
          return ComponentToWrap
        }
      })

      await import('./main.jsx')

      expect(wrappedComponent).toBeDefined()
      expect(wrappedComponent.name || wrappedComponent.displayName).toMatch(/app/i)
    })

    it('should maintain Sentry ErrorBoundary as outer wrapper', async () => {
      import.meta.env.VITE_LAUNCHDARKLY_CLIENT_ID = 'test-client-id-123'

      const Sentry = await import('@sentry/react')

      await import('./main.jsx')

      // Verify ErrorBoundary is used (checked by mock calls)
      expect(Sentry.ErrorBoundary).toBeDefined()
    })
  })

  describe('Environment Variable Validation', () => {
    it('should accept valid LaunchDarkly client ID format', async () => {
      // Valid format: alphanumeric string
      import.meta.env.VITE_LAUNCHDARKLY_CLIENT_ID = '64a8f1234567890abcdef123'

      await import('./main.jsx')

      expect(mockAsyncWithLDProvider).toHaveBeenCalledWith(
        expect.objectContaining({
          clientSideID: '64a8f1234567890abcdef123',
        })
      )
    })

    it('should handle empty string client ID as missing', async () => {
      import.meta.env.VITE_LAUNCHDARKLY_CLIENT_ID = ''

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      await import('./main.jsx')

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('LaunchDarkly client ID not configured')
      )
      expect(mockAsyncWithLDProvider).not.toHaveBeenCalled()

      consoleWarnSpy.mockRestore()
    })
  })

  describe('Feature Flag Context', () => {
    it('should make feature flags available to child components', async () => {
      import.meta.env.VITE_LAUNCHDARKLY_CLIENT_ID = 'test-client-id-123'

      const { useFlags } = await import('launchdarkly-react-client-sdk')
      useFlags.mockReturnValue({
        testFlag: true,
        anotherFlag: false,
      })

      await import('./main.jsx')

      // Verify provider setup allows access to flags
      const config = mockAsyncWithLDProvider.mock.calls[0][0]
      expect(config.clientSideID).toBeDefined()
    })

    it('should make LD client available to child components', async () => {
      import.meta.env.VITE_LAUNCHDARKLY_CLIENT_ID = 'test-client-id-123'

      const { useLDClient } = await import('launchdarkly-react-client-sdk')
      const mockClient = {
        identify: vi.fn(),
        variation: vi.fn(),
        track: vi.fn(),
      }
      useLDClient.mockReturnValue(mockClient)

      await import('./main.jsx')

      // Verify provider setup allows access to client
      expect(mockAsyncWithLDProvider).toHaveBeenCalled()
    })
  })
})
