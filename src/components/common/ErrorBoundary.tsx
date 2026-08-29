import { Component, ErrorInfo, ReactNode } from "react";
import { DICTIONARIES } from "@/locales/dictionaries";
import { SupportedLanguage } from "@/types";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught React Error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private getTranslation() {
    try {
      const stored = localStorage.getItem("node_cleaner_language") as SupportedLanguage;
      if (stored && DICTIONARIES[stored]) {
        return DICTIONARIES[stored].errorBoundary;
      }
    } catch {}
    return DICTIONARIES["tr"].errorBoundary;
  }

  public render() {
    if (this.state.hasError) {
      const t = this.getTranslation();
      return (
        <div style={{
          padding: "32px",
          color: "#fff",
          background: "#16161a",
          minHeight: "100vh",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <div style={{
            maxWidth: "600px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "16px",
            padding: "28px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
          }}>
            <h2 style={{ color: "#E5484D", marginBottom: "12px", fontSize: "20px" }}>
              {t.title}
            </h2>
            <p style={{ color: "#A4A4AA", fontSize: "14px", marginBottom: "16px" }}>
              {this.state.error?.message || t.unknownError}
            </p>
            <pre style={{
              background: "rgba(0,0,0,0.5)",
              padding: "12px",
              borderRadius: "8px",
              fontSize: "12px",
              overflowX: "auto",
              color: "#f5a623",
              maxHeight: "200px"
            }}>
              {this.state.error?.stack}
            </pre>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                background: "#0A84FF",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 600
              }}
            >
              {t.reload}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
