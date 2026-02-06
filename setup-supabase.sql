-- MrMikes Database Setup for Supabase
-- Run this in Supabase SQL Editor (Database > SQL Editor)

-- Products table
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery table
CREATE TABLE gallery (
  id BIGSERIAL PRIMARY KEY,
  image TEXT NOT NULL,
  caption TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials table
CREATE TABLE testimonials (
  id BIGSERIAL PRIMARY KEY,
  author TEXT NOT NULL,
  location TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Page content table
CREATE TABLE page_content (
  page TEXT PRIMARY KEY,
  content JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default products
INSERT INTO products (id, title, description, image, sort_order) VALUES
  ('fiero', 'Fiero', 'Complete seat upholstery kits for all Fiero models', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400', 1),
  ('corvette', 'Corvette', 'Classic Corvette interior restoration kits', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400', 2),
  ('mg', 'MG', 'British classic car upholstery solutions', 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400', 3),
  ('triumph', 'Triumph - Miata', 'Miata seats customized for Triumph fitment', 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400', 4),
  ('kitcar', 'Kit-Car & Pantera', 'Fiero-based kit cars and exotic applications', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400', 5),
  ('ponycars', 'Vintage Mustang & Camaro', 'Classic American muscle car interiors', 'https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?w=400', 6),
  ('retro', 'Retro-Mods', 'Modern seats with vintage styling', 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=400', 7),
  ('trimbright', 'TrimBright Welt', 'Premium trim and welt accessories', 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=400', 8);

-- Insert default testimonials
INSERT INTO testimonials (author, location, content, rating) VALUES
  ('Steve', 'Mentone, Indiana', 'I received my upholstery kit on Friday and had them finished on Sunday. Worth every penny. Highest quality I could have imagined.', 5),
  ('Rick', 'TR6 Owner', 'The fit and finish exceeded my expectations. MrMikes made the entire process simple with clear instructions.', 5);

-- Insert default page content
INSERT INTO page_content (page, content) VALUES
  ('hero', '{"title": "Show Winning Upholstery Kits", "subtitle": "Ready to Install. Do-it-Right. Do-it-Yourself.", "description": "We craft premium upholstery kits for Fiero and Miata seats that fit perfectly in a wide variety of sports cars."}'),
  ('about', '{"title": "Why Choose MrMikes?", "description": "With over 30 years of experience, we have perfected the art of crafting upholstery kits that transform ordinary seats into show-winning masterpieces."}'),
  ('contact', '{"phone": "941-922-5070", "email": "mrmike@mrmikes.com", "hours": "Mon-Fri 10am-4pm Eastern"}');

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public read page_content" ON page_content FOR SELECT USING (true);

-- Authenticated write access
CREATE POLICY "Auth write products" ON products FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth write gallery" ON gallery FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth write testimonials" ON testimonials FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth write page_content" ON page_content FOR ALL TO authenticated USING (true);

-- Storage: Create a bucket called 'images' and make it public
-- Do this in the Supabase dashboard: Storage > New bucket > name: images > Public: ON
