import type { ComponentType } from 'react';
import type { RouteObject } from 'react-router-dom';
import type { ModuleKey } from '../api/client';
import Guarded from './Guarded';
import LazyBoundary from '../components/LazyBoundary';

export function route(path: string, module: ModuleKey, Page: ComponentType): RouteObject {
  return {
    path,
    element: (
      <Guarded module={module}>
        <LazyBoundary>
          <Page />
        </LazyBoundary>
      </Guarded>
    ),
  };
}
