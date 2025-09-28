<?php
// Allow requests from your frontend
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Database connection
$host = "localhost";
$dbname = "u728977135_scc_db";
$username = "u728977135_scc";
$password = "*Reedb4b4";

// Start PHP session
session_start();

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
        if ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            
            // Validate required fields
            $required = ['firstName', 'lastName', 'email', 'password'];
            foreach ($required as $field) {
                if (!isset($data[$field]) || empty($data[$field])) {
                    http_response_code(400);
                    echo json_encode(['error' => ucfirst($field) . ' is required']);
                    exit;
                }
            }

            try {
                // Check if email already exists
                $stmt = $db->prepare('SELECT id FROM users WHERE email = ?');
                $stmt->execute([$data['email']]);
                if ($stmt->fetch()) {
                    http_response_code(409);
                    echo json_encode(['error' => 'Email already registered']);
                    exit;
                }

                // Create user
                $userId = uniqid('usr_', true);
                $passwordHash = password_hash($data['password'], PASSWORD_DEFAULT);

                $stmt = $db->prepare('
                    INSERT INTO users (id, first_name, last_name, email, phone, password_hash, tier)
                    VALUES (?, ?, ?, ?, ?, ?, "free")
                ');

                $stmt->execute([
                    $userId,
                    $data['firstName'],
                    $data['lastName'],
                    $data['email'],
                    $data['phone'] ?? null,
                    $passwordHash
                ]);

                // Create PHP session
                $_SESSION['user_id'] = $userId;
                $_SESSION['email'] = $data['email'];

                // Create session record in database
                $sessionId = session_id();
                $stmt = $db->prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)');
                $stmt->execute([
                    $sessionId,
                    $userId,
                    date('Y-m-d H:i:s', time() + (30 * 24 * 60 * 60)) // 30 days
                ]);

                // Get created user
                $stmt = $db->prepare('SELECT id, first_name, last_name, email, phone, tier, photo_url FROM users WHERE id = ?');
                $stmt->execute([$userId]);
                $user = $stmt->fetch(PDO::FETCH_ASSOC);

                echo json_encode([
                    'user' => $user,
                    'token' => $token
                ]);

            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['error' => 'Server error']);
                exit;
            }
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
        break;

    case '/auth/forgot-password':
    case '/auth/forgot-password/':
        if ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['email'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Email is required']);
                exit;
            }

            try {
                // Check if user exists
                $stmt = $db->prepare('SELECT id FROM users WHERE email = ? AND auth_provider = "email" LIMIT 1');
                $stmt->execute([$data['email']]);
                $user = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($user) {
                    // Generate reset token
                    $token = bin2hex(random_bytes(32));
                    $expires = date('Y-m-d H:i:s', time() + (24 * 60 * 60)); // 24 hours

                    // Store token in database
                    $stmt = $db->prepare('INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)');
                    $stmt->execute([$user['id'], $token, $expires]);

                    // TODO: Send email with reset link
                    // For development, we'll just return the token
                    echo json_encode([
                        'message' => 'Password reset instructions sent',
                        'debug_token' => $token // Remove this in production
                    ]);
                } else {
                    // Don't reveal if user exists or not
                    echo json_encode(['message' => 'If an account exists with this email, reset instructions have been sent']);
                }
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['error' => 'Server error']);
            }
        }
        break;

    case '/auth/reset-password':
    case '/auth/reset-password/':
        if ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['token']) || !isset($data['password'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Token and new password are required']);
                exit;
            }

            try {
                // Verify token and get user
                $stmt = $db->prepare('
                    SELECT user_id 
                    FROM password_reset_tokens 
                    WHERE token = ? AND expires_at > NOW() AND used = 0 
                    LIMIT 1
                ');
                $stmt->execute([$data['token']]);
                $reset = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($reset) {
                    // Update password
                    $passwordHash = password_hash($data['password'], PASSWORD_DEFAULT);
                    $stmt = $db->prepare('UPDATE users SET password_hash = ? WHERE id = ?');
                    $stmt->execute([$passwordHash, $reset['user_id']]);

                    // Mark token as used
                    $stmt = $db->prepare('UPDATE password_reset_tokens SET used = 1 WHERE token = ?');
                    $stmt->execute([$data['token']]);

                    echo json_encode(['message' => 'Password updated successfully']);
                } else {
                    http_response_code(400);
                    echo json_encode(['error' => 'Invalid or expired token']);
                }
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['error' => 'Server error']);
            }
        }
        break;

    case '/auth/change-password':
    case '/auth/change-password/':
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            exit;
        }

        if ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['currentPassword']) || !isset($data['newPassword'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Current password and new password are required']);
                exit;
            }

            try {
                // Verify current password
                $stmt = $db->prepare('SELECT password_hash FROM users WHERE id = ? AND auth_provider = "email" LIMIT 1');
                $stmt->execute([$_SESSION['user_id']]);
                $user = $stmt->fetch(PDO::FETCH_ASSOC);

                if (!$user || !password_verify($data['currentPassword'], $user['password_hash'])) {
                    http_response_code(401);
                    echo json_encode(['error' => 'Current password is incorrect']);
                    exit;
                }

                // Update password
                $passwordHash = password_hash($data['newPassword'], PASSWORD_DEFAULT);
                $stmt = $db->prepare('UPDATE users SET password_hash = ? WHERE id = ?');
                $stmt->execute([$passwordHash, $_SESSION['user_id']]);

                echo json_encode(['message' => 'Password updated successfully']);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['error' => 'Server error']);
            }
        }
        break;

    case '/auth/microsoft':
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
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            exit;
        }

        switch ($method) {
            case 'GET':
                $stmt = $db->prepare("SELECT * FROM student_profiles WHERE user_id = ?");
                $stmt->execute([$_SESSION['user_id']]);
                $profile = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if ($profile) {
                    echo json_encode(['profile' => $profile]);
                } else {
                    http_response_code(404);
                    echo json_encode(['error' => 'Profile not found']);
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

    default:
        http_response_code(404);
        echo json_encode(["error" => "Endpoint not found"]);
        break;
}
