'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const firebaseUser = await login(email, password);
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
      alert('Login failed');
      console.error(err);
    }
  };

  return (
    <div className="login-form">
      <h2>Log In</h2>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Log In</button>
    </div>
  );
}
