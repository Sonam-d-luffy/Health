import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Bg from '../Components/Bg';

const PlayerOTP = () => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const location = useLocation();
  const { playerId } = location.state || {}; // playerId passed from signup/login redirect
  const navigate = useNavigate();

  // Handle OTP Verification
  const handleOTPVerification = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!playerId) {
      setMessage('No player ID found, please sign in first.');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/verify/verify-email-player`, {
        playerId,
        otp,
      });

      if (res.data.success) {
        setMessage(res.data.message || 'OTP verification complete.');
        setTimeout(() => navigate('/playerLogin'), 1500);
        alert('Email verified successfully! Please log in.');
      } else {
        setMessage('Wrong OTP.');
      }
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || 'Error verifying OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Resend OTP
  const handleResendOTP = async () => {
    setResendLoading(true);
    if (!playerId) {
      setMessage('No player ID found, please sign in first.');
      setResendLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/verify/resend-otp-player`, {
        playerId,
      });
      setMessage(`New OTP sent: ${res.data.otp}`); // show for testing (remove in prod)
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || 'Error resending OTP.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Bg>
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Player OTP Verification</h2>
      <p>Enter the OTP sent to your registered email</p>

      <form onSubmit={handleOTPVerification}>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          placeholder="Enter 6-digit OTP"
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <button type="submit" disabled={loading || otp.length !== 6}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>

      <div style={{ marginTop: '15px' }}>
        <button onClick={handleResendOTP} disabled={resendLoading}>
          {resendLoading ? 'Resending...' : 'Resend OTP'}
        </button>
      </div>

      {message && (
        <p
          style={{
            marginTop: '10px',
            color:
              message.includes('complete') || message.includes('sent')
                ? 'green'
                : 'red',
          }}
        >
          {message}
        </p>
      )}

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => navigate('/playerLogin')}>Back to Login</button>
      </div>
    </div>
    </Bg>
  );
};

export default PlayerOTP;
