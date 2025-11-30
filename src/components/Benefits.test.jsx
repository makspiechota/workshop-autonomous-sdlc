import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Benefits from './Benefits'

describe('Benefits', () => {
  it('renders the benefits section heading', () => {
    render(<Benefits />)
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
  })

  it('displays multiple benefit items', () => {
    render(<Benefits />)
    const benefits = screen.getAllByRole('article')
    expect(benefits.length).toBeGreaterThanOrEqual(3)
  })

  it('mentions speed or velocity benefit', () => {
    render(<Benefits />)
    expect(screen.getByText(/faster|speed|velocity|accelerate/i)).toBeInTheDocument()
  })

  it('mentions quality or consistency benefit', () => {
    render(<Benefits />)
    const text = screen.getByText(/systematic quality/i)
    expect(text).toBeInTheDocument()
  })

  it('mentions focus or productivity benefit', () => {
    render(<Benefits />)
    const text = screen.getByText(/strategic focus/i)
    expect(text).toBeInTheDocument()
  })
})
