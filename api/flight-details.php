<?php
require_once 'db.php';

$id = $_GET['id'] ?? '';

if (!$id) {
    sendResponse(false, null, "Missing flight ID");
}

$sql = "SELECT * FROM flights WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$flight = $stmt->get_result()->fetch_assoc();

if (!$flight) {
    sendResponse(false, null, "Flight not found");
}

sendResponse(true, $flight);
?>
