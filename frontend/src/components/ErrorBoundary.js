import React from 'react';
import { CCard, CCardBody, CCardHeader, CButton } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilWarning } from '@coreui/icons';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console (in production, you'd log to an error reporting service)
    console.error('Error caught by boundary:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
          <CCard className="w-100" style={{ maxWidth: '600px' }}>
            <CCardHeader className="text-center bg-danger text-white">
              <CIcon icon={cilWarning} size="xxl" className="me-2" />
              <strong>Something went wrong</strong>
            </CCardHeader>
            <CCardBody className="text-center p-4">
              <h4 className="text-danger mb-3">Oops! We encountered an error</h4>
              <p className="text-muted mb-4">
                Don't worry, this is usually a temporary issue. You can try reloading the page or going back to the home page.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-start mb-4">
                  <summary className="text-danger cursor-pointer">
                    <strong>Error Details (Development)</strong>
                  </summary>
                  <pre className="bg-light p-3 rounded mt-2" style={{ fontSize: '0.875rem' }}>
                    {this.state.error.toString()}
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
              
              <div className="d-flex gap-2 justify-content-center">
                <CButton 
                  color="primary" 
                  onClick={this.handleReload}
                  className="px-4"
                >
                  Reload Page
                </CButton>
                <CButton 
                  color="outline-secondary" 
                  onClick={this.handleGoHome}
                  className="px-4"
                >
                  Go Home
                </CButton>
              </div>
            </CCardBody>
          </CCard>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
