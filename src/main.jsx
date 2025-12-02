import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as Sentry from '@sentry/react'
import './index.css'
import App from './App.jsx'

// Initialize Sentry for error tracking
const sentryDsn = import.meta.env.VITE_SENTRY_DSN

// Validate DSN format
const isDsnValid = sentryDsn && sentryDsn.startsWith('https://') && sentryDsn.includes('@')

if (isDsnValid) {
  Sentry.init({
    dsn: sentryDsn,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,
    // Session Replay
    replaysSessionSampleRate: 0.1, // Sample 10% of sessions
    replaysOnErrorSampleRate: 1.0, // Always capture sessions with errors
    // Environment
    environment: import.meta.env.MODE, // 'development' or 'production'
    // Release tracking
    release: import.meta.env.VITE_SENTRY_RELEASE,
  })
} else if (sentryDsn) {
  console.error(
    'Invalid Sentry DSN format. Expected: https://[hash]@[org].ingest.sentry.io/[project-id]\n' +
    'Current value: ' + sentryDsn
  )
} else {
  console.warn(
    'Sentry DSN not configured. Error tracking is disabled.\n' +
    'To enable: Create .env file with VITE_SENTRY_DSN=your_dsn\n' +
    'See .env.example for details.'
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Sentry.ErrorBoundary
      fallback={
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Something went wrong</h1>
          <p>We've been notified and are working on a fix.</p>
          <button onClick={() => window.location.reload()}>Reload page</button>
        </div>
      }
      showDialog
    >
      <App />
    </Sentry.ErrorBoundary>
  </StrictMode>,
)
