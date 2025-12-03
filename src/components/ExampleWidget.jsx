import './ExampleWidget.css'

function ExampleWidget() {
  return (
    <div
      className="example-widget"
      data-testid="example-widget"
      role="banner"
      aria-label="Example widget demonstrating LaunchDarkly feature flag control"
      style={{
        width: '100%',
        display: 'block',
        padding: '16px',
        backgroundColor: '#4A90E2',
        color: 'white',
        textAlign: 'center',
        fontWeight: 600,
        fontSize: '16px',
        borderBottom: '3px solid #2E5C8A',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        overflowX: 'hidden',
        whiteSpace: 'normal'
      }}
    >
      🚀 This is an example feature controlled by a LaunchDarkly feature flag!
    </div>
  )
}

export default ExampleWidget
