import React, { useState } from 'react';
import PropTypes from 'prop-types';
import config from '../config';

function Auth({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSignUp = async () => {
    try {
      const res = await fetch(`${config.apiBaseUrl}/user/signUp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        alert('Signup successful');
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      alert('An error occurred during sign-up: ' + error.message);
    }
  };

  const handleSignIn = async () => {
    try {
      const res = await fetch(`${config.apiBaseUrl}/user/signIn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        
        // Store the token in localStorage after successful login
        localStorage.setItem('token', data.token);
        console.log('Token saved to localStorage:', data.token);

        alert('Sign-in successful');
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Sign-in failed. Please check your credentials.');
      }
    } catch (error) {
      alert('An error occurred during sign-in: ' + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Stack Overflow</h1>
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsSignUp(false)}
            className={`px-4 py-2 rounded-l-lg ${!isSignUp ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            className={`px-4 py-2 rounded-r-lg ${isSignUp ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Sign Up
          </button>
        </div>
        <input
          type="email"
          placeholder="Email"
          className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="block w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {isSignUp ? (
          <button
            onClick={handleSignUp}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg mb-4 transition duration-300"
          >
            Sign Up
          </button>
        ) : (
          <button
            onClick={handleSignIn}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition duration-300"
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  );
}

Auth.propTypes = {
  setToken: PropTypes.func.isRequired,
};

export default Auth;