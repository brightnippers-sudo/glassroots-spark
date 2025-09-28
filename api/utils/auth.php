<?php
require_once '../config/database.php';

function authenticate() {
    // Check for JWT token in headers
    $headers = getallheaders();
    $token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;
    
    if (!$token) {
        return null;
    }
    
    try {
        // Verify and decode JWT token
        $key = getenv('JWT_SECRET_KEY');
        $decoded = jwt_decode($token, $key);
        
        // Check if token is expired
        if ($decoded->exp < time()) {
            return null;
        }
        
        // Get user from database
        global $pdo;
        $stmt = $pdo->prepare("SELECT id, name, email, role FROM students WHERE id = ?");
        $stmt->execute([$decoded->sub]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return $user ?: null;
        
    } catch (Exception $e) {
        return null;
    }
}

function isAdmin($user) {
    return isset($user['role']) && $user['role'] === 'admin';
}

// JWT decode function (you might want to use a proper JWT library in production)
function jwt_decode($token, $key) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        throw new Exception('Invalid token format');
    }
    
    $header = json_decode(base64_decode($parts[0]));
    $payload = json_decode(base64_decode($parts[1]));
    
    // Verify signature (simplified for example)
    $signature = hash_hmac('sha256', "$parts[0].$parts[1]", $key, true);
    $validSignature = base64_encode($signature) === $parts[2];
    
    if (!$validSignature) {
        throw new Exception('Invalid token signature');
    }
    
    return $payload;
}
