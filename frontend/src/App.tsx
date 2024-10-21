import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useAppDispatch, useAppSelector } from './hooks/useAuth';
import { Provider } from 'react-redux';
import store from './store/store';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import HomeLayout from './layouts/HomeLayout';
import Header from './components/header/Header';
import { setUser } from './store/authSlice';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; // Import styles  

// Create a QueryClient for React Query
const queryClient = new QueryClient();

function App() {
  const dispatch = useAppDispatch();
  const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const userLocalStorage = JSON.parse(userString);
        // Set the user state in Redux from localStorage
        dispatch(setUser(userLocalStorage.email));
      } catch (error) {
        console.error('Error parsing user data from localStorage', error);
      }
    }
  const user = useAppSelector((state) => state.auth.user);
  // useEffect(() => {
  //   // Check localStorage for a user on initial load
  //   const userString = localStorage.getItem('user');
  //   if (userString) {
  //     try {
  //       const userLocalStorage = JSON.parse(userString);
  //       // Set the user state in Redux from localStorage
  //       dispatch(setUser(userLocalStorage.email));
  //     } catch (error) {
  //       console.error('Error parsing user data from localStorage', error);
  //     }
  //   }
  // }, [dispatch]);

  console.log("user-Auth-state", user);

  return (
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
        <Router>
          <div className="App">
          <ToastContainer />
            {user && <Header />}
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/home"
                element={user ? <HomeLayout /> : <Navigate to="/login" />}
              />
              <Route path="*" element={<Navigate to={user ? '/home' : '/login'} />}
              />
            </Routes>
          </div>
        </Router>
        </Provider>
      </QueryClientProvider>
  );
}

export default App;