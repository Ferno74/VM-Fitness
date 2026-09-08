import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.jsx';
import { Toaster } from 'react-hot-toast';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <div style={{color: 'red', background: 'black', padding: '20px', zIndex: 9999, position: 'relative'}}>
        <h1>React Crashed</h1>
        <pre>{this.state.error.toString()}</pre>
        <pre>{this.state.info?.componentStack}</pre>
      </div>;
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <App />
        <Toaster position="bottom-right" toastOptions={{
          style: { background: '#3F3F46', color: '#fff', border: '1px solid #2A2A2A' }
        }}/>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
