import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";
import { AllOriginsProxyError } from "@/shared/errors/AllOriginsProxyError";
import {
  AuthenticationError,
  NetworkError,
  TimeoutError,
} from "@/shared/errors/types/api-errors";
import styles from "./ErrorBoundary.module.css";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorBoundary: "Page",
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  renderErrorMessage() {
    const { error } = this.state;

    if (!error) return null;

    // Handle authentication errors
    if (error instanceof AuthenticationError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className={`${styles.errorContainer} ${styles.networkError}`}
        >
          <h2 className={styles.errorTitle} tabIndex={-1}>
            Authentication Error
          </h2>
          <p className={styles.errorMessage}>
            API key issue occurred. Please check your authentication and try
            again.
          </p>
          <p className={styles.errorMessage}>
            {error.service}: {error.message.split(": ").slice(1).join(": ")}
          </p>
          <button
            type="button"
            onClick={this.handleRetry}
            className={styles.errorButton}
          >
            Try Again
          </button>
        </div>
      );
    }

    // Handle network errors
    if (error instanceof NetworkError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className={`${styles.errorContainer} ${styles.networkError}`}
        >
          <h2 className={styles.errorTitle} tabIndex={-1}>
            Connection Error
          </h2>
          <p className={styles.errorMessage}>
            Network issue occurred. Please check your internet connection and
            try again.
          </p>
          <button
            type="button"
            onClick={this.handleRetry}
            className={styles.errorButton}
          >
            Try Again
          </button>
        </div>
      );
    }

    // Handle timeout errors
    if (error instanceof TimeoutError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className={`${styles.errorContainer} ${styles.timeoutError}`}
        >
          <h2 className={styles.errorTitle} tabIndex={-1}>
            Request Timeout
          </h2>
          <p className={styles.errorMessage}>
            The request took too long to complete. Please try again in a moment.
          </p>
          <button
            type="button"
            onClick={this.handleRetry}
            className={styles.errorButton}
          >
            Try Again
          </button>
        </div>
      );
    }

    if (error instanceof AllOriginsProxyError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className={`${styles.errorContainer} ${styles.networkError}`}
        >
          <h2 className={styles.errorTitle} tabIndex={-1}>
            Connection Error
          </h2>
          <p className={styles.errorMessage}>
            Unable to fetch podcast data. Please check your internet connection
            and try again.
          </p>
          <button
            type="button"
            onClick={this.handleRetry}
            className={styles.errorButton}
          >
            Try Again
          </button>
        </div>
      );
    }

    if (error.message.includes("Network")) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className={`${styles.errorContainer} ${styles.networkError}`}
        >
          <h2 className={styles.errorTitle} tabIndex={-1}>
            Network Error
          </h2>
          <p className={styles.errorMessage}>
            Network issue occurred. Please check your internet connection and
            try again.
          </p>
          <button
            type="button"
            onClick={this.handleRetry}
            className={styles.errorButton}
          >
            Try Again
          </button>
        </div>
      );
    }

    if (
      error.message.includes("timeout") ||
      error.message.includes("Timeout")
    ) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className={`${styles.errorContainer} ${styles.timeoutError}`}
        >
          <h2 className={styles.errorTitle} tabIndex={-1}>
            Request Timeout
          </h2>
          <p className={styles.errorMessage}>
            The request took too long to complete. Please try again in a moment.
          </p>
          <button
            type="button"
            onClick={this.handleRetry}
            className={styles.errorButton}
          >
            Try Again
          </button>
        </div>
      );
    }

    return (
      <div
        role="alert"
        aria-live="assertive"
        className={`${styles.errorContainer} ${styles.genericError}`}
      >
        <h2 className={styles.errorTitle} tabIndex={-1}>
          Something went wrong
        </h2>
        <p className={styles.errorMessage}>
          An unexpected error occurred while loading this content. Please try
          again.
        </p>
        <button
          type="button"
          onClick={this.handleRetry}
          className={styles.errorButton}
        >
          Try Again
        </button>
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || this.renderErrorMessage();
    }

    return this.props.children;
  }
}
