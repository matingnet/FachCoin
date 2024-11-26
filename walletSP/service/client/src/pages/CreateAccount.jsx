import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './../styles/animation.css'


function CreateAccount() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);

  // Trigger animation to finish after 3 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimationFinished(true); // Transition to normal text after animation
    }, 3000); // This matches the duration of the glitch effect
    return () => clearTimeout(timeout);
  }, []);

  const handleCreateAccount = async () => {
    if (!password) {
      alert("Password cannot be empty");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:1235/wallet/api/v1/createwallet', {
        "password": password
      }
      );


      if (response.status === 201) {
        const { token, publicKey } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('address', publicKey);
        navigate('/account');
      } else {
        alert("Account creation failed. Please try again.");
      }
    } catch (error) {
      console.error("Error creating account:", error);
      alert("An error occurred while creating the account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="text-center space-y-6">
        <h1
          className={`text-4xl font-bold text-green-500 mb-8 ${
            animationFinished ? 'normal-text' : 'glitch-text'
          }`}
          style={{ fontFamily: 'monospace' }}
        >          Create Your Account
        </h1>
        <div className="space-y-4">
          <input
            type="password"
            placeholder="Set a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-52 py-3 px-4 bg-black text-green-500 border-2 border-white focus:border-green-500 focus:outline-none"
            style={{ fontFamily: 'monospace' }}
          />
        </div>
        <div className="flex space-x-4">
          <button
            className={`w-52 py-3 px-6 bg-black text-white text-lg font-semibold border-4 border-white hover:bg-green-500 transition duration-300 ease-in-out mx-7 mt-7`}
            onClick={handleCreateAccount}
            disabled={!password || loading}
            style={{ fontFamily: 'monospace' }}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
          <button
            className={`w-52 py-3 px-6 bg-black text-white text-lg font-semibold border-4 border-white hover:bg-green-500 transition duration-300 ease-in-out mx-7 mt-7`}
            onClick={() => navigate('/')}
            style={{ fontFamily: 'monospace' }}
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>

  );
}

export default CreateAccount;
