<?php
require_once '../config/database.php';
require_once '../utils/response.php';
require_once '../utils/auth.php';

// Verify user is authenticated
$student = authenticate();
if (!$student) {
    sendResponse(401, 'Unauthorized access');
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$studentId = isset($_GET['id']) ? $_GET['id'] : $student['id'];

// Only allow users to access their own profile unless they're an admin
if ($studentId !== $student['id'] && !isAdmin($student)) {
    sendResponse(403, 'Forbidden access');
    exit;
}

switch ($method) {
    case 'GET':
        // Get student profile
        $stmt = $pdo->prepare("SELECT id, name, email, photo_url, tier FROM students WHERE id = ?");
        $stmt->execute([$studentId]);
        $profile = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$profile) {
            sendResponse(404, 'Student not found');
            exit;
        }
        
        sendResponse(200, 'Profile retrieved successfully', $profile);
        break;

    case 'PUT':
        // Update student profile
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data) {
            sendResponse(400, 'Invalid request data');
            exit;
        }
        
        $allowedFields = ['name', 'email'];
        $updates = array_intersect_key($data, array_flip($allowedFields));
        
        if (empty($updates)) {
            sendResponse(400, 'No valid fields to update');
            exit;
        }
        
        // Build update query
        $sets = [];
        $params = [];
        foreach ($updates as $field => $value) {
            $sets[] = "$field = ?";
            $params[] = $value;
        }
        $params[] = $studentId;
        
        $stmt = $pdo->prepare("UPDATE students SET " . implode(', ', $sets) . " WHERE id = ?");
        
        if (!$stmt->execute($params)) {
            sendResponse(500, 'Failed to update profile');
            exit;
        }
        
        sendResponse(200, 'Profile updated successfully');
        break;

    default:
        sendResponse(405, 'Method not allowed');
        break;
}
