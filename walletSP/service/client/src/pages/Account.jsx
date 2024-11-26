import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './../styles/animation.css';

function AccountInformation() {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [animationFinished, setAnimationFinished] = useState(false);
  const navigate = useNavigate();

  // Trigger animation to finish after 3 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimationFinished(true); // Transition to normal text after animation
    }, 3000); // This matches the duration of the glitch effect
    return () => clearTimeout(timeout);
  }, []);

  const balance = 1000;

  const handleTransaction = async () => {
    if (!address || !amount) {
      alert("address and amount required ");
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:1235/wallet/api/v1/affectTransaction', {
        amount: amount,
        receiver: address
      },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        setAddress('');
        setAmount('');
        alert("transaction sent to the memPool.");
      } else {
        alert("transaction is not sent to the memPool.");
      }
    } catch (error) {
      alert("An error occurred while affecting the memPool.");
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
        >
          Wallet Information
        </h1>
        <div className="text-green-500" style={{ fontFamily: 'monospace' }}>
        <div className="text-green-500" style={{ fontFamily: 'monospace' }}>
          <p className="text-lg truncate max-w-md mx-auto">
            <span className="text-green-500">Address:  </span> 
            <span className="text-white">{localStorage.getItem('address') || "Log out and log in"}</span>
          </p>
          <p className="text-lg">
            <span className="text-green-500">Balance:  </span> 
            <span className="text-white">{localStorage.getItem('balance')} FCH</span>
          </p>
        </div>
        </div>
        {/* Align input fields and buttons */}
        <div className="flex flex-col space-y-4 items-center">
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
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-52 py-3 px-4 bg-black text-green-500 border-2 border-white focus:outline-none focus:border-green-400"
              style={{ fontFamily: 'monospace' }}
            />
          </div>

          <div className="flex space-x-4">
            <button
              className="w-52 py-3 px-6 bg-black text-white text-lg font-semibold border-4 border-white hover:bg-green-500 transition duration-300 ease-in-out"
              onClick={handleTransaction}
              style={{ fontFamily: 'monospace' }}
            >
              Affect Transaction
            </button>
            <button
              className="w-52 py-3 px-6 bg-black text-white text-lg font-semibold border-4 border-white hover:bg-green-500 transition duration-300 ease-in-out"
              onClick={() => {
                localStorage.removeItem('address');
                localStorage.removeItem('token');
                navigate('/');
              }}
              style={{ fontFamily: 'monospace' }}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountInformation;
