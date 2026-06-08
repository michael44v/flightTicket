<?php
require_once 'db.php';

try {
    // Optionally mutate statuses for "live" feel
    if (rand(0, 1)) {
        $statuses = ['On Time', 'Delayed', 'Landed', 'Boarding'];
        $pdo->exec("UPDATE flight_logs SET status = '" . $statuses[array_rand($statuses)] . "' WHERE id IN (SELECT id FROM (SELECT id FROM flight_logs ORDER BY RAND() LIMIT 5) as tmp)");
    }

    $sql = "SELECT * FROM flight_logs ORDER BY scheduled_time DESC LIMIT 50";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $logs = $stmt->fetchAll();

    sendResponse(true, $logs);
} catch (PDOException $e) {
    sendResponse(false, null, $e->getMessage());
}
