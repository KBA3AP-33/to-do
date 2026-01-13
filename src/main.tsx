import App from './App.tsx';
import { store } from '@src/store';
import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider } from './context/theme/index.tsx';

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
else createRoot(container).render(jsx);
