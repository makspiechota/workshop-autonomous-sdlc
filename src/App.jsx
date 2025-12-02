import Hero from './components/Hero'
import Benefits from './components/Benefits'
import ContactForm from './components/ContactForm'
import './App.css'

function App() {
  const triggerTestError = () => {
    throw new Error('Test error from Sentry integration - this is intentional!')
  }

  return (
    <div className="app">
      <Hero />
      <Benefits />
      <ContactForm />

      {/* Temporary test button - remove after verification */}
      {import.meta.env.MODE === 'development' && (
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
