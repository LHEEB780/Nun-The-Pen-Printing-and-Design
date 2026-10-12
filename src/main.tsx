import './i18n/index.ts';
import React, { Component, ErrorInfo, ReactNode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class RootErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('RootErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
          <div className="max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-2">نون والقلم للطباعة والتصميم</h2>
            <p className="text-sm text-slate-600 mb-6">
              حدث خطأ أثناء تحميل الواجهة، يرجى إعادة تحميل الصفحة.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors"
            >
              إعادة التحميل / Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <RootErrorBoundary>
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <App />
    </Suspense>
  </RootErrorBoundary>
);

