import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './../styles/animation.css'

function Login() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [animationFinished, setAnimationFinished] = useState(false);

  // Trigger animation to finish after 3 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimationFinished(true); // Transition to normal text after animation
    }, 3000); // This matches the duration of the glitch effect
    return () => clearTimeout(timeout);
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:1235/wallet/api/v1/login', { password: password, publicKey: address });
      console.log(response.data);
      if (response.status === 200) {
        const { token, publicKey } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('address', publicKey);
        navigate('/account');
      } else {
        alert("login failed");
      }
    } catch (error) {
      alert("login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="text-center space-y-6 flex flex-col items-center">
        <h1
          className={`text-4xl font-bold text-green-500 mb-8 ${
            animationFinished ? 'normal-text' : 'glitch-text'
          }`}
          style={{ fontFamily: 'monospace' }}
        >
          Login to Your Wallet
        </h1>
        <div className="space-y-4 flex flex-col items-center">
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-52 py-3 px-4 bg-black text-green-500 border-2 border-white focus:outline-none focus:border-green-400"
            style={{ fontFamily: 'monospace' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-52 py-3 px-4 bg-black text-green-500 border-2 border-white focus:outline-none focus:border-green-400"
            style={{ fontFamily: 'monospace' }}
          />
        </div>
        <div className="flex space-x-4 mt-4">
          <button
            className="w-52 py-3 px-6 bg-black text-white text-lg font-semibold border-4 border-white hover:bg-green-500 transition duration-300 ease-in-out"
            onClick={handleLogin}
            style={{ fontFamily: 'monospace' }}
          >
            Login
          </button>
          <button
            className="w-52 py-3 px-6 bg-black text-white text-lg font-semibold border-4 border-white hover:bg-green-500 transition duration-300 ease-in-out"
            onClick={() => navigate('/menu')}
            style={{ fontFamily: 'monospace' }}
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
