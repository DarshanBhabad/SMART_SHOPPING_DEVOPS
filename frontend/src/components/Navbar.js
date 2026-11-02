import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>🛒 SmartShopping</Link>
      <div style={styles.links}>
        <Link to="/products" style={styles.link}>Products</Link>
        <Link to="/cart" style={styles.link}>Cart {totalItems > 0 && <span style={styles.badge}>{totalItems}</span>}</Link>
        {user ? (
          <>
            <span style={styles.email}>{user.email}</span>
            <button onClick={handleSignOut} style={styles.btn}>Logout</button>
          </>
        ) : (
          <Link to="/login" style={styles.link}>Login</Link>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 32px', background: '#1a1a2e', color: '#fff' },
  brand: { color: '#e94560', fontWeight: 700, fontSize: 22, textDecoration: 'none' },
  links: { display: 'flex', alignItems: 'center', gap: 20 },
  link: { color: '#fff', textDecoration: 'none', fontSize: 15 },
  email: { color: '#aaa', fontSize: 13 },
  btn: { background: '#e94560', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: 6, cursor: 'pointer' },
  badge: { background: '#e94560', color: '#fff', borderRadius: '50%', padding: '2px 7px', fontSize: 11, marginLeft: 4 },
};
