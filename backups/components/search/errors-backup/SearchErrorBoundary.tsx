import React, { Component, ErrorInfo, ReactNode } from 'react';
import SearchFallback from './SearchFallback';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class SearchErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Search component error:', error);
    console.error('Component stack:', errorInfo.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return <SearchFallback />;
    }

    return this.props.children;
  }
}

export default SearchErrorBoundary;
