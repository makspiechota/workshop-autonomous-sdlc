import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByText(/Vite \+ React/i)).toBeInTheDocument()
  })

  it('has working counter button', () => {
    render(<App />)
    const button = screen.getByRole('button', { name: /count is/i })
    expect(button).toBeInTheDocument()
  })
})
