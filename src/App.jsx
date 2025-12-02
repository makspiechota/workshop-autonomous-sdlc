import Hero from './components/Hero'
import Benefits from './components/Benefits'
import ContactForm from './components/ContactForm'
import './App.css'

function App() {
  const triggerTestError = () => {
    throw new Error('Test error from Sentry integration - this is intentional!')
  }

  // Show test button in development or when ?test=true query param is present
  const showTestButton = import.meta.env.MODE === 'development' ||
    new URLSearchParams(window.location.search).get('test') === 'true'

  return (
    <div className="app">
      <Hero />
      <Benefits />
      <ContactForm />

      {/* Test button - shows in dev or with ?test=true query parameter */}
      {showTestButton && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}>
          <button
            onClick={triggerTestError}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🔥 Test Sentry Error
          </button>
        </div>
      )}
    </div>
  )
}

export default App
