import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <h1 style={styles.title}>Shop Smarter,<br />Not Harder 🛍️</h1>
        <p style={styles.sub}>Discover the best products at unbeatable prices. Fast, simple, and smart.</p>
        <div style={styles.actions}>
          <button style={styles.primaryBtn} onClick={() => navigate('/products')}>Browse Products</button>
          <button style={styles.secondaryBtn} onClick={() => navigate('/login')}>Get Started</button>
        </div>
      </div>
      <div style={styles.features}>
        {[
          { icon: '🚀', title: 'Fast Delivery', desc: 'Get your orders delivered quickly' },
          { icon: '💰', title: 'Best Prices', desc: 'Competitive pricing on all products' },
          { icon: '🔒', title: 'Secure Checkout', desc: 'Your data is always safe with us' },
        ].map(f => (
          <div key={f.title} style={styles.featureCard}>
            <span style={styles.icon}>{f.icon}</span>
            <h3 style={styles.featureTitle}>{f.title}</h3>
            <p style={styles.featureDesc}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '90vh' },
  hero: { background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', color: '#fff', padding: '80px 32px', textAlign: 'center' },
  title: { fontSize: 48, fontWeight: 800, margin: '0 0 16px', lineHeight: 1.2 },
  sub: { fontSize: 18, color: '#aaa', margin: '0 0 36px', maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' },
  actions: { display: 'flex', gap: 16, justifyContent: 'center' },
  primaryBtn: { padding: '13px 32px', background: '#e94560', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, cursor: 'pointer', fontWeight: 600 },
  secondaryBtn: { padding: '13px 32px', background: 'transparent', color: '#fff', border: '2px solid #fff', borderRadius: 8, fontSize: 16, cursor: 'pointer' },
  features: { display: 'flex', justifyContent: 'center', gap: 24, padding: '60px 32px', flexWrap: 'wrap', background: '#f0f4f8' },
  featureCard: { background: '#fff', padding: '32px 28px', borderRadius: 12, textAlign: 'center', width: 220, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  icon: { fontSize: 36 },
  featureTitle: { margin: '12px 0 8px', color: '#1a1a2e', fontSize: 17 },
  featureDesc: { color: '#888', fontSize: 14, margin: 0 },
};
