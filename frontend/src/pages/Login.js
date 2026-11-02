import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let error;

    if (isRegister) {
      ({ error } = await supabase.auth.signUp({ email, password }));
      if (!error) toast.success('Account created! You can now log in.');
    } else {
      ({ error } = await supabase.auth.signInWithPassword({ email, password }));
      if (!error) navigate('/products');
    }

    if (error) toast.error(error.message);
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
        <p style={styles.sub}>{isRegister ? 'Sign up to start shopping' : 'Login to your account'}</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input style={styles.input} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input style={styles.input} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
          </button>
        </form>
        <p style={styles.toggle}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span style={styles.link} onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Login' : 'Register'}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4f8' },
  card: { background: '#fff', padding: '40px 36px', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.1)', width: 360 },
  title: { margin: '0 0 4px', fontSize: 24, color: '#1a1a2e' },
  sub: { margin: '0 0 24px', color: '#888', fontSize: 14 },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  input: { padding: '10px 14px', borderRadius: 8, border: '1px solid #ddd', fontSize: 15, outline: 'none' },
  btn: { padding: '11px', background: '#e94560', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, cursor: 'pointer', fontWeight: 600 },
  toggle: { marginTop: 18, textAlign: 'center', fontSize: 14, color: '#555' },
  link: { color: '#e94560', cursor: 'pointer', fontWeight: 600 },
};
