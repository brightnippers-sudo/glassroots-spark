<?php
function sendResponse($statusCode, $message, $data = null) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    
    $response = [
        'success' => $statusCode >= 200 && $statusCode < 300,
        'message' => $message
    ];
    
    if ($data !== null) {
        $response['data'] = $data;
    }
    
    echo json_encode($response);
    exit;
}
