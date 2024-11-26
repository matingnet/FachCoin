import React, { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Account from './pages/Account';
import Menu from './pages/Menu';
import Login from './pages/Login';
import CreateAccount from './pages/CreateAccount';
import axios from 'axios';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const checkAuthentication = async () => {
      if (token) {
        try {
          console.log("Checking authentication...");
          const response = await axios.post(
            'http://localhost:1235/wallet/api/v1/verifyLogin',
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          if (response.data.isAuthenticated) {
            localStorage.setItem('balance', response.data.balance);
            navigate('/account');
          } else {
            localStorage.removeItem('token');
            if (location.pathname == '/account') {
              navigate('/menu');
            }
          }
        } catch (error) {
          localStorage.removeItem('token');
          if (location.pathname == '/account') {
            navigate('/menu');
          }
        }
      } else {
        if (location.pathname == '/account') {
          navigate('/menu');
        }
      }
    };

    checkAuthentication();
  }, [token, location.pathname, navigate]);

  return (
    <Routes>
      <Route path="/menu" element={<Menu />} />
      <Route path="/account" element={<Account />} />
      <Route path="/createaccount" element={<CreateAccount />} />
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<Menu />} />
    </Routes>
  );
}

export default App;
