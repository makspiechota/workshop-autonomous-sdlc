import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  let originalLocation

  beforeEach(() => {
    // Save original location
    originalLocation = window.location
  })

  afterEach(() => {
    // Restore original location
    if (originalLocation) {
      Object.defineProperty(window, 'location', {
        value: originalLocation,
        writable: true,
        configurable: true
      })
    }
  })

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

  describe('Test Error Button Removal', () => {
    it('should NOT render the test error button in production mode', () => {
      // Mock production mode by setting location without ?test=true
      delete window.location
      window.location = { search: '' }

      render(<App />)

      // The test button should NOT be present
      const testButton = screen.queryByText(/test sentry error/i)
      expect(testButton).not.toBeInTheDocument()
    })

    it('should NOT render the test error button even with ?test=true query parameter', () => {
      // Mock location with ?test=true query parameter
      delete window.location
      window.location = { search: '?test=true' }

      render(<App />)

      // The test button should NOT be present even with query param
      const testButton = screen.queryByText(/test sentry error/i)
      expect(testButton).not.toBeInTheDocument()
    })

    it('should NOT have a triggerTestError function in the component', () => {
      // Read the App component source to verify no triggerTestError function exists
      const appSource = App.toString()
      expect(appSource).not.toContain('triggerTestError')
    })

    it('should render without throwing any errors', () => {
      // This test ensures the component doesn't throw errors during render
      expect(() => {
        render(<App />)
      }).not.toThrow()
    })

    it('should NOT contain Sentry test button related styles', () => {
      render(<App />)

      // Check that no button with the specific test button styles exists
      const buttons = screen.queryAllByRole('button')

      buttons.forEach(button => {
        const styles = window.getComputedStyle(button)
        // The test button had backgroundColor: '#ff4444'
        // It should not exist anymore
        if (button.textContent.includes('Test') || button.textContent.includes('Sentry')) {
          expect(button).not.toBeInTheDocument()
        }
      })
    })

    it('should NOT have any fixed position buttons in bottom-right corner', () => {
      const { container } = render(<App />)

      // Look for any divs with position: fixed in bottom-right
      const fixedElements = container.querySelectorAll('[style*="position: fixed"]')

      fixedElements.forEach(element => {
        const style = element.getAttribute('style') || ''
        // The test button had bottom: 20px, right: 20px, zIndex: 9999
        if (style.includes('bottom') && style.includes('right') && style.includes('9999')) {
          expect(element).not.toBeInTheDocument()
        }
      })
    })
  })
})
