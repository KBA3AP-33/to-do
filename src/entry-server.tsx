import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { MainPage } from './pages/main';
import { HomeLayout } from './layouts/home';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import authReducer from '@src/store/auth/slice';
import { ThemeProvider } from './context/theme';

export async function render(url: string) {
  const store = configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        user: null,
        accessToken: null,
        refreshToken: null,
        isLoading: true,
        isLoadingApi: false,
        error: null,
      },
    },
  });

  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <StaticRouter location={url}>
        <ThemeProvider>
          <Provider store={store}>
            <HomeLayout>
              <MainPage />
            </HomeLayout>
          </Provider>
        </ThemeProvider>
      </StaticRouter>
    </React.StrictMode>
  );

  return {
    html,
    state: {
      auth: {
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      },
    },
  };
}

export default { render };
