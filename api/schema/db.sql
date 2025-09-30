-- Use your DB
CREATE DATABASE IF NOT EXISTS scholars_ng CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
USE scholars_ng;

-- ============================
-- Core users / profiles
-- ============================
DROP TABLE IF EXISTS profiles;
CREATE TABLE profiles (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NULL, -- optional link to auth users table
  first_name VARCHAR(120) NOT NULL,
  last_name VARCHAR(120) NOT NULL,
  display_name VARCHAR(200) GENERATED ALWAYS AS (CONCAT(first_name, ' ', last_name)) VIRTUAL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NULL,
  dob DATE NULL,
  gender ENUM('male','female','other') NULL,
  avatar_path VARCHAR(1024) NULL,
  school_id BIGINT UNSIGNED NULL,
  role ENUM('participant','coach','admin','sponsor') DEFAULT 'participant',
  metadata JSON NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY ux_profiles_email (email),
  INDEX idx_profiles_school (school_id),
  INDEX idx_profiles_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================
-- Schools table
-- ============================
DROP TABLE IF EXISTS schools;
CREATE TABLE schools (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  state VARCHAR(100) NULL,
  region_group VARCHAR(100) NULL,
  city VARCHAR(150) NULL,
  address TEXT NULL,
  contact_name VARCHAR(150) NULL,
  contact_email VARCHAR(255) NULL,
  contact_phone VARCHAR(50) NULL,
  logo_path VARCHAR(1024) NULL,
  levels JSON NULL,          -- e.g. ["lower_primary","upper_primary","jss","sss"]
  student_count INT DEFAULT 0,
  verified TINYINT(1) DEFAULT 0,
  verification_docs JSON NULL,
  metadata JSON NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY ux_schools_slug (slug),
  INDEX idx_schools_region (region_group),
  INDEX idx_schools_verified (verified)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================
-- Coaches table
-- ============================
DROP TABLE IF EXISTS coaches;
CREATE TABLE coaches (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  profile_id BIGINT UNSIGNED NULL,
  school_id BIGINT UNSIGNED NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NULL,
  phone VARCHAR(50) NULL,
  cv_path VARCHAR(1024) NULL,
  bio TEXT NULL,
  status ENUM('pending','approved','rejected') DEFAULT 'pending',
  certified TINYINT(1) DEFAULT 0,
  metadata JSON NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_coaches_school (school_id),
  INDEX idx_coaches_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================
-- Competitions table (core competitions)
-- ============================
DROP TABLE IF EXISTS competitions;
CREATE TABLE competitions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subject VARCHAR(100) NULL,
  category VARCHAR(100) NULL,
  stage VARCHAR(100) NULL,
  year YEAR NOT NULL,
  virtual TINYINT(1) DEFAULT 1,
  description TEXT NULL,
  registration_open_at DATETIME NULL,
  registration_close_at DATETIME NULL,
  status ENUM('draft','open','closed','invite-only') DEFAULT 'draft',
  syllabus_url VARCHAR(1024) NULL,
  metadata JSON NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_competitions_year (year),
  INDEX idx_competitions_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================
-- Competition categories / fees
-- ============================
DROP TABLE IF EXISTS competition_categories;
CREATE TABLE competition_categories (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  competition_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(120) NOT NULL, -- "Lower Primary", etc.
  age_range VARCHAR(50) NULL,
  fee_cents INT DEFAULT 0,
  seat_limit INT DEFAULT NULL,
  metadata JSON NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (competition_id) REFERENCES competitions(id) ON DELETE CASCADE,
  INDEX idx_cc_comp (competition_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================
-- Registrations table
-- ============================
DROP TABLE IF EXISTS registrations;
CREATE TABLE registrations (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_id BIGINT UNSIGNED NOT NULL,
  competition_id BIGINT UNSIGNED NOT NULL,
  category_id BIGINT UNSIGNED NULL,
  registration_code VARCHAR(150) NULL,
  status ENUM('pending','paid','cancelled','confirmed') DEFAULT 'pending',
  payment_id BIGINT UNSIGNED NULL,
  invoice_path VARCHAR(1024) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (competition_id) REFERENCES competitions(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES competition_categories(id) ON DELETE SET NULL,
  INDEX idx_reg_student (student_id),
  INDEX idx_reg_competition (competition_id),
  INDEX idx_reg_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================
-- Payments table (payment ledger)
-- ============================
DROP TABLE IF EXISTS payments;
CREATE TABLE payments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  registration_id BIGINT UNSIGNED NULL,
  sponsor_id BIGINT UNSIGNED NULL,
  amount_cents INT NOT NULL,
  currency CHAR(3) DEFAULT 'NGN',
  provider VARCHAR(50) NULL,      -- 'paystack', etc.
  reference VARCHAR(255) NOT NULL UNIQUE,
  status ENUM('pending','success','failed','refunded') DEFAULT 'pending',
  raw_payload JSON NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (registration_id) REFERENCES registrations(id) ON DELETE SET NULL,
  INDEX idx_pay_registration (registration_id),
  INDEX idx_pay_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================
-- Certificates
-- ============================
DROP TABLE IF EXISTS certificates;
CREATE TABLE certificates (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  profile_id BIGINT UNSIGNED NOT NULL,
  competition_id BIGINT UNSIGNED NULL,
  file_path VARCHAR(1024) NOT NULL,
  issued_by BIGINT UNSIGNED NULL, -- admin profile id
  issued_at DATETIME NULL,
  revoked TINYINT(1) DEFAULT 0,
  metadata JSON NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (competition_id) REFERENCES competitions(id) ON DELETE SET NULL,
  INDEX idx_cert_student (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================
-- Club / referrals / battles (ST20)
-- ============================
DROP TABLE IF EXISTS club_members;
CREATE TABLE club_members (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  profile_id BIGINT UNSIGNED NULL,       -- link to a profile (user) if exists
  student_id BIGINT UNSIGNED NULL,       -- or link to a student record
  referral_code VARCHAR(100) UNIQUE,
  referrals_count INT DEFAULT 0,
  battles_won INT DEFAULT 0,
  tier ENUM('starter','bronze','silver','gold') DEFAULT 'starter',
  last_activity_at DATETIME NULL,
  metadata JSON NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_club_profile (profile_id),
  INDEX idx_club_student (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS referrals;
CREATE TABLE referrals (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  referrer_club_member_id BIGINT UNSIGNED NOT NULL,
  referred_email VARCHAR(255) NULL,
  referred_profile_id BIGINT UNSIGNED NULL,
  registration_id BIGINT UNSIGNED NULL,
  source VARCHAR(100) NULL,
  status ENUM('pending','converted','invalid') DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  converted_at DATETIME NULL,
  metadata JSON NULL,
  FOREIGN KEY (referrer_club_member_id) REFERENCES club_members(id) ON DELETE CASCADE,
  FOREIGN KEY (registration_id) REFERENCES registrations(id) ON DELETE SET NULL,
  INDEX idx_referrer (referrer_club_member_id),
  INDEX idx_ref_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS battles;
CREATE TABLE battles (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  challenger_profile_id BIGINT UNSIGNED NULL,
  opponent_profile_id BIGINT UNSIGNED NULL,
  quiz_engine_battle_id VARCHAR(255) NULL,
  status ENUM('pending','completed','cancelled') DEFAULT 'pending',
  result ENUM('challenger_win','opponent_win','draw','pending') DEFAULT 'pending',
  score JSON NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME NULL,
  metadata JSON NULL,
  INDEX idx_battler_challenge (challenger_profile_id),
  INDEX idx_battler_opponent (opponent_profile_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================
-- Rewards & Redemptions (for Club)
-- ============================
DROP TABLE IF EXISTS rewards;
CREATE TABLE rewards (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  cost_type ENUM('referrals','battles') DEFAULT 'referrals',
  cost_amount INT DEFAULT 0,
  tier_required ENUM('starter','bronze','silver','gold') NULL,
  stock_limit INT NULL,
  image_path VARCHAR(1024) NULL,
  active TINYINT(1) DEFAULT 1,
  metadata JSON NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS redemptions;
CREATE TABLE redemptions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  club_member_id BIGINT UNSIGNED NOT NULL,
  reward_id BIGINT UNSIGNED NOT NULL,
  status ENUM('pending','approved','denied','fulfilled') DEFAULT 'pending',
  requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  processed_at DATETIME NULL,
  notes TEXT NULL,
  attachment_path VARCHAR(1024) NULL,
  FOREIGN KEY (club_member_id) REFERENCES club_members(id) ON DELETE CASCADE,
  FOREIGN KEY (reward_id) REFERENCES rewards(id) ON DELETE CASCADE,
  INDEX idx_redemp_member (club_member_id),
  INDEX idx_redemp_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================
-- Notifications (in-app) & messages
-- ============================
DROP TABLE IF EXISTS notifications;
CREATE TABLE notifications (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NULL,         -- profile id or null for broadcasts
  title VARCHAR(255) NOT NULL,
  body TEXT NULL,
  data JSON NULL,                       -- any metadata (links etc.)
  read_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_notifications_user (user_id),
  INDEX idx_notifications_read (read_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================
-- Audit logs
-- ============================
DROP TABLE IF EXISTS audit_logs;
CREATE TABLE audit_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  actor_profile_id BIGINT UNSIGNED NULL,
  action VARCHAR(100) NOT NULL,        -- e.g., "student.update", "payment.webhook"
  target_type VARCHAR(100) NULL,       -- e.g., "student", "registration"
  target_id BIGINT UNSIGNED NULL,
  diff JSON NULL,                      -- changes
  ip VARCHAR(45) NULL,
  user_agent VARCHAR(512) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_actor (actor_profile_id),
  INDEX idx_audit_target (target_type, target_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================
-- Import / Export jobs & result batches
-- ============================
DROP TABLE IF EXISTS import_jobs;
CREATE TABLE import_jobs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  job_type VARCHAR(100) NOT NULL, -- 'students_import','schools_import'
  file_path VARCHAR(1024) NOT NULL,
  uploaded_by BIGINT UNSIGNED NULL,
  status ENUM('queued','processing','completed','failed') DEFAULT 'queued',
  rows_total INT DEFAULT 0,
  rows_success INT DEFAULT 0,
  rows_failed INT DEFAULT 0,
  report_path VARCHAR(1024) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_import_jobs_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================
-- Result batches (for published competition results)
-- ============================
DROP TABLE IF EXISTS result_batches;
CREATE TABLE result_batches (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  competition_id BIGINT UNSIGNED NOT NULL,
  file_path VARCHAR(1024) NOT NULL,
  uploaded_by BIGINT UNSIGNED NULL,
  status ENUM('dry_run','published','rolled_back') DEFAULT 'dry_run',
  rows_count INT DEFAULT 0,
  invalid_rows_count INT DEFAULT 0,
  notes TEXT NULL,
  published_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_result_batches_comp (competition_id),
  FOREIGN KEY (competition_id) REFERENCES competitions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================
-- Results table (flattened for leaderboard)
-- ============================
DROP TABLE IF EXISTS results;
CREATE TABLE results (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  competition_id BIGINT UNSIGNED NOT NULL,
  registration_id BIGINT UNSIGNED NULL,
  student_name VARCHAR(255) NOT NULL,
  school_name VARCHAR(255) NULL,
  school_id BIGINT UNSIGNED NULL,
  category VARCHAR(120) NULL,
  score DECIMAL(8,2) NULL,
  percentile DECIMAL(5,2) NULL,
  rank INT NULL,
  published_at DATETIME NULL,
  source_batch_id BIGINT UNSIGNED NULL,
  metadata JSON NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_results_comp (competition_id),
  INDEX idx_results_rank (competition_id, rank),
  FOREIGN KEY (source_batch_id) REFERENCES result_batches(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================
-- Simple posts/media/blog tables reference
-- (optional, included for completeness)
-- ============================
DROP TABLE IF EXISTS posts;
CREATE TABLE posts (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  excerpt TEXT NULL,
  body_html LONGTEXT NULL,
  author_profile_id BIGINT UNSIGNED NULL,
  featured_image_path VARCHAR(1024) NULL,
  status ENUM('draft','published') DEFAULT 'draft',
  published_at DATETIME NULL,
  metadata JSON NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY ux_posts_slug (slug),
  INDEX idx_posts_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================
-- Foreign key references if you want to set them linking profiles and schools/coaches
-- (Optional — add after creating tables if those referenced tables exist)
-- ============================
-- Example linking profiles to schools and coaches to profiles:
ALTER TABLE profiles
  ADD CONSTRAINT fk_profiles_school FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE SET NULL;

ALTER TABLE coaches
  ADD CONSTRAINT fk_coaches_profile FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE SET NULL;

-- You can add other FK constraints as needed.

-- Roles & Permissions core
CREATE TABLE IF NOT EXISTS roles (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS permissions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL UNIQUE,
  description VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id BIGINT UNSIGNED NOT NULL,
  permission_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS user_roles (
  user_id BIGINT UNSIGNED NOT NULL,
  role_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

