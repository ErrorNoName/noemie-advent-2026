import { Component, type ReactNode } from "react";

interface BoundaryProps {
  children: ReactNode;
}

interface BoundaryState {
  failed: boolean;
}

export class ErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { failed: false };

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="column grid min-h-dvh place-items-center px-6 text-center">
          <div>
            <p className="font-serif text-3xl italic">Un petit hoquet.</p>
            <p className="mt-2 text-mute">Recharge la page, le calendrier est toujours là.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
