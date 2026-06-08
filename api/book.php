<?php
require_once 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    sendResponse(false, null, "Invalid request body");
}

$flight_id = $data['flight_id'] ?? null;
$passenger = $data['passenger'] ?? null;
$payment_type = $data['payment_type'] ?? null;

if (!$flight_id || !$passenger || !$payment_type) {
    sendResponse(false, null, "Missing required fields");
}

try {
    $pdo->beginTransaction();

    // 1. Get flight price
    $stmt = $pdo->prepare("SELECT price FROM flights WHERE id = ?");
    $stmt->execute([$flight_id]);
    $flight = $stmt->fetch();
    if (!$flight) {
        throw new Exception("Flight not found");
    }
    $total_price = $flight['price'];

    // 2. Create passenger
    $stmt = $pdo->prepare("INSERT INTO passengers (name, email, passport_no, nationality) VALUES (?, ?, ?, ?)");
    $stmt->execute([$passenger['name'], $passenger['email'], $passenger['passport_no'], $passenger['nationality']]);
    $passenger_id = $pdo->lastInsertId();

    // 3. Generate Ticket ID
    $ticket_id = "TK-" . date('Y') . "-" . str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);

    // 4. Create Booking
    $next_due_date = null;
    if ($payment_type === 'Installment') {
        $next_due_date = date('Y-m-d'); // First installment due now
    }

    $stmt = $pdo->prepare("INSERT INTO bookings (ticket_id, passenger_id, flight_id, payment_type, total_price, status, next_due_date) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$ticket_id, $passenger_id, $flight_id, $payment_type, $total_price, 'Confirmed', $next_due_date]);
    $booking_id = $pdo->lastInsertId();

    // 5. Handle Installments
    if ($payment_type === 'Installment') {
        $installment_amount = round($total_price / 3, 2);
        for ($i = 1; $i <= 3; $i++) {
            $due_date = date('Y-m-d', strtotime("+" . (($i - 1) * 30) . " days"));
            $stmt = $pdo->prepare("INSERT INTO installment_plans (booking_id, installment_no, amount, due_date) VALUES (?, ?, ?, ?)");
            $stmt->execute([$booking_id, $i, $installment_amount, $due_date]);
        }
    }

    $pdo->commit();
    sendResponse(true, ['ticket_id' => $ticket_id]);

} catch (Exception $e) {
    $pdo->rollBack();
    sendResponse(false, null, $e->getMessage());
}
