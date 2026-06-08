<?php
require_once 'db.php';

$origin = $_GET['from'] ?? '';
$destination = $_GET['to'] ?? '';
$date = $_GET['date'] ?? '';
$cabin = $_GET['cabin'] ?? '';

if (!$origin || !$destination || !$date || !$cabin) {
    sendResponse(false, null, "Missing required parameters");
}

try {
    $sql = "SELECT * FROM flights WHERE origin = ? AND destination = ? AND DATE(departure_time) = ? AND cabin_class = ? ORDER BY price ASC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$origin, $destination, $date, $cabin]);
    $flights = $stmt->fetchAll();

    sendResponse(true, $flights);
} catch (PDOException $e) {
    sendResponse(false, null, $e->getMessage());
}
