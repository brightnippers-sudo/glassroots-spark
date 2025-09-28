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

$studentId = isset($_GET['id']) ? $_GET['id'] : $student['id'];

// Only allow users to update their own photo unless they're an admin
if ($studentId !== $student['id'] && !isAdmin($student)) {
    sendResponse(403, 'Forbidden access');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(405, 'Method not allowed');
    exit;
}

// Check if file was uploaded
if (!isset($_FILES['photo']) || $_FILES['photo']['error'] !== UPLOAD_ERR_OK) {
    sendResponse(400, 'No file uploaded or upload failed');
    exit;
}

$file = $_FILES['photo'];

// Validate file type
$allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!in_array($mimeType, $allowedTypes)) {
    sendResponse(400, 'Invalid file type. Only JPEG, PNG and GIF are allowed.');
    exit;
}

// Validate file size (max 5MB)
$maxSize = 5 * 1024 * 1024;
if ($file['size'] > $maxSize) {
    sendResponse(400, 'File too large. Maximum size is 5MB.');
    exit;
}

// Create upload directory if it doesn't exist
$uploadDir = __DIR__ . '/../../public/uploads/profile-photos';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Generate unique filename
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = uniqid($studentId . '_', true) . '.' . $extension;
$filepath = $uploadDir . '/' . $filename;

// Move uploaded file
if (!move_uploaded_file($file['tmp_name'], $filepath)) {
    sendResponse(500, 'Failed to save file');
    exit;
}

// Update database with new photo URL
$photoUrl = '/uploads/profile-photos/' . $filename;
$stmt = $pdo->prepare("UPDATE students SET photo_url = ? WHERE id = ?");

if (!$stmt->execute([$photoUrl, $studentId])) {
    // Delete uploaded file if database update fails
    unlink($filepath);
    sendResponse(500, 'Failed to update profile photo');
    exit;
}

sendResponse(200, 'Profile photo updated successfully', ['photo' => $photoUrl]);
