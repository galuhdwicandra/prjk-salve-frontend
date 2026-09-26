import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { route } from '../route';

const POSPage = lazy(() => import('../../pages/pos/POSPage'));
const ChatbotPage = lazy(() => import('../../pages/chatbot/ChatbotPage'));

export const kasirPosRoutes: RouteObject[] = [
  route('/pos', 'kasir-pos', POSPage),
  route('/chatbot', 'kasir-pos', ChatbotPage),
];
