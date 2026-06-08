<?php
require_once 'db.php';

$id = $_GET['id'] ?? '';

if (!$id) {
    sendResponse(false, null, "Missing flight ID");
}

try {
    $sql = "SELECT * FROM flights WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$id]);
    $flight = $stmt->fetch();

    if (!$flight) {
        sendResponse(false, null, "Flight not found");
    }

    sendResponse(true, $flight);
} catch (PDOException $e) {
    sendResponse(false, null, $e->getMessage());
}
