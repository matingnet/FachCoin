import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './../styles/animation.css'

function Menu() {
  const navigate = useNavigate();
  const [animationFinished, setAnimationFinished] = useState(false);

  // Trigger animation to finish after 3 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimationFinished(true); // Transition to normal text after animation
    }, 3000); // This matches the duration of the glitch effect
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="text-center space-y-6">
        <h1
          className={`text-4xl font-bold text-green-500 mb-8 ${
            animationFinished ? 'normal-text' : 'glitch-text'
          }`}
          style={{ fontFamily: 'monospace' }}
        >
          Welcome to the wallet
        </h1>
        <div className="space-y-4">
          <button
            className="w-52 py-3 px-6 bg-black text-white text-lg font-semibold border-4 border-white hover:bg-green-500 transition duration-300 ease-in-out mx-7"
            onClick={() => navigate('/createaccount')}
            style={{ fontFamily: 'monospace' }}
          >
            Create Account
          </button>
          <button
            className="w-52 py-3 px-6 bg-black text-white text-lg font-semibold border-4 border-white hover:bg-green-500 transition duration-300 ease-in-out mx-7"
            onClick={() => navigate('/login')}
            style={{ fontFamily: 'monospace' }}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Menu;
