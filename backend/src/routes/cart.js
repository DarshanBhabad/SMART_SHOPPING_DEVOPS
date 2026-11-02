const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// GET cart for a user
router.get('/:userId', async (req, res) => {
  const { data, error } = await supabase
    .from('cart')
    .select('*, products(*)')
    .eq('user_id', req.params.userId);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ADD item to cart
router.post('/', async (req, res) => {
  const { user_id, product_id, quantity } = req.body;
  const { data, error } = await supabase
    .from('cart')
    .upsert({ user_id, product_id, quantity }, { onConflict: 'user_id,product_id' })
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// REMOVE item from cart
router.delete('/:userId/:productId', async (req, res) => {
  const { error } = await supabase
    .from('cart')
    .delete()
    .eq('user_id', req.params.userId)
    .eq('product_id', req.params.productId);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Removed from cart' });
});

module.exports = router;
