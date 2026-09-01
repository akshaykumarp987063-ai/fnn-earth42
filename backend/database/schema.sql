-- FNN Earth-42 schema
-- Apply in the Supabase Dashboard: SQL Editor → Run.
-- Do not use Docker, local PostgreSQL, or psql.
--
-- Application tables. Passwords are never stored here.
-- Login identities live in auth.users (Supabase Auth).

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "cube";
CREATE EXTENSION IF NOT EXISTS "earthdistance";

-- ---------------------------------------------------------------------------
-- Enums (aligned with shared/types)
-- ---------------------------------------------------------------------------

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('STUDENT', 'HERO', 'ADMIN');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'incident_severity') THEN
    CREATE TYPE incident_severity AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'incident_urgency') THEN
    CREATE TYPE incident_urgency AS ENUM ('IMMEDIATE', 'SOON', 'NORMAL');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'incident_category') THEN
    CREATE TYPE incident_category AS ENUM (
      'MEDICAL',
      'FIRE',
      'PERSONAL_SAFETY',
      'INFRASTRUCTURE',
      'NATURAL_DISASTER',
      'LOST_PERSON',
      'LOST_ITEM',
      'OTHER'
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'incident_status') THEN
    CREATE TYPE incident_status AS ENUM (
      'OPEN',
      'VERIFIED',
      'ASSIGNED',
      'RESPONDING',
      'RESOLVED',
      'ESCALATED'
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vote_type') THEN
    CREATE TYPE vote_type AS ENUM ('UP', 'DOWN');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'hero_task_status') THEN
    CREATE TYPE hero_task_status AS ENUM (
      'ASSIGNED',
      'ACCEPTED',
      'RESPONDING',
      'ARRIVED',
      'RESOLVED'
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'credit_transaction_type') THEN
    CREATE TYPE credit_transaction_type AS ENUM (
      'STAKE',
      'RELEASE',
      'PENALTY',
      'REWARD',
      'REFUND'
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'escalation_status') THEN
    CREATE TYPE escalation_status AS ENUM ('PENDING', 'SENT', 'FAILED');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'privacy_challenge_status') THEN
    CREATE TYPE privacy_challenge_status AS ENUM (
      'PENDING',
      'MATCHED',
      'NOT_MATCHED',
      'EXPIRED'
    );
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION reject_immutable_row()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION '% rows are immutable', TG_TABLE_NAME;
END;
$$;

-- ---------------------------------------------------------------------------
-- profiles  (1:1 with auth.users, no password column)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  pseudonym text NOT NULL,
  email text,
  role user_role NOT NULL DEFAULT 'STUDENT',
  reputation integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT profiles_pseudonym_unique UNIQUE (pseudonym)
);

DROP TRIGGER IF EXISTS profiles_set_updated_at ON profiles;
CREATE TRIGGER profiles_set_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- signals  (incidents in shared/types)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL REFERENCES profiles (id) ON DELETE RESTRICT,
  description text NOT NULL,
  category incident_category NOT NULL,
  severity incident_severity NOT NULL,
  urgency incident_urgency NOT NULL,
  confidence numeric(4, 3) NOT NULL DEFAULT 0
    CHECK (confidence >= 0 AND confidence <= 1),
  latitude double precision NOT NULL
    CHECK (latitude >= -90 AND latitude <= 90),
  longitude double precision NOT NULL
    CHECK (longitude >= -180 AND longitude <= 180),
  status incident_status NOT NULL DEFAULT 'OPEN',
  upvotes integer NOT NULL DEFAULT 0 CHECK (upvotes >= 0),
  downvotes integer NOT NULL DEFAULT 0 CHECK (downvotes >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS signals_set_updated_at ON signals;
CREATE TRIGGER signals_set_updated_at
BEFORE UPDATE ON signals
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS signals_created_at_idx ON signals (created_at DESC);
CREATE INDEX IF NOT EXISTS signals_category_idx ON signals (category);
CREATE INDEX IF NOT EXISTS signals_severity_idx ON signals (severity);
CREATE INDEX IF NOT EXISTS signals_status_idx ON signals (status);
CREATE INDEX IF NOT EXISTS signals_reporter_id_idx ON signals (reporter_id);
CREATE INDEX IF NOT EXISTS signals_lat_lng_idx ON signals (latitude, longitude);
CREATE INDEX IF NOT EXISTS signals_nearby_idx
  ON signals
  USING gist (ll_to_earth(latitude, longitude));

-- ---------------------------------------------------------------------------
-- signal_media
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS signal_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id uuid NOT NULL REFERENCES signals (id) ON DELETE CASCADE,
  uploader_id uuid NOT NULL REFERENCES profiles (id) ON DELETE RESTRICT,
  url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS signal_media_signal_id_idx ON signal_media (signal_id);

-- ---------------------------------------------------------------------------
-- signal_votes  (one vote per user per signal)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS signal_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id uuid NOT NULL REFERENCES signals (id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  vote vote_type NOT NULL,
  proof_media_id uuid REFERENCES signal_media (id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT signal_votes_signal_user_unique UNIQUE (signal_id, user_id)
);

CREATE INDEX IF NOT EXISTS signal_votes_lookup_idx ON signal_votes (signal_id, user_id);
CREATE INDEX IF NOT EXISTS signal_votes_user_id_idx ON signal_votes (user_id);

-- ---------------------------------------------------------------------------
-- heroes  (one hero profile per user)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS heroes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  skills text[] NOT NULL DEFAULT '{}',
  latitude double precision NOT NULL
    CHECK (latitude >= -90 AND latitude <= 90),
  longitude double precision NOT NULL
    CHECK (longitude >= -180 AND longitude <= 180),
  availability boolean NOT NULL DEFAULT true,
  reputation integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT heroes_user_id_unique UNIQUE (user_id)
);

DROP TRIGGER IF EXISTS heroes_set_updated_at ON heroes;
CREATE TRIGGER heroes_set_updated_at
BEFORE UPDATE ON heroes
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS heroes_availability_idx ON heroes (availability);
CREATE INDEX IF NOT EXISTS heroes_available_true_idx
  ON heroes (availability)
  WHERE availability = true;
CREATE INDEX IF NOT EXISTS heroes_lat_lng_idx ON heroes (latitude, longitude);
CREATE INDEX IF NOT EXISTS heroes_nearby_idx
  ON heroes
  USING gist (ll_to_earth(latitude, longitude));

-- ---------------------------------------------------------------------------
-- tasks  (hero assignments to signals)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id uuid NOT NULL REFERENCES signals (id) ON DELETE CASCADE,
  hero_id uuid NOT NULL REFERENCES heroes (id) ON DELETE RESTRICT,
  status hero_task_status NOT NULL DEFAULT 'ASSIGNED',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS tasks_set_updated_at ON tasks;
CREATE TRIGGER tasks_set_updated_at
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS tasks_signal_id_idx ON tasks (signal_id);
CREATE INDEX IF NOT EXISTS tasks_hero_id_idx ON tasks (hero_id);
CREATE INDEX IF NOT EXISTS tasks_status_idx ON tasks (status);

-- ---------------------------------------------------------------------------
-- credit_wallets  (no negative balances)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS credit_wallets (
  user_id uuid PRIMARY KEY REFERENCES profiles (id) ON DELETE CASCADE,
  available_credits numeric(12, 2) NOT NULL DEFAULT 0,
  locked_credits numeric(12, 2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT credit_wallets_available_non_negative CHECK (available_credits >= 0),
  CONSTRAINT credit_wallets_locked_non_negative CHECK (locked_credits >= 0)
);

DROP TRIGGER IF EXISTS credit_wallets_set_updated_at ON credit_wallets;
CREATE TRIGGER credit_wallets_set_updated_at
BEFORE UPDATE ON credit_wallets
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- credit_transactions  (append-only / immutable)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS credit_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles (id) ON DELETE RESTRICT,
  signal_id uuid REFERENCES signals (id) ON DELETE SET NULL,
  amount numeric(12, 2) NOT NULL,
  type credit_transaction_type NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS credit_transactions_user_id_idx
  ON credit_transactions (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS credit_transactions_signal_id_idx
  ON credit_transactions (signal_id);

DROP TRIGGER IF EXISTS credit_transactions_immutable ON credit_transactions;
CREATE TRIGGER credit_transactions_immutable
BEFORE UPDATE OR DELETE ON credit_transactions
FOR EACH ROW
EXECUTE FUNCTION reject_immutable_row();

-- ---------------------------------------------------------------------------
-- privacy_challenges
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS privacy_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id uuid NOT NULL REFERENCES signals (id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  status privacy_challenge_status NOT NULL DEFAULT 'PENDING',
  match_confidence numeric(4, 3)
    CHECK (match_confidence IS NULL OR (match_confidence >= 0 AND match_confidence <= 1)),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS privacy_challenges_set_updated_at ON privacy_challenges;
CREATE TRIGGER privacy_challenges_set_updated_at
BEFORE UPDATE ON privacy_challenges
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS privacy_challenges_signal_id_idx
  ON privacy_challenges (signal_id);
CREATE INDEX IF NOT EXISTS privacy_challenges_user_id_idx
  ON privacy_challenges (user_id);

-- ---------------------------------------------------------------------------
-- escalations
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS escalations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id uuid NOT NULL REFERENCES signals (id) ON DELETE CASCADE,
  reason text NOT NULL,
  status escalation_status NOT NULL DEFAULT 'PENDING',
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS escalations_set_updated_at ON escalations;
CREATE TRIGGER escalations_set_updated_at
BEFORE UPDATE ON escalations
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS escalations_signal_id_idx ON escalations (signal_id);
CREATE INDEX IF NOT EXISTS escalations_status_idx ON escalations (status);

-- ---------------------------------------------------------------------------
-- services  (public campus / emergency contacts)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  phone text NOT NULL,
  website text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT services_name_category_unique UNIQUE (name, category)
);

-- ---------------------------------------------------------------------------
-- audit_logs  (append-only)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES profiles (id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx ON audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS audit_logs_actor_id_idx ON audit_logs (actor_id);
CREATE INDEX IF NOT EXISTS audit_logs_entity_idx ON audit_logs (entity_type, entity_id);

DROP TRIGGER IF EXISTS audit_logs_immutable ON audit_logs;
CREATE TRIGGER audit_logs_immutable
BEFORE UPDATE OR DELETE ON audit_logs
FOR EACH ROW
EXECUTE FUNCTION reject_immutable_row();
