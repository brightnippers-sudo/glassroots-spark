<?php
// --------- CORS & Session Setup ---------
// Allowed origins - put your frontend origin(s) here, do NOT use '*' when using credentials
$allowedOrigins = [
    'https://app.scholars.ng',   // example production UI origin
    'https://scholars.ng',       // if front-end is same domain
    'http://localhost:8080',     // local dev (vite) - add as needed
    'http://localhost:5173',     // vite default port
    'http://127.0.0.1:5173',    // vite default port
    'http://127.0.0.1:8080'
];

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    // fallback - if origin not allowed, you can choose to deny or set nothing
    // header("Access-Control-Allow-Origin: https://app.scholars.ng");
}

// Allow credentials so cookies are sent
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

// Database connection
$host = "localhost";
$dbname = "u728977135_scc_db";
$username = "u728977135_scc";
$password = "*Reedb4b4";

// Handle OPTIONS preflight quickly and exit
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // No body for preflight response
    http_response_code(204);
    exit;
}

// Secure session cookie parameters
// If your front-end is on a different domain, you must set 'samesite' => 'None' and 'secure' => true
session_set_cookie_params([
    'lifetime' => 0,        // session cookie (expires when browser closes)
    'path' => '/',
    'domain' => '',         // set to your domain if needed (e.g., '.scholars.ng')
    'secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off', // true under HTTPS
    'httponly' => true,
    'samesite' => 'None'    // Use 'Lax' or 'Strict' if same-site; use 'None' when front-end domain is different
]);

// Start PHP session
session_start();

// Auth middleware functions
function checkAuth() {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }
    
    // Refresh session expiry
    if (isset($_SESSION['expires_at'])) {
        $expiresAt = strtotime($_SESSION['expires_at']);
        if (time() > $expiresAt) {
            session_destroy();
            http_response_code(401);
            echo json_encode(['error' => 'Session expired']);
            exit;
        }
        // Extend session if it's going to expire soon (within 30 minutes)
        if ($expiresAt - time() < 1800) {
            $_SESSION['expires_at'] = date('Y-m-d H:i:s', time() + (24 * 60 * 60)); // Extend by 24 hours
        }
    }
    return true;
}

function getUserPermissions($db, $userId) {
    $stmt = $db->prepare('
        SELECT DISTINCT p.name 
        FROM permissions p
        JOIN role_permissions rp ON p.id = rp.permission_id
        JOIN user_roles ur ON rp.role_id = ur.role_id
        WHERE ur.user_id = ?
    ');
    $stmt->execute([$userId]);
    return $stmt->fetchAll(PDO::FETCH_COLUMN);
}

function getUserRoles($db, $userId) {
    $stmt = $db->prepare('
        SELECT r.name 
        FROM roles r
        JOIN user_roles ur ON r.id = ur.role_id
        WHERE ur.user_id = ?
    ');
    $stmt->execute([$userId]);
    return $stmt->fetchAll(PDO::FETCH_COLUMN);
}

function hasPermission($db, $userId, $permission) {
    $permissions = getUserPermissions($db, $userId);
    return in_array($permission, $permissions);
}

function hasRole($db, $userId, $role) {
    $roles = getUserRoles($db, $userId);
    return in_array($role, $roles);
}

function checkPermission($db, $permission) {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }

    if (!hasPermission($db, $_SESSION['user_id'], $permission)) {
        http_response_code(403);
        echo json_encode(['error' => 'Forbidden']);
        exit;
    }
}

function checkRole($db, $role) {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }

    if (!hasRole($db, $_SESSION['user_id'], $role)) {
        http_response_code(403);
        echo json_encode(['error' => 'Forbidden']);
        exit;
    }
}

try {
    $db = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(["error" => "Connection failed: " . $e->getMessage()]);
    exit;
}

// Get the request method and endpoint
$method = $_SERVER['REQUEST_METHOD'];
$fullPath = $_SERVER['REQUEST_URI'];
$path = parse_url($fullPath, PHP_URL_PATH);

// Remove any reference to api.php from the path
$path = preg_replace('/^\/api\.php/', '', $path);

// Debug information
if (isset($_GET['debug'])) {
    echo json_encode([
        "fullPath" => $fullPath,
        "cleanedPath" => $path,
        "method" => $method
    ]);
    exit;
}

// Handle different API endpoints
switch($path) {
    // Role-based admin endpoints
    // ----------------- Admin login (session-based) -----------------
    case '/admin/auth/login':
    case '/admin/auth/login/':
        if ($method !== 'POST') {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            break;
        }
    
        $data = json_decode(file_get_contents('php://input'), true);
        if (!isset($data['email']) || !isset($data['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Email and password required']);
            break;
        }
    
        try {
            $stmt = $db->prepare('SELECT * FROM users WHERE email = ? AND auth_provider = "email" LIMIT 1');
            $stmt->execute([$data['email']]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
            if (!$user || !isset($user['password_hash']) || !password_verify($data['password'], $user['password_hash'])) {
                http_response_code(401);
                echo json_encode(['error' => 'Invalid credentials']);
                break;
            }
    
            // Ensure user has admin role (or you can use permissions check)
            $roles = getUserRoles($db, $user['id']);
            if (!in_array('admin', $roles) && !in_array('superadmin', $roles)) {
                http_response_code(403);
                echo json_encode(['error' => 'Only admin users can login here']);
                break;
            }
    
            // Create server-side session
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['roles'] = $roles;
    
            // Optionally store last_login
            $stmt = $db->prepare('UPDATE users SET last_login_at = NOW() WHERE id = ?');
            $stmt->execute([$user['id']]);
    
            // Return basic user info (do NOT return password_hash)
            unset($user['password_hash']);
            echo json_encode([
                'message' => 'Logged in',
                'user' => $user
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Server error']);
        }
        break;
    
    // ----------------- Admin logout (session destroy) -----------------
    case '/admin/auth/logout':
    case '/admin/auth/logout/':
        if ($method !== 'POST') {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            break;
        }
    
        // Remove all session data and destroy session
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params['path'], $params['domain'],
                $params['secure'], $params['httponly']
            );
        }
        session_destroy();
        echo json_encode(['message' => 'Logged out']);
        break;
    
    case '/admin/users':
    case '/admin/users/':
        checkPermission($db, 'users.manage');
        
        if ($method === 'GET') {
            $stmt = $db->query('
                SELECT id, first_name, last_name, email, status, created_at 
                FROM users 
                ORDER BY created_at DESC
            ');
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($users as &$user) {
                $user['roles'] = getUserRoles($db, $user['id']);
            }

            echo json_encode($users);
        }
        break;

    case (preg_match('#^/admin/users/(\d+)$#', $path, $matches) ? true : false):
        checkPermission($db, 'users.manage');
        $userId = $matches[1];
        
        if ($method === 'GET') {
            $stmt = $db->prepare('
                SELECT id, first_name, last_name, email, status, created_at 
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
        break;

    case (preg_match('#^/admin/users/(\d+)/status$#', $path, $matches) ? true : false):
        checkPermission($db, 'users.manage');
        $userId = $matches[1];
        
        if ($method === 'PUT') {
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
        break;

    case (preg_match('#^/admin/users/(\d+)/roles$#', $path, $matches) ? true : false):
        checkPermission($db, 'roles.manage');
        $userId = $matches[1];
        
        if ($method === 'PUT') {
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['roles']) || !is_array($data['roles'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid roles']);
                exit;
            }

            $db->beginTransaction();
            try {
                $stmt = $db->prepare('DELETE FROM user_roles WHERE user_id = ?');
                $stmt->execute([$userId]);

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
        break;

    case '/admin/roles':
    case '/admin/roles/':
        checkPermission($db, 'roles.manage');
        
        if ($method === 'GET') {
            $stmt = $db->query('SELECT id, name, description FROM roles');
            $roles = $stmt->fetchAll(PDO::FETCH_ASSOC);

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
        else if ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['name']) || !isset($data['permissions']) || !is_array($data['permissions'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid role data']);
                exit;
            }

            $db->beginTransaction();
            try {
                $roleId = uniqid('role_', true);
                $stmt = $db->prepare('INSERT INTO roles (id, name, description) VALUES (?, ?, ?)');
                $stmt->execute([$roleId, $data['name'], $data['description'] ?? null]);

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
        break;

    case (preg_match('#^/admin/roles/([^/]+)$#', $path, $matches) ? true : false):
        checkPermission($db, 'roles.manage');
        $roleId = $matches[1];
        
        if ($method === 'PUT') {
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['permissions']) || !is_array($data['permissions'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid permissions']);
                exit;
            }

            $db->beginTransaction();
            try {
                if (isset($data['description'])) {
                    $stmt = $db->prepare('UPDATE roles SET description = ? WHERE id = ?');
                    $stmt->execute([$data['description'], $roleId]);
                }

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
        else if ($method === 'DELETE') {
            $stmt = $db->prepare('SELECT name FROM roles WHERE id = ?');
            $stmt->execute([$roleId]);
            $role = $stmt->fetch();

            if ($role && in_array($role['name'], ['admin', 'participant', 'coach', 'sponsor'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Cannot delete system roles']);
                exit;
            }

            $db->beginTransaction();
            try {
                $stmt = $db->prepare('DELETE FROM user_roles WHERE role_id = ?');
                $stmt->execute([$roleId]);

                $stmt = $db->prepare('DELETE FROM role_permissions WHERE role_id = ?');
                $stmt->execute([$roleId]);

                $stmt = $db->prepare('DELETE FROM roles WHERE id = ?');
                $stmt->execute([$roleId]);

                $db->commit();
                echo json_encode(['message' => 'Role deleted successfully']);
            } catch (Exception $e) {
                $db->rollBack();
                throw $e;
            }
        }
        break;

    case '/admin/permissions':
    case '/admin/permissions/':
        checkPermission($db, 'roles.manage');
        
        if ($method === 'GET') {
            $stmt = $db->query('SELECT id, name, description FROM permissions');
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        }
        break;

    case '/homepage/hero':
    case '/homepage/hero/':
        if ($method === 'GET') {
            $stmt = $db->query("SELECT id, content FROM homepage_contents WHERE section = 'hero' ORDER BY id DESC LIMIT 1");
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($result ?: ["content" => null]);
        }
        elseif ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            $content = json_encode($data);
            
            // First try to update existing record
            $stmt = $db->prepare("UPDATE homepage_contents SET content = ? WHERE section = 'hero'");
            $result = $stmt->execute([$content]);
            
            // If no record was updated, insert new one
            if ($stmt->rowCount() === 0) {
                $stmt = $db->prepare("INSERT INTO homepage_contents (section, content) VALUES ('hero', ?)");
                $stmt->execute([$content]);
            }
            
            echo json_encode(["message" => "Hero content updated successfully"]);
        }
        break;

    case '/homepage/statistics':
    case '/homepage/statistics/':
        if ($method === 'GET') {
            $stmt = $db->query("SELECT key_name, value FROM statistics");
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($result ?: []);
        }
        elseif ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            foreach ($data as $key => $value) {
                $stmt = $db->prepare("INSERT INTO statistics (key_name, value) 
                                    VALUES (?, ?) 
                                    ON DUPLICATE KEY UPDATE value = ?");
                $stmt->execute([$key, $value, $value]);
            }
            echo json_encode(["message" => "Statistics updated successfully"]);
        }
        break;

    case '/homepage/testimonials':
    case '/homepage/testimonials/':
        if ($method === 'GET') {
            $stmt = $db->query("SELECT * FROM testimonials WHERE is_featured = 1");
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($result ?: []);
        }
        elseif ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $db->prepare("INSERT INTO testimonials (name, role, quote, image_url, is_featured) 
                                VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['name'], 
                $data['role'], 
                $data['quote'], 
                $data['image_url'], 
                $data['is_featured'] ? 1 : 0
            ]);
            echo json_encode([
                "message" => "Testimonial added successfully",
                "testimonial" => [
                    "id" => $db->lastInsertId(),
                    "name" => $data['name'],
                    "role" => $data['role'],
                    "quote" => $data['quote'],
                    "image_url" => $data['image_url'],
                    "is_featured" => $data['is_featured']
                ]
            ]);
        }
        break;

    case (preg_match('/^\/homepage\/testimonials\/(\d+)\/?$/', $path, $matches) ? true : false):
        $id = $matches[1];
        
        if ($method === 'PUT') {
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $db->prepare("UPDATE testimonials 
                                SET name = ?, role = ?, quote = ?, 
                                    image_url = ?, is_featured = ? 
                                WHERE id = ?");
            $stmt->execute([
                $data['name'],
                $data['role'],
                $data['quote'],
                $data['image_url'],
                $data['is_featured'] ? 1 : 0,
                $id
            ]);
            echo json_encode([
                "message" => "Testimonial updated successfully",
                "testimonial" => array_merge($data, ["id" => $id])
            ]);
        }
        elseif ($method === 'DELETE') {
            $stmt = $db->prepare("DELETE FROM testimonials WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(["message" => "Testimonial deleted successfully"]);
        }
        break;


    case '/homepage/how-it-works':
    case '/homepage/how-it-works/':
        if ($method === 'GET') {
            $stmt = $db->query("SELECT content FROM homepage_contents WHERE section = 'how_it_works' ORDER BY id DESC LIMIT 1");
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($result ?: [
                "content" => json_encode([
                    "steps" => [
                        [
                            "id" => 1,
                            "icon" => "UserPlus",
                            "title" => "Register",
                            "description" => "Sign up for your preferred competition category. Choose from Maths, Science, or Coding across different grade levels.",
                            "ctaLabel" => "Start Registration",
                            "ctaAction" => "register_modal"
                        ],
                        [
                            "id" => 2,
                            "icon" => "BookOpen",
                            "title" => "Practice",
                            "description" => "Access our comprehensive quiz engine to practice and prepare. Build confidence with category-specific questions.",
                            "ctaLabel" => "Practice Now",
                            "ctaAction" => "quiz_engine"
                        ],
                        [
                            "id" => 3,
                            "icon" => "Trophy",
                            "title" => "Compete",
                            "description" => "Participate in virtual competitions and showcase your skills. Progress through stages to reach the national finals.",
                            "ctaLabel" => "View Schedule",
                            "ctaAction" => "schedule_view"
                        ]
                    ]
                ])
            ]);
        }
        elseif ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            $content = json_encode($data);
            
            // First try to update existing record
            $stmt = $db->prepare("UPDATE homepage_contents SET content = ? WHERE section = 'how_it_works'");
            $result = $stmt->execute([$content]);
            
            // If no record was updated, insert new one
            if ($stmt->rowCount() === 0) {
                $stmt = $db->prepare("INSERT INTO homepage_contents (section, content) VALUES ('how_it_works', ?)");
                $stmt->execute([$content]);
            }
            
            echo json_encode(["message" => "How it works content updated successfully"]);
        }
        break;
    
    case '/homepage/conversion':
    case '/homepage/conversion/':
        if ($method === 'GET') {
            // Get the conversion content with its cards
            $sql = "SELECT 
                c.*,
                GROUP_CONCAT(
                    JSON_OBJECT(
                        'id', cards.id,
                        'value', cards.value_text,
                        'label', cards.label,
                        'order', cards.display_order
                    )
                ) as cards_data
                FROM homepage_conversion c
                LEFT JOIN homepage_conversion_cards cards ON c.id = cards.conversion_id
                GROUP BY c.id
                LIMIT 1";
                
            $stmt = $db->query($sql);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($result) {
                // Parse the cards data from string to array
                $cards = array_map(function($card) {
                    return json_decode($card, true);
                }, explode(',', $result['cards_data']));
                
                // Format the response
                $content = [
                    "headline" => $result['headline'],
                    "description" => $result['description'],
                    "urgencyStrip" => [
                        "title" => $result['urgency_strip_title'],
                        "seatsRemaining" => (int)$result['urgency_strip_seats_remaining'],
                        "ctaLabel" => $result['urgency_strip_cta_label'],
                        "deadline" => $result['urgency_strip_deadline'],
                        "isCountdownActive" => (bool)$result['urgency_strip_is_countdown_active']
                    ],
                    "cards" => $cards,
                    "cta" => [
                        "primary" => [
                            "label" => $result['cta_primary_label'],
                            "action" => $result['cta_primary_action']
                        ],
                        "secondary" => [
                            "label" => $result['cta_secondary_label'],
                            "action" => $result['cta_secondary_action']
                        ]
                    ]
                ];
                
                echo json_encode(["content" => json_encode($content)]);
            } else {
                // Return default content if no data exists
                echo json_encode([
                    "content" => json_encode([
                        "headline" => "Join Thousands of Young Scholars",
                        "description" => "Join the ranks of tomorrow's leaders. Register now and take the first step towards academic excellence.",
                        "urgencyStrip" => [
                            "title" => "Registration Closing Soon!",
                            "seatsRemaining" => 2847,
                            "ctaLabel" => "Secure Your Spot",
                            "deadline" => date('Y-m-d H:i:s', strtotime('+7 days')),
                            "isCountdownActive" => true
                        ],
                        "cards" => [
                            ["id" => 1, "value" => "25,000+", "label" => "Total Participants"],
                            ["id" => 2, "value" => "500+", "label" => "Registered Schools"],
                            ["id" => 3, "value" => "36", "label" => "States Covered"],
                            ["id" => 4, "value" => "8", "label" => "Years of Excellence"]
                        ],
                        "cta" => [
                            "primary" => [
                                "label" => "Register Now",
                                "action" => "register_modal"
                            ],
                            "secondary" => [
                                "label" => "Learn More",
                                "action" => "/about"
                            ]
                        ]
                    ])
                ]);
            }
        }
        elseif ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            $content = json_decode($data['content'], true);
            
            try {
                $db->beginTransaction();
                
                // Check if we have an existing record
                $stmt = $db->query("SELECT id FROM homepage_conversion LIMIT 1");
                $existing = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if ($existing) {
                    // Update existing record
                    $sql = "UPDATE homepage_conversion SET 
                        headline = ?,
                        description = ?,
                        urgency_strip_title = ?,
                        urgency_strip_seats_remaining = ?,
                        urgency_strip_cta_label = ?,
                        urgency_strip_deadline = ?,
                        urgency_strip_is_countdown_active = ?,
                        cta_primary_label = ?,
                        cta_primary_action = ?,
                        cta_secondary_label = ?,
                        cta_secondary_action = ?,
                        updated_at = CURRENT_TIMESTAMP
                        WHERE id = ?";
                    
                    $stmt = $db->prepare($sql);
                    $stmt->execute([
                        $content['headline'],
                        $content['description'],
                        $content['urgencyStrip']['title'],
                        $content['urgencyStrip']['seatsRemaining'],
                        $content['urgencyStrip']['ctaLabel'],
                        $content['urgencyStrip']['deadline'],
                        $content['urgencyStrip']['isCountdownActive'],
                        $content['cta']['primary']['label'],
                        $content['cta']['primary']['action'],
                        $content['cta']['secondary']['label'],
                        $content['cta']['secondary']['action'],
                        $existing['id']
                    ]);
                    
                    // Delete existing cards
                    $db->exec("DELETE FROM homepage_conversion_cards WHERE conversion_id = " . $existing['id']);
                    
                    // Insert updated cards
                    $cardSql = "INSERT INTO homepage_conversion_cards 
                        (conversion_id, value_text, label, display_order) 
                        VALUES (?, ?, ?, ?)";
                    $cardStmt = $db->prepare($cardSql);
                    
                    foreach ($content['cards'] as $index => $card) {
                        $cardStmt->execute([
                            $existing['id'],
                            $card['value'],
                            $card['label'],
                            $index + 1
                        ]);
                    }
                    
                } else {
                    // Insert new record if none exists
                    $sql = "INSERT INTO homepage_conversion (
                        headline,
                        description,
                        urgency_strip_title,
                        urgency_strip_seats_remaining,
                        urgency_strip_cta_label,
                        urgency_strip_deadline,
                        urgency_strip_is_countdown_active,
                        cta_primary_label,
                        cta_primary_action,
                        cta_secondary_label,
                        cta_secondary_action
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    
                    $stmt = $db->prepare($sql);
                    $stmt->execute([
                        $content['headline'],
                        $content['description'],
                        $content['urgencyStrip']['title'],
                        $content['urgencyStrip']['seatsRemaining'],
                        $content['urgencyStrip']['ctaLabel'],
                        $content['urgencyStrip']['deadline'],
                        $content['urgencyStrip']['isCountdownActive'],
                        $content['cta']['primary']['label'],
                        $content['cta']['primary']['action'],
                        $content['cta']['secondary']['label'],
                        $content['cta']['secondary']['action']
                    ]);
                    
                    $conversionId = $db->lastInsertId();
                    
                    // Insert cards
                    $cardSql = "INSERT INTO homepage_conversion_cards 
                        (conversion_id, value_text, label, display_order) 
                        VALUES (?, ?, ?, ?)";
                    $cardStmt = $db->prepare($cardSql);
                    
                    foreach ($content['cards'] as $index => $card) {
                        $cardStmt->execute([
                            $conversionId,
                            $card['value'],
                            $card['label'],
                            $index + 1
                        ]);
                    }
                }
                
                $db->commit();
                echo json_encode(["message" => "Conversion section content updated successfully"]);
                
            } catch (Exception $e) {
                $db->rollBack();
                http_response_code(500);
                echo json_encode(["error" => "Failed to update conversion content: " . $e->getMessage()]);
            }
        }
        break;
    
    case '/students/register':
    case '/students/register/':
        if ($method !== 'POST') {
            http_response_code(405);
            echo json_encode(["error" => "Method not allowed"]);
            break;
        }

        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid request data"]);
            break;
        }

        // Validate required fields
        $requiredFields = [
            'fullName', 'dateOfBirth', 'schoolName', 'regionGroup', 
            'category', 'parentName', 'parentPhone', 'parentEmail'
        ];

        foreach ($requiredFields as $field) {
            if (empty($data[$field])) {
                http_response_code(400);
                echo json_encode(["error" => "Missing required field: $field"]);
                break 2;
            }
        }

        try {
            $db->beginTransaction();

            // Generate unique student ID (SCMC + year + 4 random digits)
            $year = date('Y');
            do {
                $randomNum = str_pad(mt_rand(1, 9999), 4, '0', STR_PAD_LEFT);
                $studentId = "SCMC{$year}{$randomNum}";
                
                $check = $db->prepare("SELECT id FROM students WHERE id = ?");
                $check->execute([$studentId]);
            } while ($check->fetch());

            // Insert student record
            $stmt = $db->prepare("
                INSERT INTO students (
                    id, full_name, date_of_birth, gender, school_name, 
                    region_group, category, grade
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ");

            $stmt->execute([
                $studentId,
                $data['fullName'],
                $data['dateOfBirth'],
                $data['gender'] ?? null,
                $data['schoolName'],
                $data['regionGroup'],
                $data['category'],
                $data['grade'] ?? null
            ]);

            // Insert guardian information
            $stmt = $db->prepare("
                INSERT INTO guardians (
                    student_id, name, phone, email, emergency_contact
                ) VALUES (?, ?, ?, ?, ?)
            ");

            $stmt->execute([
                $studentId,
                $data['parentName'],
                $data['parentPhone'],
                $data['parentEmail'],
                $data['emergencyContact'] ?? null
            ]);

            // Handle referral and promo codes if provided
            if (!empty($data['referralCode']) || !empty($data['promoCode'])) {
                $stmt = $db->prepare("
                    INSERT INTO referrals (
                        student_id, referral_code, promo_code
                    ) VALUES (?, ?, ?)
                ");

                $stmt->execute([
                    $studentId,
                    $data['referralCode'] ?? null,
                    $data['promoCode'] ?? null
                ]);
            }

            // Create initial payment record
            $amount = 5000.00; // Base registration fee
            $discount = 0.00; // Calculate discount based on promo code if needed

            $stmt = $db->prepare("
                INSERT INTO payments (
                    student_id, amount, discount, status
                ) VALUES (?, ?, ?, 'pending')
            ");

            $stmt->execute([
                $studentId,
                $amount,
                $discount
            ]);

            $db->commit();

            echo json_encode([
                "success" => true,
                "message" => "Registration successful",
                "data" => [
                    "studentId" => $studentId,
                    "amount" => $amount,
                    "discount" => $discount,
                    "total" => $amount - $discount
                ]
            ]);

        } catch (Exception $e) {
            $db->rollBack();
            http_response_code(500);
            echo json_encode([
                "error" => "Registration failed",
                "message" => $e->getMessage()
            ]);
        }
        break;

    case '/auth/login':
    case '/auth/login/':
        if ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['email']) || !isset($data['password'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Email and password are required']);
                exit;
            }

            try {
                $stmt = $db->prepare('SELECT * FROM users WHERE email = ? AND auth_provider = "email" LIMIT 1');
                $stmt->execute([$data['email']]);
                $user = $stmt->fetch(PDO::FETCH_ASSOC);

                if (!$user || !password_verify($data['password'], $user['password_hash'])) {
                    http_response_code(401);
                    echo json_encode(['error' => 'Invalid credentials']);
                    exit;
                }

                // Create PHP session
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['email'] = $user['email'];

                // Create session record in database
                $sessionId = session_id();
                $stmt = $db->prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)');
                $stmt->execute([
                    $sessionId,
                    $user['id'],
                    date('Y-m-d H:i:s', time() + (30 * 24 * 60 * 60)) // 30 days
                ]);

                // Remove sensitive data
                unset($user['password_hash']);
                
                echo json_encode([
                    'user' => $user,
                    'sessionId' => $sessionId
                ]);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['error' => 'Server error']);
                exit;
            }
        }
        break;

    case '/auth/register':
    case '/auth/register/':
        if ($method !== 'POST') {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            break;
        }
    
        $data = json_decode(file_get_contents('php://input'), true);
        $required = ['firstName', 'lastName', 'email', 'password', 'userType'];
    
        foreach ($required as $field) {
            if (!isset($data[$field]) || empty($data[$field])) {
                http_response_code(400);
                echo json_encode(['error' => ucfirst($field) . ' is required']);
                exit;
            }
        }
    
        // Whitelisted public roles
        $allowedRoles = ['participant', 'coach', 'sponsor'];
    
        $userType = strtolower(trim($data['userType']));
        if (!in_array($userType, $allowedRoles)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid user type']);
            break;
        }
    
        try {
            $db->beginTransaction();

            // Check email uniqueness
            $stmt = $db->prepare('SELECT id FROM users WHERE email = ?');
            $stmt->execute([$data['email']]);
            if ($stmt->fetch()) {
                $db->rollBack();
                http_response_code(409);
                echo json_encode(['error' => 'Email already registered']);
                break;
            }
    
            // Create user
            $userId = uniqid('usr_', true);
            $passwordHash = password_hash($data['password'], PASSWORD_DEFAULT);
    
            // Decide initial status: participants active immediately, other roles pending approval
            $initialStatus = ($userType === 'participant') ? 'active' : 'pending';
    
            $stmt = $db->prepare('
                INSERT INTO users (id, first_name, last_name, email, phone, password_hash, status, auth_provider, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, "email", NOW())
            ');
            $stmt->execute([
                $userId,
                $data['firstName'],
                $data['lastName'],
                $data['email'],
                $data['phone'] ?? null,
                $passwordHash,
                $initialStatus
            ]);
    
            // Assign role by name
            $stmt = $db->prepare('SELECT id FROM roles WHERE name = ? LIMIT 1');
            $stmt->execute([$userType]);
            $roleRow = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$roleRow) {
                $db->rollBack();
                http_response_code(500);
                echo json_encode(['error' => 'Role configuration error; contact admin']);
                break;
            }

            $stmt = $db->prepare('INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)');
            $stmt->execute([$userId, $roleRow['id']]);
    
            // TODO: send verification email here (recommended)
            // e.g., create verification token, add to verification table, email link
    
            // Return minimal user info (do not return password hash)
            $stmt = $db->prepare('SELECT id, first_name, last_name, email, status, created_at FROM users WHERE id = ?');
            $stmt->execute([$userId]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
            $db->commit();

            echo json_encode([
                'success' => true,
                'message' => 'Registration successful',
                'user' => $user,
                'role' => $userType,
                'status' => $initialStatus
            ]);
        } catch (PDOException $e) {
            if ($db->inTransaction()) {
                $db->rollBack();
            }
            error_log("Registration error: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Registration failed. Please try again.']);
        }
        break;

    case '/auth/google':
    case '/auth/google/':
        if ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['token'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Token is required']);
                exit;
            }

            try {
                // Verify token with Google's tokeninfo endpoint
                $ch = curl_init('https://oauth2.googleapis.com/tokeninfo?id_token=' . $data['token']);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                $response = curl_exec($ch);
                $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                curl_close($ch);

                if ($httpCode !== 200) {
                    throw new Exception('Invalid token');
                }

                $payload = json_decode($response, true);
                $googleId = $payload['sub'];
                $email = $payload['email'];
                $firstName = $payload['given_name'];
                $lastName = $payload['family_name'];
                $picture = $payload['picture'] ?? null;

                // Check if user exists
                $stmt = $db->prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
                $stmt->execute([$email]);
                $user = $stmt->fetch(PDO::FETCH_ASSOC);

                if (!$user) {
                    // Create new user
                    $userId = uniqid('usr_', true);
                    $stmt = $db->prepare('
                        INSERT INTO users 
                        (id, first_name, last_name, email, photo_url, auth_provider, auth_provider_id) 
                        VALUES (?, ?, ?, ?, ?, "google", ?)
                    ');
                    $stmt->execute([$userId, $firstName, $lastName, $email, $picture, $googleId]);

                    // Get created user
                    $stmt = $db->prepare('SELECT * FROM users WHERE id = ?');
                    $stmt->execute([$userId]);
                    $user = $stmt->fetch(PDO::FETCH_ASSOC);
                }

                // Create PHP session
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['email'] = $user['email'];

                // Create session record in database
                $sessionId = session_id();
                $stmt = $db->prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)');
                $stmt->execute([
                    $sessionId,
                    $user['id'],
                    date('Y-m-d H:i:s', time() + (30 * 24 * 60 * 60)) // 30 days
                ]);

                // Remove sensitive data
                unset($user['password_hash']);
                
                echo json_encode([
                    'user' => $user,
                    'sessionId' => $sessionId
                ]);

            } catch (Exception $e) {
                http_response_code(401);
                echo json_encode(['error' => $e->getMessage()]);
                exit;
            }
        }
        break;    case '/auth/microsoft':
    case '/auth/microsoft/':
        if ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['token'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Token is required']);
                exit;
            }

            try {
                // Verify token with Microsoft Graph API
                $ch = curl_init('https://graph.microsoft.com/v1.0/me');
                curl_setopt($ch, CURLOPT_HTTPHEADER, [
                    'Authorization: Bearer ' . $data['token'],
                    'Content-Type: application/json'
                ]);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                $response = curl_exec($ch);
                $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                curl_close($ch);

                if ($httpCode !== 200) {
                    throw new Exception('Invalid token');
                }

                $msUser = json_decode($response, true);
                $microsoftId = $msUser['id'];
                $email = $msUser['userPrincipalName'];
                $firstName = $msUser['givenName'];
                $lastName = $msUser['surname'];

                // Check if user exists
                $stmt = $db->prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
                $stmt->execute([$email]);
                $user = $stmt->fetch(PDO::FETCH_ASSOC);

                if (!$user) {
                    // Create new user
                    $userId = uniqid('usr_', true);
                    $stmt = $db->prepare('
                        INSERT INTO users 
                        (id, first_name, last_name, email, auth_provider, auth_provider_id) 
                        VALUES (?, ?, ?, ?, "microsoft", ?)
                    ');
                    $stmt->execute([$userId, $firstName, $lastName, $email, $microsoftId]);

                    // Get created user
                    $stmt = $db->prepare('SELECT * FROM users WHERE id = ?');
                    $stmt->execute([$userId]);
                    $user = $stmt->fetch(PDO::FETCH_ASSOC);
                }

                // Create PHP session
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['email'] = $user['email'];

                // Create session record in database
                $sessionId = session_id();
                $stmt = $db->prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)');
                $stmt->execute([
                    $sessionId,
                    $user['id'],
                    date('Y-m-d H:i:s', time() + (30 * 24 * 60 * 60)) // 30 days
                ]);

                // Remove sensitive data
                unset($user['password_hash']);
                
                echo json_encode([
                    'user' => $user,
                    'token' => $token
                ]);

            } catch (Exception $e) {
                http_response_code(401);
                echo json_encode(['error' => $e->getMessage()]);
                exit;
            }
        }
        break;

    case '/profile/student':
    case '/profile/student/':
        checkAuth();
        
        switch ($method) {
            case 'GET':
                try {
                    // Check if student_profiles table exists
                    $stmt = $db->prepare("SHOW TABLES LIKE 'student_profiles'");
                    $stmt->execute();
                    if (!$stmt->fetch()) {
                        // Create table if it doesn't exist
                        $db->exec("CREATE TABLE IF NOT EXISTS student_profiles (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            user_id VARCHAR(255) NOT NULL,
                            school VARCHAR(255),
                            grade VARCHAR(50),
                            interests TEXT,
                            achievements TEXT,
                            points INT DEFAULT 0,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                        )");
                    }

                    // Check if roles tables exist
                    $stmt = $db->prepare("SHOW TABLES LIKE 'roles'");
                    $stmt->execute();
                    if (!$stmt->fetch()) {
                        // Create roles and user_roles tables
                        $db->exec("CREATE TABLE IF NOT EXISTS roles (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            name VARCHAR(50) NOT NULL UNIQUE,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                        )");
                        
                        $db->exec("CREATE TABLE IF NOT EXISTS user_roles (
                            user_id VARCHAR(255) NOT NULL,
                            role_id INT NOT NULL,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            PRIMARY KEY (user_id, role_id),
                            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                            FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
                        )");

                        // Insert default roles
                        $stmt = $db->prepare("INSERT IGNORE INTO roles (name) VALUES ('student'), ('teacher'), ('admin')");
                        $stmt->execute();
                    }

                    // Get user basic info with profile
                    $stmt = $db->prepare("
                        SELECT 
                            u.id,
                            u.first_name,
                            u.last_name,
                            u.email,
                            u.status,
                            u.photo_url,
                            COALESCE(sp.school, '') as school,
                            COALESCE(sp.grade, '') as grade,
                            COALESCE(sp.interests, '') as interests,
                            COALESCE(sp.achievements, '') as achievements,
                            COALESCE(sp.points, 0) as points,
                            CASE 
                                WHEN COALESCE(sp.points, 0) >= 100 THEN 'Platinum'
                                WHEN COALESCE(sp.points, 0) >= 50 THEN 'Gold'
                                WHEN COALESCE(sp.points, 0) >= 10 THEN 'Silver'
                                ELSE 'Basic'
                            END as tier
                        FROM users u
                        LEFT JOIN student_profiles sp ON u.id = sp.user_id
                        WHERE u.id = ?
                    ");
                    $stmt->execute([$_SESSION['user_id']]);
                    $profile = $stmt->fetch(PDO::FETCH_ASSOC);

                    if (!$profile) {
                        // Create a basic profile
                        $stmt = $db->prepare("INSERT INTO student_profiles (user_id) VALUES (?)");
                        $stmt->execute([$_SESSION['user_id']]);
                        
                        // Fetch the user data again
                        $stmt = $db->prepare("
                            SELECT 
                                u.id,
                                u.first_name,
                                u.last_name,
                                u.email,
                                u.status,
                                u.photo_url,
                                '' as school,
                                '' as grade,
                                '' as interests,
                                '' as achievements,
                                0 as points,
                                'Basic' as tier
                            FROM users u
                            WHERE u.id = ?
                        ");
                        $stmt->execute([$_SESSION['user_id']]);
                        $profile = $stmt->fetch(PDO::FETCH_ASSOC);
                    }

                    // Get user roles
                    $stmt = $db->prepare("
                        SELECT r.name 
                        FROM roles r
                        JOIN user_roles ur ON r.id = ur.role_id
                        WHERE ur.user_id = ?
                    ");
                    $stmt->execute([$_SESSION['user_id']]);
                    $profile['roles'] = $stmt->fetchAll(PDO::FETCH_COLUMN);

                    // If no roles are assigned, assign student role by default
                    if (empty($profile['roles'])) {
                        $stmt = $db->prepare("
                            INSERT INTO user_roles (user_id, role_id)
                            SELECT ?, id FROM roles WHERE name = 'student'
                        ");
                        $stmt->execute([$_SESSION['user_id']]);
                        $profile['roles'] = ['student'];
                    }

                    echo json_encode([
                        'success' => true,
                        'profile' => $profile
                    ]);
                } catch (Exception $e) {
                    http_response_code(500);
                    echo json_encode([
                        'success' => false,
                        'error' => $e->getMessage()
                    ]);
                }
                break;

            case 'POST':
            case 'PUT':
                $data = json_decode(file_get_contents('php://input'), true);
                
                // Validate required fields
                $required = ['school', 'grade'];
                foreach ($required as $field) {
                    if (!isset($data[$field]) || empty($data[$field])) {
                        http_response_code(400);
                        echo json_encode(['error' => ucfirst($field) . ' is required']);
                        exit;
                    }
                }

                if ($method === 'POST') {
                    $stmt = $db->prepare("
                        INSERT INTO student_profiles (user_id, school, grade, interests, achievements)
                        VALUES (?, ?, ?, ?, ?)
                    ");
                } else {
                    $stmt = $db->prepare("
                        UPDATE student_profiles 
                        SET school = ?, grade = ?, interests = ?, achievements = ?
                        WHERE user_id = ?
                    ");
                }

                try {
                    if ($method === 'POST') {
                        $stmt->execute([
                            $_SESSION['user_id'],
                            $data['school'],
                            $data['grade'],
                            $data['interests'] ?? null,
                            $data['achievements'] ?? null
                        ]);
                    } else {
                        $stmt->execute([
                            $data['school'],
                            $data['grade'],
                            $data['interests'] ?? null,
                            $data['achievements'] ?? null,
                            $_SESSION['user_id']
                        ]);
                    }
                    echo json_encode(['message' => 'Profile ' . ($method === 'POST' ? 'created' : 'updated') . ' successfully']);
                } catch (PDOException $e) {
                    http_response_code(500);
                    echo json_encode(['error' => 'Server error']);
                }
                break;

            case 'DELETE':
                $stmt = $db->prepare("DELETE FROM student_profiles WHERE user_id = ?");
                if ($stmt->execute([$_SESSION['user_id']])) {
                    echo json_encode(['message' => 'Profile deleted successfully']);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => 'Failed to delete profile']);
                }
                break;

            default:
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
                break;
        }
        break;

    case '/profile/student/registrations':
    case '/profile/student/registrations/':
        checkAuth();
        
        if ($method === 'GET') {
            try {
                // Check if table exists first
                $stmt = $db->prepare("SHOW TABLES LIKE 'registrations'");
                $stmt->execute();
                if (!$stmt->fetch()) {
                    // Create tables if they don't exist
                    $db->exec("CREATE TABLE IF NOT EXISTS registrations (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        user_id VARCHAR(255) NOT NULL,
                        competition_id INT NOT NULL,
                        status VARCHAR(50) NOT NULL DEFAULT 'pending',
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )");
                    
                    $db->exec("CREATE TABLE IF NOT EXISTS competitions (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        title VARCHAR(255) NOT NULL,
                        competition_date DATE NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )");
                    
                    // Add foreign key if it doesn't exist
                    $db->exec("
                        ALTER TABLE registrations 
                        ADD CONSTRAINT fk_user
                        FOREIGN KEY (user_id) 
                        REFERENCES users(id) 
                        ON DELETE CASCADE
                    ");
                }

                $stmt = $db->prepare("
                    SELECT 
                        r.id,
                        c.title,
                        r.status,
                        DATE_FORMAT(c.competition_date, '%M %d, %Y') as date
                    FROM registrations r
                    JOIN competitions c ON r.competition_id = c.id
                    WHERE r.user_id = ?
                    ORDER BY c.competition_date DESC
                ");
                $stmt->execute([$_SESSION['user_id']]);
                $registrations = $stmt->fetchAll(PDO::FETCH_ASSOC);

                echo json_encode([
                    'success' => true,
                    'registrations' => $registrations
                ]);
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'error' => $e->getMessage()
                ]);
            }
        }
        break;

    case '/profile/student/certificates':
    case '/profile/student/certificates/':
        checkAuth();
        
        if ($method === 'GET') {
            try {
                // Check if table exists first
                $stmt = $db->prepare("SHOW TABLES LIKE 'certificates'");
                $stmt->execute();
                if (!$stmt->fetch()) {
                    // Create table if it doesn't exist
                    $db->exec("CREATE TABLE IF NOT EXISTS certificates (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        user_id VARCHAR(255) NOT NULL,
                        title VARCHAR(255) NOT NULL,
                        issued_date DATE NOT NULL,
                        certificate_url VARCHAR(512) NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                    )");
                }

                $stmt = $db->prepare("
                    SELECT 
                        id,
                        title,
                        DATE_FORMAT(issued_date, '%b %Y') as date,
                        certificate_url as url
                    FROM certificates
                    WHERE user_id = ?
                    ORDER BY issued_date DESC
                ");
                $stmt->execute([$_SESSION['user_id']]);
                $certificates = $stmt->fetchAll(PDO::FETCH_ASSOC);

                echo json_encode([
                    'success' => true,
                    'certificates' => $certificates
                ]);
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'error' => $e->getMessage()
                ]);
            }
        }
        break;

    case '/profile/student/invoices':
    case '/profile/student/invoices/':
        checkAuth();
        
        if ($method === 'GET') {
            try {
                // Check if table exists first
                $stmt = $db->prepare("SHOW TABLES LIKE 'payments'");
                $stmt->execute();
                if (!$stmt->fetch()) {
                    // Create table if it doesn't exist
                    $db->exec("CREATE TABLE IF NOT EXISTS payments (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        user_id VARCHAR(255) NOT NULL,
                        amount DECIMAL(10,2) NOT NULL,
                        status VARCHAR(50) NOT NULL DEFAULT 'pending',
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                    )");
                }

                $stmt = $db->prepare("
                    SELECT 
                        id,
                        CONCAT('₦', FORMAT(amount, 2)) as amount,
                        status,
                        DATE_FORMAT(created_at, '%b %Y') as date
                    FROM payments
                    WHERE user_id = ?
                    ORDER BY created_at DESC
                ");
                $stmt->execute([$_SESSION['user_id']]);
                $invoices = $stmt->fetchAll(PDO::FETCH_ASSOC);

                echo json_encode([
                    'success' => true,
                    'invoices' => $invoices
                ]);
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'error' => $e->getMessage()
                ]);
            }
        }
        break;

    case '/profile/student/club-stats':
    case '/profile/student/club-stats/':
        checkAuth();
        
        if ($method === 'GET') {
            try {
                // Check if tables exist first
                $stmt = $db->prepare("SHOW TABLES LIKE 'referrals'");
                $stmt->execute();
                if (!$stmt->fetch()) {
                    // Create referrals table if it doesn't exist
                    $db->exec("CREATE TABLE IF NOT EXISTS referrals (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        referrer_id VARCHAR(255) NOT NULL,
                        referred_id VARCHAR(255) NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (referrer_id) REFERENCES users(id) ON DELETE CASCADE,
                        FOREIGN KEY (referred_id) REFERENCES users(id) ON DELETE CASCADE
                    )");
                }

                $stmt = $db->prepare("SHOW TABLES LIKE 'competition_results'");
                $stmt->execute();
                if (!$stmt->fetch()) {
                    // Create competition_results table if it doesn't exist
                    $db->exec("CREATE TABLE IF NOT EXISTS competition_results (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        user_id VARCHAR(255) NOT NULL,
                        competition_id INT NOT NULL,
                        result_type ENUM('WIN', 'LOSS', 'DRAW') NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                    )");
                }

                // Get referrals count
                $stmt = $db->prepare("
                    SELECT COUNT(*) as referrals
                    FROM referrals
                    WHERE referrer_id = ?
                ");
                $stmt->execute([$_SESSION['user_id']]);
                $referrals = $stmt->fetch(PDO::FETCH_ASSOC)['referrals'];

                // Get battles won count
                $stmt = $db->prepare("
                    SELECT COUNT(*) as battles
                    FROM competition_results
                    WHERE user_id = ? AND result_type = 'WIN'
                ");
                $stmt->execute([$_SESSION['user_id']]);
                $battles = $stmt->fetch(PDO::FETCH_ASSOC)['battles'];

                // Calculate next tier requirements
                $totalPoints = (int)$referrals + (int)$battles;
                $nextTier = 'Silver';
                $totalNeeded = 50;
                
                if ($totalPoints >= 50) {
                    $nextTier = 'Gold';
                    $totalNeeded = 100;
                }
                if ($totalPoints >= 100) {
                    $nextTier = 'Platinum';
                    $totalNeeded = 200;
                }

                echo json_encode([
                    'success' => true,
                    'stats' => [
                        'referrals' => (int)$referrals,
                        'battles' => (int)$battles,
                        'totalNeeded' => $totalNeeded,
                        'nextTier' => $nextTier
                    ]
                ]);
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'error' => $e->getMessage()
                ]);
            }
        }
        break;

    case '/profile/student/activity':
    case '/profile/student/activity/':
        checkAuth();
        
        if ($method === 'GET') {
            try {
                // Check if table exists first
                $stmt = $db->prepare("SHOW TABLES LIKE 'user_activity'");
                $stmt->execute();
                if (!$stmt->fetch()) {
                    // Create table if it doesn't exist
                    $db->exec("CREATE TABLE IF NOT EXISTS user_activity (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        user_id VARCHAR(255) NOT NULL,
                        message TEXT NOT NULL,
                        activity_type VARCHAR(50) NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                    )");
                }

                $stmt = $db->prepare("
                    SELECT 
                        message,
                        activity_type as type,
                        CASE
                            WHEN TIMESTAMPDIFF(HOUR, created_at, NOW()) < 24 
                            THEN CONCAT(TIMESTAMPDIFF(HOUR, created_at, NOW()), ' hours ago')
                            WHEN TIMESTAMPDIFF(DAY, created_at, NOW()) < 7
                            THEN CONCAT(TIMESTAMPDIFF(DAY, created_at, NOW()), ' days ago')
                            ELSE DATE_FORMAT(created_at, '%d %b %Y')
                        END as time
                    FROM user_activity
                    WHERE user_id = ?
                    ORDER BY created_at DESC
                    LIMIT 10
                ");
                $stmt->execute([$_SESSION['user_id']]);
                $activities = $stmt->fetchAll(PDO::FETCH_ASSOC);

                echo json_encode([
                    'success' => true,
                    'activities' => $activities
                ]);
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'error' => $e->getMessage()
                ]);
            }
        }
        break;

    case '/profile/student/photo':
    case '/profile/student/photo/':
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            exit;
        }

        if ($method === 'POST') {
            if (!isset($_FILES['photo'])) {
                http_response_code(400);
                echo json_encode(['error' => 'No photo uploaded']);
                exit;
            }

            $file = $_FILES['photo'];
            $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            
            if (!in_array($file['type'], $allowedTypes)) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid file type. Only JPG, PNG and GIF allowed']);
                exit;
            }

            $maxSize = 5 * 1024 * 1024; // 5MB
            if ($file['size'] > $maxSize) {
                http_response_code(400);
                echo json_encode(['error' => 'File too large. Maximum size is 5MB']);
                exit;
            }

            try {
                $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
                $filename = uniqid() . '.' . $extension;
                $uploadDir = '/uploads/profile_photos/';
                $uploadPath = $_SERVER['DOCUMENT_ROOT'] . $uploadDir;
                
                if (!file_exists($uploadPath)) {
                    mkdir($uploadPath, 0777, true);
                }

                if (move_uploaded_file($file['tmp_name'], $uploadPath . $filename)) {
                    $photoUrl = $uploadDir . $filename;
                    
                    // Update user's photo_url in database
                    $stmt = $db->prepare("UPDATE users SET photo_url = ? WHERE id = ?");
                    $stmt->execute([$photoUrl, $_SESSION['user_id']]);

                    echo json_encode([
                        'message' => 'Photo uploaded successfully',
                        'photo_url' => $photoUrl
                    ]);
                } else {
                    throw new Exception('Failed to move uploaded file');
                }
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to upload photo: ' . $e->getMessage()]);
            }
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(["error" => "Endpoint not found"]);
        break;
}
