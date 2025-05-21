'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const router = useRouter();

  const handleSignup = async () => {
    setError('');
  
    if (!email || !password || !confirm) {
      setError('All fields are required.');
      return;
    }
  
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
  
    try {
      const firebaseUser = await signup(email, password);
      const token = await firebaseUser.getIdToken();
  
      const res = await fetch('/api/user/data', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const profile = await res.json();
      console.log('User profile from MongoDB:', profile);
  
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Signup failed. Try a different email or stronger password.');
    }
  };

  return (
    <div className="signup-form">
      <h2>Sign Up</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirm Password"
        value={confirm}
        onChange={e => setConfirm(e.target.value)}
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
}
