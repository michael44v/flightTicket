<?php
require_once 'db.php';

$ticket_id = $_GET['id'] ?? '';

if (!$ticket_id) {
    sendResponse(false, null, "Missing ticket ID");
}

// Get booking and passenger info
$sql = "SELECT b.*, p.name, p.email, p.passport_no, p.nationality, f.flight_number, f.origin, f.destination, f.departure_time, f.arrival_time, f.cabin_class
        FROM bookings b
        JOIN passengers p ON b.passenger_id = p.id
        JOIN flights f ON b.flight_id = f.id
        WHERE b.ticket_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $ticket_id);
$stmt->execute();
$booking = $stmt->get_result()->fetch_assoc();

if (!$booking) {
    sendResponse(false, null, "Ticket not found");
}

// Get installment plan if applicable
$installments = [];
if ($booking['payment_type'] === 'Installment') {
    $stmt = $conn->prepare("SELECT * FROM installment_plans WHERE booking_id = ? ORDER BY installment_no ASC");
    $stmt->bind_param("i", $booking['id']);
    $stmt->execute();
    $installments = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
}

$booking['installments'] = $installments;

sendResponse(true, $booking);
?>
