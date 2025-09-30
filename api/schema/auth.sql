-- Roles table
CREATE TABLE roles (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Permissions table
CREATE TABLE permissions (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Role permissions mapping
CREATE TABLE role_permissions (
    role_id VARCHAR(36),
    permission_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- User roles mapping
CREATE TABLE user_roles (
    user_id VARCHAR(36),
    role_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Insert default roles
INSERT INTO roles (id, name, description) VALUES
('role_admin', 'admin', 'Full system access'),
('role_coach', 'coach', 'Coach access'),
('role_participant', 'participant', 'Student/Participant access'),
('role_sponsor', 'sponsor', 'Sponsor access');

-- Insert default permissions
INSERT INTO permissions (id, name, description) VALUES
-- Admin permissions
('perm_admin_access', 'admin.access', 'Access admin panel'),
('perm_user_manage', 'users.manage', 'Manage users'),
('perm_role_manage', 'roles.manage', 'Manage roles and permissions'),
('perm_impersonate', 'users.impersonate', 'Impersonate users'),

-- Coach permissions
('perm_student_view', 'students.view', 'View student profiles'),
('perm_student_edit', 'students.edit', 'Edit student profiles'),
('perm_progress_manage', 'progress.manage', 'Manage student progress'),

-- Student permissions
('perm_profile_edit', 'profile.edit', 'Edit own profile'),
('perm_progress_view', 'progress.view', 'View own progress'),

-- Sponsor permissions
('perm_sponsor_dashboard', 'sponsor.dashboard', 'Access sponsor dashboard'),
('perm_sponsor_reports', 'sponsor.reports', 'View sponsorship reports');

-- Assign permissions to roles
-- Admin role permissions
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 'role_admin', id FROM permissions;

-- Coach role permissions
INSERT INTO role_permissions (role_id, permission_id) VALUES
('role_coach', 'perm_student_view'),
('role_coach', 'perm_student_edit'),
('role_coach', 'perm_progress_manage');

-- Student role permissions
INSERT INTO role_permissions (role_id, permission_id) VALUES
('role_participant', 'perm_profile_edit'),
('role_participant', 'perm_progress_view');

-- Sponsor role permissions
INSERT INTO role_permissions (role_id, permission_id) VALUES
('role_sponsor', 'perm_sponsor_dashboard'),
('role_sponsor', 'perm_sponsor_reports');
