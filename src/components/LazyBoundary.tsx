// src/components/LazyBoundary.tsx
import { Suspense, type ReactNode } from 'react';

export default function LazyBoundary({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="loading-inline" role="status" aria-live="polite">
          <span className="spinner" aria-hidden="true"></span>
          <span className="loading-text">Memuat…</span>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
