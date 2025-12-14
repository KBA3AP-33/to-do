import { RouterProvider } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from './store';
import { useEffect } from 'react';
import { profile } from './store/auth/slice';
import { useRouter } from './hooks/use-router';
import './App.css';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  useEffect(() => {
    dispatch(profile());
  }, [dispatch]);

  return <RouterProvider router={router} />;
}

export default App;
