<?php
// includes/activity.php
// Shared activity logger for student_activity table.
// Expects $db (PDO) to be available in the caller, or pass $db as first arg.

$activityMap = [
    'login'                    => 'Logged in',
    'logout'                   => 'Logged out',

    'registration_created'     => 'Registered for :competition',
    'registration_confirmed'   => 'Registration confirmed for :competition',
    'registration_cancelled'   => 'Cancelled registration for :competition',

    'payment_pending'          => 'Initiated payment of ₦:amount for :competition',
    'payment_completed'        => 'Paid ₦:amount for :competition',
    'payment_failed'           => 'Payment failed for :competition',

    'certificate_issued'       => 'Certificate issued for :competition',

    'profile_updated'          => 'Updated profile information',
    'photo_updated'            => 'Updated profile photo',

    'referral_shared'          => 'Shared referral link',
    'battle_won'               => 'Won a battle challenge',

    'support_contacted'        => 'Contacted support',
    'system_notice'            => ':message'
];

function renderActivityMessage($map, $type, $params = []) {
    if (!isset($map[$type])) {
        if (!empty($params['message'])) return $params['message'];
        return ucfirst(str_replace('_', ' ', $type));
    }
    $msg = $map[$type];
    foreach ($params as $k => $v) {
        $msg = str_replace(':' . $k, $v, $msg);
    }
    return $msg;
}

/**
 * Log an activity row.
 * - $db: PDO instance
 * - $userId: string (your global user id e.g. 'usr_...')
 * - $type: key from $activityMap
 * - $params: substitution params (e.g. ['competition'=>'Maths','amount'=>'5,000'])
 */
function logActivity($db, $userId, $type, $params = []) {
    global $activityMap;
    if (empty($userId)) return;
    $message = renderActivityMessage($activityMap, $type, $params);
    try {
        $stmt = $db->prepare("INSERT INTO student_activity (user_id, message, type, created_at) VALUES (?, ?, ?, NOW())");
        $stmt->execute([$userId, $message, $type]);
    } catch (Exception $e) {
        // Log but don't break the flow
        error_log("logActivity failed for user {$userId}: " . $e->getMessage());
    }
}
