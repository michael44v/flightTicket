<?php
require_once 'db.php';

$origin = $_GET['from'] ?? '';
$destination = $_GET['to'] ?? '';
$date = $_GET['date'] ?? '';
$cabin = $_GET['cabin'] ?? '';

if (!$origin || !$destination || !$date || !$cabin) {
    sendResponse(false, null, "Missing required parameters");
}

$sql = "SELECT * FROM flights WHERE origin = ? AND destination = ? AND DATE(departure_time) = ? AND cabin_class = ? ORDER BY price ASC";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssss", $origin, $destination, $date, $cabin);
$stmt->execute();
$result = $stmt->get_result();
$flights = $result->fetch_all(MYSQLI_ASSOC);

sendResponse(true, $flights);
?>
