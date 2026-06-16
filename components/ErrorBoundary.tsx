"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[toolhub] workspace error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="flex flex-col items-center justify-center min-h-[320px] border border-line bg-bg-1 gap-4 text-center px-6">
          <div className="font-mono text-[32px] text-hot leading-none">ERR</div>
          <p className="font-mono text-[13px] text-dim max-w-[40ch]">
            {this.state.message || "This workspace crashed unexpectedly."}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, message: "" })}
            className="px-[14px] py-[7px] border border-line-2 bg-bg font-mono text-[12px] text-fg-1 rounded-[3px] hover:border-brand-mid hover:text-fg transition-colors"
          >
            try again ↺
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
