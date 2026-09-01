-- FNN Earth-42 demo seed — VIT Chennai campus
-- Run AFTER schema.sql in the Supabase SQL Editor.
-- Safe to re-run: inserts use fixed UUIDs and ON CONFLICT DO NOTHING.
--
-- Profiles reference auth.users. Demo auth rows are placeholders so
-- foreign keys work. They are not application passwords (profiles has
-- no password column). Do not use these emails in production.

-- VIT Chennai (Vandalur–Kelambakkam Road) ~ 12.8406 N, 80.1530 E

-- ---------------------------------------------------------------------------
-- Demo auth users (required before profiles)
-- ---------------------------------------------------------------------------

INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
VALUES
  (
    'a0000000-0000-4000-8000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'campus.admin@vitchennai.demo',
    crypt(encode(gen_random_bytes(32), 'hex'), gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"pseudonym":"VITControl"}'::jsonb,
    false,
    '',
    '',
    '',
    ''
  ),
  (
    'a0000000-0000-4000-8000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'karthik.student@vitchennai.demo',
    crypt(encode(gen_random_bytes(32), 'hex'), gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"pseudonym":"BlueJay21"}'::jsonb,
    false,
    '',
    '',
    '',
    ''
  ),
  (
    'a0000000-0000-4000-8000-000000000003',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'ananya.student@vitchennai.demo',
    crypt(encode(gen_random_bytes(32), 'hex'), gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"pseudonym":"MapleLeaf"}'::jsonb,
    false,
    '',
    '',
    '',
    ''
  ),
  (
    'a0000000-0000-4000-8000-000000000004',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'rahul.hero@vitchennai.demo',
    crypt(encode(gen_random_bytes(32), 'hex'), gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"pseudonym":"FirstAidRahul"}'::jsonb,
    false,
    '',
    '',
    '',
    ''
  ),
  (
    'a0000000-0000-4000-8000-000000000005',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'meera.hero@vitchennai.demo',
    crypt(encode(gen_random_bytes(32), 'hex'), gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"pseudonym":"CampusWatch"}'::jsonb,
    false,
    '',
    '',
    '',
    ''
  )
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------

INSERT INTO profiles (id, pseudonym, email, role, reputation)
VALUES
  ('a0000000-0000-4000-8000-000000000001', 'VITControl', 'campus.admin@vitchennai.demo', 'ADMIN', 50),
  ('a0000000-0000-4000-8000-000000000002', 'BlueJay21', 'karthik.student@vitchennai.demo', 'STUDENT', 8),
  ('a0000000-0000-4000-8000-000000000003', 'MapleLeaf', 'ananya.student@vitchennai.demo', 'STUDENT', 6),
  ('a0000000-0000-4000-8000-000000000004', 'FirstAidRahul', 'rahul.hero@vitchennai.demo', 'HERO', 22),
  ('a0000000-0000-4000-8000-000000000005', 'CampusWatch', 'meera.hero@vitchennai.demo', 'HERO', 18)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- wallets (starting balances; none negative)
-- ---------------------------------------------------------------------------

INSERT INTO credit_wallets (user_id, available_credits, locked_credits)
VALUES
  ('a0000000-0000-4000-8000-000000000001', 500.00, 0.00),
  ('a0000000-0000-4000-8000-000000000002', 40.00, 10.00),
  ('a0000000-0000-4000-8000-000000000003', 55.00, 0.00),
  ('a0000000-0000-4000-8000-000000000004', 80.00, 0.00),
  ('a0000000-0000-4000-8000-000000000005', 75.00, 0.00)
ON CONFLICT (user_id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- heroes (one row per hero user)
-- ---------------------------------------------------------------------------

INSERT INTO heroes (id, user_id, skills, latitude, longitude, availability, reputation)
VALUES
  (
    'b0000000-0000-4000-8000-000000000001',
    'a0000000-0000-4000-8000-000000000004',
    ARRAY['first-aid', 'cpr', 'crowd-control'],
    12.84105,
    80.15355,
    true,
    22
  ),
  (
    'b0000000-0000-4000-8000-000000000002',
    'a0000000-0000-4000-8000-000000000005',
    ARRAY['patrol', 'fire-safety', 'evacuation'],
    12.84015,
    80.15240,
    true,
    18
  )
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- public services near VIT Chennai
-- ---------------------------------------------------------------------------

INSERT INTO services (id, name, category, phone, website)
VALUES
  (
    'c0000000-0000-4000-8000-000000000001',
    'VIT Chennai Health Centre',
    'MEDICAL',
    '044-3993-1555',
    'https://chennai.vit.ac.in'
  ),
  (
    'c0000000-0000-4000-8000-000000000002',
    'VIT Chennai Campus Security',
    'PERSONAL_SAFETY',
    '044-3993-1000',
    'https://chennai.vit.ac.in'
  ),
  (
    'c0000000-0000-4000-8000-000000000003',
    'Kelambakkam Police Station',
    'PERSONAL_SAFETY',
    '044-2747-4426',
    'https://eservices.tnpolice.gov.in'
  ),
  (
    'c0000000-0000-4000-8000-000000000004',
    'Chettinad Hospital (Kelambakkam)',
    'MEDICAL',
    '044-4741-1000',
    'https://www.chettinadhealthcity.com'
  ),
  (
    'c0000000-0000-4000-8000-000000000005',
    'Tamil Nadu Fire and Rescue — Kelambakkam',
    'FIRE',
    '101',
    'https://www.tnfrs.tn.gov.in'
  )
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- signals around campus (distinct events)
-- ---------------------------------------------------------------------------

INSERT INTO signals (
  id,
  reporter_id,
  description,
  category,
  severity,
  urgency,
  confidence,
  latitude,
  longitude,
  status,
  upvotes,
  downvotes,
  created_at
)
VALUES
  (
    'd0000000-0000-4000-8000-000000000001',
    'a0000000-0000-4000-8000-000000000002',
    'Student feeling faint near Academic Block 1 corridor, needs first aid.',
    'MEDICAL',
    'HIGH',
    'IMMEDIATE',
    0.860,
    12.84120,
    80.15410,
    'ASSIGNED',
    2,
    0,
    now() - interval '25 minutes'
  ),
  (
    'd0000000-0000-4000-8000-000000000002',
    'a0000000-0000-4000-8000-000000000003',
    'VIT ID card found near the food court seating area.',
    'LOST_ITEM',
    'LOW',
    'NORMAL',
    0.720,
    12.84090,
    80.15255,
    'VERIFIED',
    1,
    0,
    now() - interval '2 hours'
  ),
  (
    'd0000000-0000-4000-8000-000000000003',
    'a0000000-0000-4000-8000-000000000002',
    'Water leak on the walkway between the hostel gate and the main academic plaza.',
    'INFRASTRUCTURE',
    'MEDIUM',
    'SOON',
    0.640,
    12.83980,
    80.15190,
    'OPEN',
    1,
    0,
    now() - interval '50 minutes'
  ),
  (
    'd0000000-0000-4000-8000-000000000004',
    'a0000000-0000-4000-8000-000000000003',
    'Burning smell from an outdoor electrical box near the main entrance road.',
    'FIRE',
    'CRITICAL',
    'IMMEDIATE',
    0.910,
    12.84050,
    80.15300,
    'ESCALATED',
    3,
    0,
    now() - interval '12 minutes'
  )
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- media (one proof object per distinct upload)
-- ---------------------------------------------------------------------------

INSERT INTO signal_media (id, signal_id, uploader_id, url)
VALUES
  (
    'e0000000-0000-4000-8000-000000000001',
    'd0000000-0000-4000-8000-000000000001',
    'a0000000-0000-4000-8000-000000000002',
    'https://example.invalid/vit-chennai/medical-ab1.jpg'
  ),
  (
    'e0000000-0000-4000-8000-000000000002',
    'd0000000-0000-4000-8000-000000000002',
    'a0000000-0000-4000-8000-000000000003',
    'https://example.invalid/vit-chennai/id-card-foodcourt.jpg'
  ),
  (
    'e0000000-0000-4000-8000-000000000003',
    'd0000000-0000-4000-8000-000000000004',
    'a0000000-0000-4000-8000-000000000003',
    'https://example.invalid/vit-chennai/electrical-box.jpg'
  ),
  (
    'e0000000-0000-4000-8000-000000000004',
    'd0000000-0000-4000-8000-000000000004',
    'a0000000-0000-4000-8000-000000000005',
    'https://example.invalid/vit-chennai/electrical-box-hero-proof.jpg'
  )
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- votes (unique per signal + user)
-- ---------------------------------------------------------------------------

INSERT INTO signal_votes (id, signal_id, user_id, vote, proof_media_id)
VALUES
  (
    'f0000000-0000-4000-8000-000000000001',
    'd0000000-0000-4000-8000-000000000001',
    'a0000000-0000-4000-8000-000000000003',
    'UP',
    'e0000000-0000-4000-8000-000000000001'
  ),
  (
    'f0000000-0000-4000-8000-000000000002',
    'd0000000-0000-4000-8000-000000000001',
    'a0000000-0000-4000-8000-000000000005',
    'UP',
    'e0000000-0000-4000-8000-000000000001'
  ),
  (
    'f0000000-0000-4000-8000-000000000003',
    'd0000000-0000-4000-8000-000000000002',
    'a0000000-0000-4000-8000-000000000002',
    'UP',
    'e0000000-0000-4000-8000-000000000002'
  ),
  (
    'f0000000-0000-4000-8000-000000000004',
    'd0000000-0000-4000-8000-000000000003',
    'a0000000-0000-4000-8000-000000000003',
    'UP',
    NULL
  ),
  (
    'f0000000-0000-4000-8000-000000000005',
    'd0000000-0000-4000-8000-000000000004',
    'a0000000-0000-4000-8000-000000000002',
    'UP',
    'e0000000-0000-4000-8000-000000000003'
  ),
  (
    'f0000000-0000-4000-8000-000000000006',
    'd0000000-0000-4000-8000-000000000004',
    'a0000000-0000-4000-8000-000000000004',
    'UP',
    'e0000000-0000-4000-8000-000000000003'
  ),
  (
    'f0000000-0000-4000-8000-000000000007',
    'd0000000-0000-4000-8000-000000000004',
    'a0000000-0000-4000-8000-000000000005',
    'UP',
    'e0000000-0000-4000-8000-000000000004'
  )
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- hero tasks
-- ---------------------------------------------------------------------------

INSERT INTO tasks (id, signal_id, hero_id, status)
VALUES
  (
    'aa000000-0000-4000-8000-000000000001',
    'd0000000-0000-4000-8000-000000000001',
    'b0000000-0000-4000-8000-000000000001',
    'RESPONDING'
  ),
  (
    'aa000000-0000-4000-8000-000000000002',
    'd0000000-0000-4000-8000-000000000004',
    'b0000000-0000-4000-8000-000000000002',
    'ACCEPTED'
  )
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- credit ledger (immutable after insert)
-- ---------------------------------------------------------------------------

INSERT INTO credit_transactions (id, user_id, signal_id, amount, type)
VALUES
  (
    'bb000000-0000-4000-8000-000000000001',
    'a0000000-0000-4000-8000-000000000002',
    'd0000000-0000-4000-8000-000000000001',
    10.00,
    'STAKE'
  ),
  (
    'bb000000-0000-4000-8000-000000000002',
    'a0000000-0000-4000-8000-000000000003',
    'd0000000-0000-4000-8000-000000000002',
    5.00,
    'REWARD'
  ),
  (
    'bb000000-0000-4000-8000-000000000003',
    'a0000000-0000-4000-8000-000000000004',
    'd0000000-0000-4000-8000-000000000001',
    15.00,
    'REWARD'
  )
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- privacy challenge + escalation (two different signals)
-- ---------------------------------------------------------------------------

INSERT INTO privacy_challenges (
  id,
  signal_id,
  user_id,
  expires_at,
  status,
  match_confidence
)
VALUES
  (
    'cc000000-0000-4000-8000-000000000001',
    'd0000000-0000-4000-8000-000000000002',
    'a0000000-0000-4000-8000-000000000002',
    now() + interval '2 hours',
    'MATCHED',
    0.810
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO escalations (id, signal_id, reason, status, sent_at)
VALUES
  (
    'dd000000-0000-4000-8000-000000000001',
    'd0000000-0000-4000-8000-000000000004',
    'CRITICAL electrical fire risk at main entrance; campus security and TNFRS notified.',
    'SENT',
    now() - interval '8 minutes'
  )
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- audit log samples
-- ---------------------------------------------------------------------------

INSERT INTO audit_logs (id, actor_id, action, entity_type, entity_id, metadata)
VALUES
  (
    'ee000000-0000-4000-8000-000000000001',
    'a0000000-0000-4000-8000-000000000002',
    'signal.create',
    'signals',
    'd0000000-0000-4000-8000-000000000001',
    '{"campus":"VIT Chennai"}'::jsonb
  ),
  (
    'ee000000-0000-4000-8000-000000000002',
    'a0000000-0000-4000-8000-000000000001',
    'escalation.send',
    'escalations',
    'dd000000-0000-4000-8000-000000000001',
    '{"service":"Tamil Nadu Fire and Rescue — Kelambakkam"}'::jsonb
  )
ON CONFLICT (id) DO NOTHING;
