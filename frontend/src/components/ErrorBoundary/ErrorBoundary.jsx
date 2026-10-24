import React from "react";
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInformation) {
    console.error("Application error:", error, errorInformation);
  }
  render() {
    if (this.state.hasError) {
      return (
        <main style={{ padding: "40px" }}>
          {" "}
          <h1>Something went wrong</h1>{" "}
          <p>Please refresh the page and try again.</p>{" "}
        </main>
      );
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
