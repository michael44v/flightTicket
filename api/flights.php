<?php
require_once 'db.php';

$origin = $_GET['from'] ?? '';
$destination = $_GET['to'] ?? '';
$date = $_GET['date'] ?? '';
$cabin = $_GET['cabin'] ?? '';

if (!$origin || !$destination || !$date || !$cabin) {
    sendResponse(false, null, "Missing required parameters");
}

// Simulated external API check logic
// We fetch the base price from our database (which acts as our flight provider)
$sql = "SELECT * FROM flights WHERE origin = ? AND destination = ? AND DATE(departure_time) = ? AND cabin_class = ? ORDER BY price ASC";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssss", $origin, $destination, $date, $cabin);
$stmt->execute();
$result = $stmt->get_result();
$flights = $result->fetch_all(MYSQLI_ASSOC);

// "Adds our site charges" logic
// We ensure all prices are at least $1400 and add a service fee
$processed_flights = array_map(function($f) {
    $base_price = (float)$f['price'];
    $site_service_fee = 150.00; // Our site charge

    $final_price = max(1400.00, $base_price + $site_service_fee);
    $f['price'] = $final_price;
    $f['base_price'] = $base_price;
    $f['service_fee'] = $site_service_fee;

    return $f;
}, $flights);

sendResponse(true, $processed_flights);
?>
