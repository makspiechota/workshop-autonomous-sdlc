import { useFlags } from 'launchdarkly-react-client-sdk'
import Hero from './components/Hero'
import Benefits from './components/Benefits'
import ContactForm from './components/ContactForm'
import ExampleWidget from './components/ExampleWidget'
import './App.css'

function App() {
  const flags = useFlags()
  // Handle both direct boolean and object with value property
  const exampleWidgetFlag = flags?.['example-widget']
  const exampleWidget = typeof exampleWidgetFlag === 'object' ? exampleWidgetFlag?.value : exampleWidgetFlag
  const triggerTestError = () => {
    throw new Error('Test error from Sentry integration - this is intentional!')
  }

  // Show test button in development or when ?test=true query param is present
  const showTestButton = import.meta.env.MODE === 'development' ||
    new URLSearchParams(window.location.search).get('test') === 'true'

  return (
    <div className="app">
      {exampleWidget && <ExampleWidget />}
      <Hero />
      <Benefits />
      <ContactForm />
    </div>
  )
}

export default App
