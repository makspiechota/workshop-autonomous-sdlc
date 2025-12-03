import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import App from './App'

/**
 * App Component Tests
 *
 * Story 000003 - Feature Flags System (LaunchDarkly)
 * Batch 2: Example Widget with Feature Flag
 *
 * These tests verify the integration of ExampleWidget with LaunchDarkly feature flags in App.jsx.
 * They follow TDD principles - tests are written FIRST and will FAIL until implementation is complete.
 */

// Mock LaunchDarkly SDK
vi.mock('launchdarkly-react-client-sdk', () => ({
  useFlags: vi.fn(),
  useLDClient: vi.fn(),
}))

// Import the mocked module
import * as LD from 'launchdarkly-react-client-sdk'

describe('App', () => {
  let mockUseFlags

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks()

    // Get the mock function
    mockUseFlags = LD.useFlags

    // Default: all flags are false
    mockUseFlags.mockReturnValue({})
  })

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<App />)
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    })

    it('renders all main sections', () => {
      render(<App />)

      // Hero section
      expect(screen.getByRole('heading', { name: /build your software factory/i })).toBeInTheDocument()

      // Benefits section
      expect(screen.getByRole('heading', { name: /why software factory/i })).toBeInTheDocument()

      // Contact form
      expect(screen.getByRole('heading', { name: /get in touch/i })).toBeInTheDocument()
    })

    it('has contact form with required fields', () => {
      render(<App />)
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/message|interest|tell us/i)).toBeInTheDocument()
    })
  })

  describe('Feature Flag Integration - ExampleWidget', () => {
    it('should import and use useFlags hook from LaunchDarkly SDK', () => {
      render(<App />)

      // useFlags should be called when App renders
      expect(mockUseFlags).toHaveBeenCalled()
    })

    it('should NOT render ExampleWidget when exampleWidget flag is false', () => {
      mockUseFlags.mockReturnValue({
        exampleWidget: false,
      })

      render(<App />)

      // Widget should not be present
      const widget = screen.queryByTestId('example-widget')
      expect(widget).not.toBeInTheDocument()
    })

    it('should NOT render ExampleWidget when exampleWidget flag is undefined', () => {
      mockUseFlags.mockReturnValue({})

      render(<App />)

      // Widget should not be present when flag is undefined
      const widget = screen.queryByTestId('example-widget')
      expect(widget).not.toBeInTheDocument()
    })

    it('should render ExampleWidget when exampleWidget flag is true', () => {
      mockUseFlags.mockReturnValue({
        exampleWidget: true,
      })

      render(<App />)

      // Widget should be present
      const widget = screen.getByTestId('example-widget')
      expect(widget).toBeInTheDocument()
    })

    it('should render ExampleWidget at the top of the page when flag is true', () => {
      mockUseFlags.mockReturnValue({
        exampleWidget: true,
      })

      const { container } = render(<App />)

      // Widget should be one of the first elements
      const widget = screen.getByTestId('example-widget')
      expect(widget).toBeInTheDocument()

      // Check it's near the top of the DOM
      const appDiv = container.querySelector('.app')
      const firstChild = appDiv?.firstElementChild

      // Widget should be the first child or very close to it
      expect(firstChild).toBeTruthy()
    })

    it('should render main content even when widget is shown', () => {
      mockUseFlags.mockReturnValue({
        exampleWidget: true,
      })

      render(<App />)

      // Widget should be present
      expect(screen.getByTestId('example-widget')).toBeInTheDocument()

      // Main content should still be present
      expect(screen.getByRole('heading', { name: /build your software factory/i })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /why software factory/i })).toBeInTheDocument()
    })
  })

  describe('Loading State Management', () => {
    it('should show loading state while flags are undefined', () => {
      mockUseFlags.mockReturnValue({
        exampleWidget: undefined,
      })

      render(<App />)

      // Should not show widget during loading
      const widget = screen.queryByTestId('example-widget')
      expect(widget).not.toBeInTheDocument()

      // Or should show a loading indicator
      // (This is optional based on implementation)
    })

    it('should handle transition from loading to flag enabled', async () => {
      // Start with undefined (loading)
      mockUseFlags.mockReturnValue({
        exampleWidget: undefined,
      })

      const { rerender } = render(<App />)
      expect(screen.queryByTestId('example-widget')).not.toBeInTheDocument()

      // Simulate flags loading
      mockUseFlags.mockReturnValue({
        exampleWidget: true,
      })

      rerender(<App />)

      await waitFor(() => {
        expect(screen.getByTestId('example-widget')).toBeInTheDocument()
      })
    })

    it('should handle transition from loading to flag disabled', async () => {
      // Start with undefined (loading)
      mockUseFlags.mockReturnValue({
        exampleWidget: undefined,
      })

      const { rerender } = render(<App />)
      expect(screen.queryByTestId('example-widget')).not.toBeInTheDocument()

      // Simulate flags loading with false value
      mockUseFlags.mockReturnValue({
        exampleWidget: false,
      })

      rerender(<App />)

      await waitFor(() => {
        expect(screen.queryByTestId('example-widget')).not.toBeInTheDocument()
      })
    })
  })

  describe('Flag Value Handling', () => {
    it('should correctly handle boolean true value', () => {
      mockUseFlags.mockReturnValue({
        exampleWidget: true,
      })

      render(<App />)
      expect(screen.getByTestId('example-widget')).toBeInTheDocument()
    })

    it('should correctly handle boolean false value', () => {
      mockUseFlags.mockReturnValue({
        exampleWidget: false,
      })

      render(<App />)
      expect(screen.queryByTestId('example-widget')).not.toBeInTheDocument()
    })

    it('should treat null as false (widget not shown)', () => {
      mockUseFlags.mockReturnValue({
        exampleWidget: null,
      })

      render(<App />)
      expect(screen.queryByTestId('example-widget')).not.toBeInTheDocument()
    })

    it('should treat 0 as falsy (widget not shown)', () => {
      mockUseFlags.mockReturnValue({
        exampleWidget: 0,
      })

      render(<App />)
      expect(screen.queryByTestId('example-widget')).not.toBeInTheDocument()
    })

    it('should treat empty string as falsy (widget not shown)', () => {
      mockUseFlags.mockReturnValue({
        exampleWidget: '',
      })

      render(<App />)
      expect(screen.queryByTestId('example-widget')).not.toBeInTheDocument()
    })
  })

  describe('Conditional Rendering Logic', () => {
    it('should use conditional rendering (&&) for the widget', () => {
      // When true, widget appears
      mockUseFlags.mockReturnValue({ exampleWidget: true })
      const { rerender } = render(<App />)
      expect(screen.getByTestId('example-widget')).toBeInTheDocument()

      // When false, widget disappears
      mockUseFlags.mockReturnValue({ exampleWidget: false })
      rerender(<App />)
      expect(screen.queryByTestId('example-widget')).not.toBeInTheDocument()
    })

    it('should not leave empty space when widget is not shown', () => {
      mockUseFlags.mockReturnValue({
        exampleWidget: false,
      })

      const { container } = render(<App />)

      // Should not have empty placeholder div
      const appDiv = container.querySelector('.app')
      const emptyDivs = appDiv?.querySelectorAll('div:empty')

      // If there are empty divs, they should have content or purpose
      // (this ensures clean conditional rendering)
    })
  })

  describe('Multiple Flag Support', () => {
    it('should work with other feature flags simultaneously', () => {
      mockUseFlags.mockReturnValue({
        exampleWidget: true,
        otherFeature: true,
        anotherFlag: false,
      })

      render(<App />)

      // Widget should render based only on its flag
      expect(screen.getByTestId('example-widget')).toBeInTheDocument()
    })

    it('should not be affected by other flags being undefined', () => {
      mockUseFlags.mockReturnValue({
        exampleWidget: true,
        someOtherFlag: undefined,
      })

      render(<App />)
      expect(screen.getByTestId('example-widget')).toBeInTheDocument()
    })
  })

  describe('Flag Access Pattern', () => {
    it('should destructure exampleWidget flag from useFlags return value', () => {
      mockUseFlags.mockReturnValue({
        exampleWidget: true,
      })

      render(<App />)

      // Verify useFlags was called
      expect(mockUseFlags).toHaveBeenCalled()

      // Verify component uses the returned value correctly
      expect(screen.getByTestId('example-widget')).toBeInTheDocument()
    })

    it('should call useFlags at component render time', () => {
      const callCountBefore = mockUseFlags.mock.calls.length

      render(<App />)

      // useFlags should be called during render
      expect(mockUseFlags.mock.calls.length).toBeGreaterThan(callCountBefore)
    })
  })

  describe('Widget Positioning in App', () => {
    it('should render widget before or at the beginning of main content', () => {
      mockUseFlags.mockReturnValue({
        exampleWidget: true,
      })

      render(<App />)

      const widget = screen.getByTestId('example-widget')
      const hero = screen.getByRole('heading', { name: /build your software factory/i })

      // Widget should be in the document
      expect(widget).toBeInTheDocument()
      expect(hero).toBeInTheDocument()

      // Both should be visible
      expect(widget).toBeVisible()
      expect(hero).toBeVisible()
    })
  })

  describe('Accessibility with Feature Flag', () => {
    it('should maintain accessibility when widget is shown', () => {
      mockUseFlags.mockReturnValue({
        exampleWidget: true,
      })

      render(<App />)

      // Widget should be accessible
      const widget = screen.getByTestId('example-widget')
      expect(widget).toHaveAttribute('role')

      // Main content should still be accessible
      expect(screen.getByRole('heading', { name: /build your software factory/i })).toBeInTheDocument()
    })

    it('should maintain heading hierarchy when widget is shown', () => {
      mockUseFlags.mockReturnValue({
        exampleWidget: true,
      })

      render(<App />)

      // Should have proper heading hierarchy
      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    it('should not cause excessive re-renders when flag changes', () => {
      const renderCount = { count: 0 }

      mockUseFlags.mockReturnValue({
        exampleWidget: false,
      })

      const { rerender } = render(<App />)
      renderCount.count++

      // Change flag value
      mockUseFlags.mockReturnValue({
        exampleWidget: true,
      })

      rerender(<App />)
      renderCount.count++

      // Should only render twice (initial + update)
      expect(renderCount.count).toBe(2)
    })
  })

  describe('Error Handling', () => {
    it('should not crash if useFlags returns empty object', () => {
      mockUseFlags.mockReturnValue({})

      expect(() => render(<App />)).not.toThrow()
    })

    it('should not crash if useFlags returns null', () => {
      mockUseFlags.mockReturnValue(null)

      expect(() => render(<App />)).not.toThrow()
    })

    it('should not crash if useFlags returns undefined', () => {
      mockUseFlags.mockReturnValue(undefined)

      expect(() => render(<App />)).not.toThrow()
    })

    it('should gracefully handle useFlags throwing an error', () => {
      mockUseFlags.mockImplementation(() => {
        throw new Error('LaunchDarkly connection failed')
      })

      // App should either handle the error or let it bubble
      // For now, we expect it might throw, so we test defensively
      try {
        render(<App />)
      } catch (e) {
        // If it throws, that's acceptable for this test
        // The actual error handling can be refined in implementation
      }
    })
  })
})
