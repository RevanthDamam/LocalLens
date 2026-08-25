/** Cartographic Editorial: a quiet field-guide fallback prevents a runtime issue from presenting visitors with a blank page. */
import { Component, type ErrorInfo, type ReactNode } from "react";
import { RefreshCw } from "lucide-react";

type Props = { children: ReactNode };
type State = { error: Error | null };

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("LocalLens render failure", error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return <main className="contour-surface grid min-h-screen place-items-center p-6"><section className="max-w-md border border-border bg-card p-7 shadow-elevated"><p className="atlas-label text-primary">Field guide unavailable</p><h1 className="mt-3 font-display text-4xl leading-none tracking-[-0.045em]">We could not load this page.</h1><p className="mt-4 text-sm leading-6 text-muted-foreground">Please refresh the page. If the problem continues, the LocalLens team can use the deployment logs to investigate it.</p><button onClick={() => window.location.reload()} className="mt-6 inline-flex items-center gap-2 bg-secondary px-4 py-3 text-sm font-extrabold text-secondary-foreground transition hover:bg-primary"><RefreshCw className="h-4 w-4" />Refresh LocalLens</button></section></main>;
  }
}
