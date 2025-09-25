import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";
import styles from "./GlobalErrorBoundary.module.css";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("🚨 Global Error Caught:", {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorBoundary: "Global",
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.iconContainer}>
              <div className={styles.iconWrapper}>
                <svg
                  className={styles.icon}
                  viewBox="0 0 24 24"
                  role="img"
                  aria-label="Error icon"
                >
                  <title>Error icon</title>
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 14.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>

              <h1 className={styles.title}>Something went wrong</h1>

              <p className={styles.description}>
                We're sorry, but something unexpected happened. Please try
                reloading the page.
              </p>
            </div>

            <div className={styles.buttonGroup}>
              <button
                type="button"
                onClick={this.handleReload}
                className={styles.primaryButton}
              >
                Reload Page
              </button>

              <button
                type="button"
                onClick={() => window.history.back()}
                className={styles.secondaryButton}
              >
                Go Back
              </button>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <details className={styles.errorDetails}>
                <summary className={styles.summary}>
                  Error Details (Dev Mode)
                </summary>
                <pre className={styles.errorStack}>
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
