import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const API = process.env.REACT_APP_API_URL;

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API}/products`)
      .then(r => r.json())
      .then(data => { setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleAdd = (product) => {
    if (!user) { navigate('/login'); return; }
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  if (loading) return <div style={styles.center}>Loading products...</div>;

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>All Products</h2>
      <div style={styles.grid}>
        {products.map(p => (
          <div key={p.id} style={styles.card}>
            <img src={p.image_url || 'https://placehold.co/200x160?text=Product'} alt={p.name} style={styles.img} />
            <div style={styles.info}>
              <h3 style={styles.name}>{p.name}</h3>
              <p style={styles.desc}>{p.description}</p>
              <div style={styles.footer}>
                <span style={styles.price}>${p.price}</span>
                <button style={styles.btn} onClick={() => handleAdd(p)}>Add to Cart</button>
              </div>
            </div>
          </div>
        ))}
        {products.length === 0 && <p style={{ color: '#888' }}>No products found. Add some in Supabase!</p>}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '32px', maxWidth: 1100, margin: '0 auto' },
  heading: { fontSize: 26, color: '#1a1a2e', marginBottom: 24 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 },
  card: { background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden' },
  img: { width: '100%', height: 160, objectFit: 'cover' },
  info: { padding: 16 },
  name: { margin: '0 0 6px', fontSize: 16, color: '#1a1a2e' },
  desc: { margin: '0 0 12px', fontSize: 13, color: '#888', minHeight: 36 },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontWeight: 700, fontSize: 18, color: '#e94560' },
  btn: { background: '#1a1a2e', color: '#fff', border: 'none', padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13 },
  center: { textAlign: 'center', marginTop: 80, fontSize: 18, color: '#888' },
};
