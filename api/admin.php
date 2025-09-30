<?php
require_once 'middleware/auth.php';

session_start();

try {
    $db = new PDO(
        "mysql:host=localhost;dbname=glassroots_spark",
        "root", 
        "", 
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    $method = $_SERVER['REQUEST_METHOD'];
    $path = trim($_SERVER['PATH_INFO'] ?? '/', '/');

    // List all users
    if ($method === 'GET' && $path === 'users') {
        checkPermission($db, 'view_users');
        
        $stmt = $db->query('
            SELECT id, email, name, status, created_at 
            FROM users 
            ORDER BY created_at DESC
        ');
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Get roles for each user
        foreach ($users as &$user) {
            $user['roles'] = getUserRoles($db, $user['id']);
        }

        echo json_encode($users);
    }

    // Get specific user
    else if ($method === 'GET' && preg_match('#^users/(\d+)$#', $path, $matches)) {
        checkPermission($db, 'view_users');
        
        $userId = $matches[1];
        $stmt = $db->prepare('
            SELECT id, email, name, status, created_at 
            FROM users 
            WHERE id = ?
        ');
        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
            exit;
        }

        $user['roles'] = getUserRoles($db, $user['id']);
        $user['permissions'] = getUserPermissions($db, $user['id']);

        echo json_encode($user);
    }

    // Update user status
    else if ($method === 'PUT' && preg_match('#^users/(\d+)/status$#', $path, $matches)) {
        checkPermission($db, 'manage_users');
        
        $userId = $matches[1];
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['status']) || !in_array($data['status'], ['active', 'inactive', 'pending'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid status']);
            exit;
        }

        $stmt = $db->prepare('UPDATE users SET status = ? WHERE id = ?');
        $stmt->execute([$data['status'], $userId]);

        echo json_encode(['message' => 'User status updated successfully']);
    }

    // Update user roles
    else if ($method === 'PUT' && preg_match('#^users/(\d+)/roles$#', $path, $matches)) {
        checkPermission($db, 'manage_roles');
        
        $userId = $matches[1];
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['roles']) || !is_array($data['roles'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid roles']);
            exit;
        }

        $db->beginTransaction();
        try {
            // Remove existing roles
            $stmt = $db->prepare('DELETE FROM user_roles WHERE user_id = ?');
            $stmt->execute([$userId]);

            // Add new roles
            $stmt = $db->prepare('
                INSERT INTO user_roles (user_id, role_id)
                SELECT ?, id FROM roles WHERE name = ?
            ');
            foreach ($data['roles'] as $role) {
                $stmt->execute([$userId, $role]);
            }

            $db->commit();
            echo json_encode(['message' => 'User roles updated successfully']);
        } catch (Exception $e) {
            $db->rollBack();
            throw $e;
        }
    }

    // List all roles
    else if ($method === 'GET' && $path === 'roles') {
        checkPermission($db, 'view_roles');
        
        $stmt = $db->query('SELECT id, name, description FROM roles');
        $roles = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Get permissions for each role
        foreach ($roles as &$role) {
            $stmt = $db->prepare('
                SELECT p.name 
                FROM permissions p
                JOIN role_permissions rp ON p.id = rp.permission_id
                WHERE rp.role_id = ?
            ');
            $stmt->execute([$role['id']]);
            $role['permissions'] = $stmt->fetchAll(PDO::FETCH_COLUMN);
        }

        echo json_encode($roles);
    }

    // Create new role
    else if ($method === 'POST' && $path === 'roles') {
        checkPermission($db, 'manage_roles');
        
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['name']) || !isset($data['permissions']) || !is_array($data['permissions'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid role data']);
            exit;
        }

        $db->beginTransaction();
        try {
            // Create role
            $stmt = $db->prepare('INSERT INTO roles (name, description) VALUES (?, ?)');
            $stmt->execute([$data['name'], $data['description'] ?? null]);
            $roleId = $db->lastInsertId();

            // Add permissions
            $stmt = $db->prepare('
                INSERT INTO role_permissions (role_id, permission_id)
                SELECT ?, id FROM permissions WHERE name = ?
            ');
            foreach ($data['permissions'] as $permission) {
                $stmt->execute([$roleId, $permission]);
            }

            $db->commit();
            echo json_encode(['message' => 'Role created successfully', 'id' => $roleId]);
        } catch (Exception $e) {
            $db->rollBack();
            throw $e;
        }
    }

    // Update role
    else if ($method === 'PUT' && preg_match('#^roles/(\d+)$#', $path, $matches)) {
        checkPermission($db, 'manage_roles');
        
        $roleId = $matches[1];
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['permissions']) || !is_array($data['permissions'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid permissions']);
            exit;
        }

        $db->beginTransaction();
        try {
            // Update role details if provided
            if (isset($data['description'])) {
                $stmt = $db->prepare('UPDATE roles SET description = ? WHERE id = ?');
                $stmt->execute([$data['description'], $roleId]);
            }

            // Update permissions
            $stmt = $db->prepare('DELETE FROM role_permissions WHERE role_id = ?');
            $stmt->execute([$roleId]);

            $stmt = $db->prepare('
                INSERT INTO role_permissions (role_id, permission_id)
                SELECT ?, id FROM permissions WHERE name = ?
            ');
            foreach ($data['permissions'] as $permission) {
                $stmt->execute([$roleId, $permission]);
            }

            $db->commit();
            echo json_encode(['message' => 'Role updated successfully']);
        } catch (Exception $e) {
            $db->rollBack();
            throw $e;
        }
    }

    // Delete role
    else if ($method === 'DELETE' && preg_match('#^roles/(\d+)$#', $path, $matches)) {
        checkPermission($db, 'manage_roles');
        
        $roleId = $matches[1];

        // Check if it's a system role
        $stmt = $db->prepare('SELECT name FROM roles WHERE id = ?');
        $stmt->execute([$roleId]);
        $role = $stmt->fetch();

        if ($role && in_array($role['name'], ['admin', 'user'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Cannot delete system roles']);
            exit;
        }

        $db->beginTransaction();
        try {
            // Remove role from users
            $stmt = $db->prepare('DELETE FROM user_roles WHERE role_id = ?');
            $stmt->execute([$roleId]);

            // Remove role permissions
            $stmt = $db->prepare('DELETE FROM role_permissions WHERE role_id = ?');
            $stmt->execute([$roleId]);

            // Delete role
            $stmt = $db->prepare('DELETE FROM roles WHERE id = ?');
            $stmt->execute([$roleId]);

            $db->commit();
            echo json_encode(['message' => 'Role deleted successfully']);
        } catch (Exception $e) {
            $db->rollBack();
            throw $e;
        }
    }

    // List all permissions
    else if ($method === 'GET' && $path === 'permissions') {
        checkPermission($db, 'view_roles');
        
        $stmt = $db->query('SELECT id, name, description FROM permissions');
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error']);
}
