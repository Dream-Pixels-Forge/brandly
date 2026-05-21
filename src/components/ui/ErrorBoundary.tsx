import React from 'react';
import { Button } from './Button';

interface Props { children: React.ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container-max mx-auto px-6 py-24 flex flex-col items-center justify-center min-h-[50vh] text-center space-y-8">
          <div className="w-16 h-16 border-4 border-zinc-900 flex items-center justify-center">
            <span className="text-3xl font-black">!</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tighter uppercase">Rendering Error</h1>
            <p className="text-zinc-500 text-sm font-mono max-w-md">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
          </div>
          <Button onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}>
            Reload Application
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
