CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE birth_profiles (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  birth_local TIMESTAMPTZ NOT NULL,
  timezone_name TEXT NOT NULL,
  latitude NUMERIC(9,6) NOT NULL,
  longitude NUMERIC(9,6) NOT NULL,
  place_label TEXT,
  birth_utc TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE charts (
  id BIGSERIAL PRIMARY KEY,
  birth_profile_id BIGINT NOT NULL REFERENCES birth_profiles(id) ON DELETE CASCADE,
  engine_version TEXT NOT NULL,
  ephemeris_source TEXT NOT NULL DEFAULT 'swiss_ephemeris',
  zodiac_mode TEXT NOT NULL DEFAULT 'tropical_geocentric',
  design_datetime_utc TIMESTAMPTZ NOT NULL,
  type TEXT NOT NULL,
  strategy TEXT NOT NULL,
  authority TEXT NOT NULL,
  profile TEXT NOT NULL,
  definition_type TEXT NOT NULL,
  incarnation_cross TEXT,
  computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (birth_profile_id, engine_version)
);

CREATE TABLE chart_placements (
  id BIGSERIAL PRIMARY KEY,
  chart_id BIGINT NOT NULL REFERENCES charts(id) ON DELETE CASCADE,
  side TEXT NOT NULL CHECK (side IN ('personality', 'design')),
  body_name TEXT NOT NULL,
  ecliptic_longitude NUMERIC(8,5) NOT NULL,
  gate SMALLINT NOT NULL CHECK (gate BETWEEN 1 AND 64),
  line SMALLINT NOT NULL CHECK (line BETWEEN 1 AND 6)
);

CREATE TABLE chart_centers (
  id BIGSERIAL PRIMARY KEY,
  chart_id BIGINT NOT NULL REFERENCES charts(id) ON DELETE CASCADE,
  center_name TEXT NOT NULL,
  is_defined BOOLEAN NOT NULL,
  UNIQUE (chart_id, center_name)
);

CREATE TABLE chart_channels (
  id BIGSERIAL PRIMARY KEY,
  chart_id BIGINT NOT NULL REFERENCES charts(id) ON DELETE CASCADE,
  channel_id TEXT NOT NULL,
  gate_a SMALLINT NOT NULL,
  gate_b SMALLINT NOT NULL,
  is_defined BOOLEAN NOT NULL,
  source_type TEXT NOT NULL DEFAULT 'natal',
  UNIQUE (chart_id, channel_id)
);

CREATE TABLE ai_reports (
  id BIGSERIAL PRIMARY KEY,
  chart_id BIGINT NOT NULL REFERENCES charts(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL CHECK (report_type IN ('reading', 'compatibility', 'goal_coaching')),
  prompt_version TEXT NOT NULL,
  language_code TEXT NOT NULL DEFAULT 'ko-KR',
  model_name TEXT NOT NULL,
  summary_json JSONB NOT NULL,
  report_markdown TEXT NOT NULL,
  price_krw INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE compatibility_runs (
  id BIGSERIAL PRIMARY KEY,
  chart_a_id BIGINT NOT NULL REFERENCES charts(id) ON DELETE CASCADE,
  chart_b_id BIGINT NOT NULL REFERENCES charts(id) ON DELETE CASCADE,
  electromagnetic_channels JSONB NOT NULL,
  compromise_channels JSONB NOT NULL,
  companionship JSONB NOT NULL,
  dominance_notes JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (chart_a_id <> chart_b_id)
);

CREATE TABLE goal_coaching_runs (
  id BIGSERIAL PRIMARY KEY,
  chart_id BIGINT NOT NULL REFERENCES charts(id) ON DELETE CASCADE,
  current_state JSONB NOT NULL,
  goal_state JSONB NOT NULL,
  action_plan JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
