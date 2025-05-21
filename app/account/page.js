'use client';
import { useState } from 'react';
import Login from '@/components/Login';
import Signup from '@/components/Signup';
import './account.css';

export default function AccountPage() {
  const [mode, setMode] = useState('login');

  return (
    <main className="account-page">
      <div className="auth-box">
        {mode === 'login' ? <Login /> : <Signup />}
        <p className="auth-toggle">
          {mode === 'login' ? (
            <>No account? <span onClick={() => setMode('signup')}>Sign up</span></>
          ) : (
            <>Already have an account? <span onClick={() => setMode('login')}>Log in</span></>
          )}
        </p>
      </div>
    </main>
  );
}