-- Run this in your Supabase SQL Editor

-- Products table
create table products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric(10,2) not null,
  image_url text,
  created_at timestamp default now()
);

-- Cart table
create table cart (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  quantity int default 1,
  created_at timestamp default now(),
  unique(user_id, product_id)
);

-- Enable Row Level Security
alter table products enable row level security;
alter table cart enable row level security;

-- Products: anyone can read
create policy "Public read products" on products for select using (true);

-- Cart: users can only access their own cart
create policy "Users manage own cart" on cart
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Seed some sample products
insert into products (name, description, price, image_url) values
  ('Wireless Headphones', 'Premium sound quality with noise cancellation', 79.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'),
  ('Smart Watch', 'Track your fitness and stay connected', 149.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'),
  ('Running Shoes', 'Lightweight and comfortable for all terrains', 59.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'),
  ('Backpack', 'Durable 30L backpack for everyday use', 39.99, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'),
  ('Sunglasses', 'UV400 protection with polarized lenses', 29.99, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400'),
  ('Coffee Maker', 'Brew the perfect cup every morning', 49.99, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400');
