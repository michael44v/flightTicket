<?php
require_once 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
$installment_id = $data['installment_id'] ?? null;

if (!$installment_id) {
    sendResponse(false, null, "Missing installment ID");
}

try {
    $pdo->beginTransaction();

    // 1. Get installment details
    $stmt = $pdo->prepare("SELECT * FROM installment_plans WHERE id = ?");
    $stmt->execute([$installment_id]);
    $installment = $stmt->fetch();

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

    if ($now > $due_date && $interval->days > 7) {
        // Get remaining balance for the booking
        $stmt = $pdo->prepare("SELECT SUM(amount) as remaining FROM installment_plans WHERE booking_id = ? AND paid_at IS NULL");
        $stmt->execute([$installment['booking_id']]);
        $res = $stmt->fetch();
        $remaining_balance = $res['remaining'];

        $penalty = round($remaining_balance * 0.08, 2);
    }

    // 3. Update installment
    $stmt = $pdo->prepare("UPDATE installment_plans SET paid_at = NOW(), penalty = ? WHERE id = ?");
    $stmt->execute([$penalty, $installment_id]);

    // 4. Update booking penalty_applied and next_due_date
    $stmt = $pdo->prepare("UPDATE bookings SET penalty_applied = penalty_applied + ? WHERE id = ?");
    $stmt->execute([$penalty, $installment['booking_id']]);

    // Update next due date
    $stmt = $pdo->prepare("SELECT due_date FROM installment_plans WHERE booking_id = ? AND paid_at IS NULL ORDER BY installment_no ASC LIMIT 1");
    $stmt->execute([$installment['booking_id']]);
    $next = $stmt->fetch();
    $next_due_date = $next ? $next['due_date'] : null;

    $stmt = $pdo->prepare("UPDATE bookings SET next_due_date = ? WHERE id = ?");
    $stmt->execute([$next_due_date, $installment['booking_id']]);

    $pdo->commit();
    sendResponse(true, ['penalty_applied' => $penalty]);

} catch (Exception $e) {
    $pdo->rollBack();
    sendResponse(false, null, $e->getMessage());
}
