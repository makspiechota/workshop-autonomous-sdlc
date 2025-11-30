# Story 000001: Software Factory Landing Page

**Created:** 2025-11-30
**Status:** Planning
**Priority:** P0

## User Story

As a potential client or training participant
I want to learn about the Software Factory concept and autonomous SDLC
So that I can understand the value proposition and get in touch if interested

## Background

This is the first public-facing website for the Software Factory vision. The primary goal is lead generation - we want to capture contact information from interested engineering leaders, CTOs, and aspirational engineers who want to learn more about autonomous SDLC.

The website will serve as:
- Entry point for corporate training leads (ICP #2)
- Lead generation for consulting services (ICP #1)
- Demonstration of the autonomous SDLC in action (meta - the site itself is built using the methodology it promotes)

## Requirements

### Functional Requirements
1. Hero section with compelling value proposition about Software Factory
2. Benefits/ROI section explaining why teams should adopt this approach
3. Contact form with name, email, and interest description fields
4. Form submission sends email notification to trainer
5. Responsive design that works on mobile and desktop
6. Fast loading and good performance

### Technical Requirements
1. Built using React + Vite (existing stack)
2. Form submission via email service (Formspree or EmailJS)
3. Follows existing test-driven development patterns
4. Deployable via existing GitHub Actions workflow
5. Accessible (WCAG AA compliance)
6. SEO-friendly (meta tags, semantic HTML)

## Acceptance Criteria

- [ ] Hero section displays clear value proposition about Software Factory
- [ ] Benefits section explains ROI and key advantages
- [ ] Contact form collects name, email, and interest/goal description
- [ ] Form validation prevents submission of invalid data
- [ ] Successful form submission shows confirmation message
- [ ] Form submissions are sent to trainer's email
- [ ] Website is responsive on mobile, tablet, and desktop
- [ ] All components have test coverage
- [ ] CI/CD pipeline passes all tests
- [ ] Site is deployed to GitHub Pages
- [ ] Page loads in under 3 seconds

## Files Affected

- `src/App.jsx` - Replace default Vite template with landing page layout
- `src/components/Hero.jsx` - NEW: Hero section component
- `src/components/Benefits.jsx` - NEW: Benefits/ROI section component
- `src/components/ContactForm.jsx` - NEW: Contact form component
- `src/components/Hero.test.jsx` - NEW: Hero component tests
- `src/components/Benefits.test.jsx` - NEW: Benefits component tests
- `src/components/ContactForm.test.jsx` - NEW: Contact form tests
- `src/App.test.jsx` - Update tests for new layout
- `package.json` - Add form submission library (Formspree/EmailJS)
- `index.html` - Update meta tags for SEO
- `README.md` - Update project description

## Dependencies

- Email service for form submissions (Formspree free tier or EmailJS)
- No dependencies on other stories

## Notes

- This website itself demonstrates the autonomous SDLC methodology
- Keep design simple and focused on conversion
- Consider A/B testing different headlines later
- Form should have low friction (minimal required fields)
- Privacy consideration: Add note about data handling
