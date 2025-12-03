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
