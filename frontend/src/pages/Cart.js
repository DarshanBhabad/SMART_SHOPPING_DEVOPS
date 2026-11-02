import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function Cart() {
  const { cart, removeFromCart, totalItems, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (cart.length === 0) return (
    <div style={styles.empty}>
      <h2>Your cart is empty 🛒</h2>
      <button style={styles.shopBtn} onClick={() => navigate('/products')}>Browse Products</button>
    </div>
  );

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Your Cart ({totalItems} items)</h2>
      <div style={styles.layout}>
        <div style={styles.items}>
          {cart.map(item => (
            <div key={item.id} style={styles.card}>
              <img src={item.image_url || 'https://placehold.co/80x80?text=P'} alt={item.name} style={styles.img} />
              <div style={styles.info}>
                <h3 style={styles.name}>{item.name}</h3>
                <p style={styles.qty}>Qty: {item.qty}</p>
              </div>
              <div style={styles.right}>
                <span style={styles.price}>${(item.price * item.qty).toFixed(2)}</span>
                <button style={styles.removeBtn} onClick={() => { removeFromCart(item.id); toast.success('Removed from cart'); }}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        <div style={styles.summary}>
          <h3 style={styles.summaryTitle}>Order Summary</h3>
          <div style={styles.row}><span>Items</span><span>{totalItems}</span></div>
          <div style={styles.row}><span>Total</span><strong style={{ color: '#e94560' }}>${totalPrice.toFixed(2)}</strong></div>
          <button style={styles.checkoutBtn} onClick={() => toast.success('Checkout coming soon!')}>Checkout</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '32px', maxWidth: 1000, margin: '0 auto' },
  heading: { fontSize: 24, color: '#1a1a2e', marginBottom: 24 },
  layout: { display: 'flex', gap: 24, flexWrap: 'wrap' },
  items: { flex: 1, display: 'flex', flexDirection: 'column', gap: 16 },
  card: { display: 'flex', alignItems: 'center', gap: 16, background: '#fff', padding: 16, borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.07)' },
  img: { width: 80, height: 80, objectFit: 'cover', borderRadius: 8 },
  info: { flex: 1 },
  name: { margin: '0 0 4px', fontSize: 16, color: '#1a1a2e' },
  qty: { margin: 0, color: '#888', fontSize: 13 },
  right: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 },
  price: { fontWeight: 700, fontSize: 17, color: '#1a1a2e' },
  removeBtn: { background: 'none', border: '1px solid #e94560', color: '#e94560', padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12 },
  summary: { width: 260, background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.07)', height: 'fit-content' },
  summaryTitle: { margin: '0 0 16px', fontSize: 18, color: '#1a1a2e' },
  row: { display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 15 },
  checkoutBtn: { width: '100%', padding: 12, background: '#e94560', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, cursor: 'pointer', fontWeight: 600, marginTop: 8 },
  empty: { textAlign: 'center', marginTop: 100 },
  shopBtn: { marginTop: 16, padding: '10px 24px', background: '#e94560', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 15 },
};
