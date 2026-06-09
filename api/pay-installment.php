<?php
require_once 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
$installment_id = $data['installment_id'] ?? null;

if (!$installment_id) {
    sendResponse(false, null, "Missing installment ID");
}

$conn->begin_transaction();

try {
    // 1. Get installment details
    $stmt = $conn->prepare("SELECT * FROM installment_plans WHERE id = ?");
    $stmt->bind_param("i", $installment_id);
    $stmt->execute();
    $installment = $stmt->get_result()->fetch_assoc();

    if (!$installment) {
        throw new Exception("Installment not found");
    }

    if ($installment['paid_at']) {
        throw new Exception("Installment already paid");
    }

    // 2. Calculate penalty if overdue by more than 7 days
    $due_date = new DateTime($installment['due_date']);
    $now = new DateTime();
    $interval = $now->diff($due_date);
    $penalty = 0;

    // Split payment with delayed fee of $400
    if ($now > $due_date && $interval->days > 7) {
        $penalty = 400.00;
    }

    // 3. Update installment
    $stmt = $conn->prepare("UPDATE installment_plans SET paid_at = NOW(), penalty = ? WHERE id = ?");
    $stmt->bind_param("di", $penalty, $installment_id);
    $stmt->execute();

    // 4. Update booking penalty_applied and next_due_date
    $stmt = $conn->prepare("UPDATE bookings SET penalty_applied = penalty_applied + ? WHERE id = ?");
    $stmt->bind_param("di", $penalty, $installment['booking_id']);
    $stmt->execute();

    // Update next due date
    $stmt = $conn->prepare("SELECT due_date FROM installment_plans WHERE booking_id = ? AND paid_at IS NULL ORDER BY installment_no ASC LIMIT 1");
    $stmt->bind_param("i", $installment['booking_id']);
    $stmt->execute();
    $next = $stmt->get_result()->fetch_assoc();
    $next_due_date = $next ? $next['due_date'] : null;

    $stmt = $conn->prepare("UPDATE bookings SET next_due_date = ? WHERE id = ?");
    $stmt->bind_param("si", $next_due_date, $installment['booking_id']);
    $stmt->execute();

    $conn->commit();
    sendResponse(true, ['penalty_applied' => $penalty]);

} catch (Exception $e) {
    $conn->rollback();
    sendResponse(false, null, $e->getMessage());
}
?>
