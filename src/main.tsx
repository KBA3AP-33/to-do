import App from './App.tsx';
import { store } from '@src/store';
import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider } from './context/theme/index.tsx';

// async function enableMocking() {
//   if (import.meta.env.MODE !== 'development') return;
//   if (import.meta.env.VITE_USE_MOCK_API === 'false') return;

//   const { worker } = await import('./mocks/browser');
//   return worker.start({
//     onUnhandledRequest: 'bypass',
//   });
// }

const container = document.getElementById('root')!;

const jsx = (
  <StrictMode>
    <ThemeProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </ThemeProvider>
  </StrictMode>
);

if (container.innerHTML !== '') hydrateRoot(container, jsx);
// else enableMocking().then(() => createRoot(container).render(jsx));
else createRoot(container).render(jsx);
