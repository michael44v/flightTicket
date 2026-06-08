<?php
require_once 'db.php';

// Optionally mutate statuses for "live" feel
if (rand(0, 1)) {
    $statuses = ['On Time', 'Delayed', 'Landed', 'Boarding'];
    $status = $statuses[array_rand($statuses)];
    $conn->query("UPDATE flight_logs SET status = '$status' WHERE id IN (SELECT id FROM (SELECT id FROM flight_logs ORDER BY RAND() LIMIT 5) as tmp)");
}

$sql = "SELECT * FROM flight_logs ORDER BY scheduled_time DESC LIMIT 50";
$result = $conn->query($sql);
$logs = $result->fetch_all(MYSQLI_ASSOC);

sendResponse(true, $logs);
?>
