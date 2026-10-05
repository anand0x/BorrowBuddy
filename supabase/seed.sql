-- ==============================================================================
-- BorrowBuddy Supabase Seed Script
-- Realistic Indian College Essentials & Campus Items
-- ==============================================================================

-- 1. SEED CATEGORIES
INSERT INTO public.categories (id, name, icon, slug, description, item_count)
VALUES
  ('cat-books', 'Books', '📚', 'books', 'Curriculum textbooks, exam guides & reference material', 28),
  ('cat-calc', 'Calculators', '🧮', 'calculators', 'Scientific & graphing calculators for semester exams', 14),
  ('cat-lab', 'Lab Equipment', '🥼', 'lab-equipment', 'Lab coats, dissection kits & chemistry practical gear', 19),
  ('cat-draw', 'Engineering Drawing', '📐', 'engineering-drawing', 'Mini drafters, sheet holders, compass sets & roller scales', 12),
  ('cat-elec', 'Electronics', '💻', 'electronics', 'Arduinos, breadboards, digital multimeters & dev boards', 22),
  ('cat-essentials', 'College Essentials', '🎒', 'college-essentials', 'Laptop chargers, adaptors, scientific rulers & umbrellas', 16),
  ('cat-tools', 'Tools', '🛠️', 'tools', 'Soldering kits, screwdrivers & workshop utilities', 11),
  ('cat-others', 'Others', '📦', 'others', 'Sports equipment, presentation clickers & study accessories', 9)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description;

-- 2. SEED BUDDY CIRCLES
INSERT INTO public.buddy_circles (id, name, type, university, description, icon, members_count, item_count)
VALUES
  ('circle-1', 'Mechanical & Civil Drawing Hub', 'department', 'XYZ Institute of Technology', 'Students sharing mini-drafters, drawing boards, and engineering graphics gear.', '📐', 48, 12),
  ('circle-2', 'Computer Science Hardware & IoT Lab', 'class', 'XYZ Institute of Technology', 'Arduino kits, sensors, Raspberry Pis, and development boards for weekend projects.', '💻', 62, 19),
  ('circle-3', 'Hostel Block B Sharing Circle', 'hostel', 'XYZ Institute of Technology', 'Fast hostel borrowing for chargers, calculators, lab manuals, and tools.', '🏢', 35, 15),
  ('circle-4', 'Chemistry & Biotech Lab Essentials', 'friends', 'XYZ Institute of Technology', 'Clean cotton lab coats, dissection scissors, and safety goggles for practical vivas.', '🥼', 29, 8)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- 3. SEED INITIAL SAMPLE ITEMS
-- Note: When real users sign up, their user ID will link as owner_id.
-- For demo/seed demonstration, these provide realistic items if a demo profile is present.
DO $$
DECLARE
  demo_owner_id UUID;
BEGIN
  -- Look for an existing profile, or create a demo placeholder profile
  SELECT id INTO demo_owner_id FROM public.profiles LIMIT 1;
  
  IF demo_owner_id IS NOT NULL THEN
    INSERT INTO public.items (
      title,
      category_id,
      owner_id,
      description,
      condition,
      status,
      borrow_fee,
      deposit,
      estimated_retail_price,
      pickup_location,
      images,
      is_urgent_sos,
      circle_id
    ) VALUES
    (
      'Casio FX-991CW ClassWiz Scientific Calculator',
      'cat-calc',
      demo_owner_id,
      'Latest ClassWiz non-programmable university approved scientific calculator. High-res natural textbook display, perfect for semester engineering maths & physics exams. Works perfectly, please handle carefully.',
      'Excellent',
      'Available',
      0,
      100,
      1495,
      'Central Library',
      ARRAY['https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80'],
      true,
      'circle-1'
    ),
    (
      'Engineering Drawing Tool Kit with Mini Drafter & Sheet Holder',
      'cat-draw',
      demo_owner_id,
      'Complete drafting kit with unbreakable scale, 360-degree protractor head, stainless steel clamping screw, and waterproof sheet container cylinder. Perfect for 1st-year engineering graphics.',
      'Excellent',
      'Available',
      0,
      150,
      1850,
      'Department Block',
      ARRAY['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80'],
      false,
      'circle-1'
    ),
    (
      'Pure Cotton White Lab Coat (Unisex, Size M/L)',
      'cat-lab',
      demo_owner_id,
      '100% pure thick cotton lab coat with deep side pockets and reinforced button closures. Washed and sanitized, meets college chemistry and biology practical guidelines.',
      'Good',
      'Available',
      0,
      50,
      599,
      'Canteen',
      ARRAY['https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop&q=80'],
      true,
      'circle-4'
    ),
    (
      'Data Structures and Algorithms in C++ by Michael T. Goodrich',
      'cat-books',
      demo_owner_id,
      'Standard reference textbook for CS 2nd year. Covers trees, graphs, dynamic programming, and complexity proofs. Includes handwritten summary cheat-sheets on the back cover.',
      'Good',
      'Available',
      0,
      100,
      899,
      'Central Library',
      ARRAY['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'],
      false,
      'circle-2'
    ),
    (
      'Computer Networks by Andrew S. Tanenbaum (5th Edition)',
      'cat-books',
      demo_owner_id,
      'Comprehensive textbook covering OSI model, TCP/IP protocol suite, subnetting, and socket programming. Essential for CS/IT mid-terms.',
      'Good',
      'Available',
      0,
      120,
      750,
      'Central Library',
      ARRAY['https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=600&auto=format&fit=crop&q=80'],
      false,
      'circle-2'
    ),
    (
      'Digital Electronics Lab Manual & Gate IC Breadboard Set',
      'cat-elec',
      demo_owner_id,
      'Includes 7408 AND, 7432 OR, 7404 NOT, and 7400 NAND logic gate ICs with an 830-point solderless breadboard, jumper wire set, and LED indicators for practical lab verification.',
      'Excellent',
      'Available',
      0,
      150,
      1200,
      'Department Block',
      ARRAY['https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&auto=format&fit=crop&q=80'],
      true,
      'circle-2'
    ),
    (
      '25W Temperature Controlled Soldering Iron with Brass Tip & Stand',
      'cat-tools',
      demo_owner_id,
      'Reliable 25W heating iron with lead-free rosin core solder wire, desoldering pump, and wire stripper. Excellent for robotics, IoT mini-projects, and PCB fixes.',
      'Good',
      'Available',
      0,
      120,
      650,
      'Hostel Reception',
      ARRAY['https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80'],
      false,
      'circle-3'
    ),
    (
      'Arduino Uno R3 Microcontroller with Sensor Pack',
      'cat-elec',
      demo_owner_id,
      'Original ATmega328P Arduino Uno board with USB cable, ultrasonic distance sensor HC-SR04, servo motor SG90, and DHT11 temperature/humidity module. Great for quick semester projects.',
      'Excellent',
      'Available',
      40,
      250,
      1800,
      'Hostel Reception',
      ARRAY['https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&auto=format&fit=crop&q=80'],
      false,
      'circle-4'
    );
  END IF;
END $$;
