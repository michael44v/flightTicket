<?php
require_once 'db.php';

// Import Schema
$schema = file_get_contents('../database/schema.sql');
// Multi-query for schema
if (!$conn->multi_query($schema)) {
    echo "Schema creation failed: " . $conn->error . "\n";
}
while ($conn->next_result()) {;} // flush multi_queries

echo "Schema created successfully.\n";

$routes = [
    ['origin' => 'IST', 'dest' => 'LHR', 'name' => 'London Heathrow'],
    ['origin' => 'IST', 'dest' => 'LGW', 'name' => 'London Gatwick'],
    ['origin' => 'IST', 'dest' => 'MAN', 'name' => 'Manchester'],
    ['origin' => 'IST', 'dest' => 'JFK', 'name' => 'New York JFK'],
    ['origin' => 'IST', 'dest' => 'LAX', 'name' => 'Los Angeles'],
    ['origin' => 'IST', 'dest' => 'ORD', 'name' => 'Chicago O\'Hare'],
    ['origin' => 'ESB', 'dest' => 'LHR', 'name' => 'London Heathrow'],
    ['origin' => 'ESB', 'dest' => 'JFK', 'name' => 'New York JFK'],
    ['origin' => 'SAW', 'dest' => 'STN', 'name' => 'London Stansted'],
];

$classes = ['Economy', 'Business', 'First'];
$base_prices = [
    'LHR' => 400, 'LGW' => 350, 'MAN' => 300,
    'JFK' => 800, 'LAX' => 1000, 'ORD' => 900,
    'STN' => 250
];

// Clear existing data
$conn->query("SET FOREIGN_KEY_CHECKS = 0");
$conn->query("TRUNCATE TABLE flights");
$conn->query("TRUNCATE TABLE flight_logs");
$conn->query("SET FOREIGN_KEY_CHECKS = 1");

$flight_sql = "INSERT INTO flights (flight_number, origin, destination, departure_time, arrival_time, duration, cabin_class, price, stops) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($flight_sql);

$seed_sql_content = "USE skybridge;\n";
$seed_sql_content .= "SET FOREIGN_KEY_CHECKS = 0;\n";
$seed_sql_content .= "TRUNCATE TABLE flights;\n";
$seed_sql_content .= "TRUNCATE TABLE flight_logs;\n";
$seed_sql_content .= "SET FOREIGN_KEY_CHECKS = 1;\n";

// Generate Flights
for ($i = 0; $i < 60; $i++) {
    $route = $routes[array_rand($routes)];
    $cabin = $classes[array_rand($classes)];
    $is_return = $i % 2 === 1;

    $origin = $is_return ? $route['dest'] : $route['origin'];
    $dest = $is_return ? $route['origin'] : $route['dest'];

    $days_ahead = rand(1, 400);
    $departure = new DateTime("2025-01-01");
    $departure->modify("+$days_ahead days");
    $departure->setTime(rand(0, 23), rand(0, 59));

    $duration = rand(180, 800);
    $arrival = clone $departure;
    $arrival->modify("+$duration minutes");

    $price = $base_prices[$is_return ? $origin : $dest] ?? 500;
    if ($cabin === 'Business') $price *= 2.5;
    if ($cabin === 'First') $price *= 5;
    $price += rand(-50, 100);

    $flight_no = "TK" . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);
    $stops = rand(0, 1);

    $d_time = $departure->format('Y-m-d H:i:s');
    $a_time = $arrival->format('Y-m-d H:i:s');
    $stmt->bind_param("sssssissd", $flight_no, $origin, $dest, $d_time, $a_time, $duration, $cabin, $price, $stops);
    $stmt->execute();

    $seed_sql_content .= "INSERT INTO flights (flight_number, origin, destination, departure_time, arrival_time, duration, cabin_class, price, stops) VALUES ('$flight_no', '$origin', '$dest', '$d_time', '$a_time', $duration, '$cabin', $price, $stops);\n";
}

echo "Flights seeded.\n";

// Generate Logs
$log_sql = "INSERT INTO flight_logs (flight_number, route, scheduled_time, status, price, type) VALUES (?, ?, ?, ?, ?, ?)";
$stmt_log = $conn->prepare($log_sql);

$statuses = ['On Time', 'Delayed', 'Landed', 'Boarding'];
for ($i = 0; $i < 200; $i++) {
    $route_info = $routes[array_rand($routes)];
    $type = rand(0, 1) ? 'Arrival' : 'Departure';
    $flight_no = "TK" . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);
    $route = $type === 'Arrival' ? "{$route_info['dest']} -> {$route_info['origin']}" : "{$route_info['origin']} -> {$route_info['dest']}";

    $time = new DateTime();
    $time->modify(rand(-24, 24) . " hours");
    $s_time = $time->format('Y-m-d H:i:s');

    $status = $statuses[array_rand($statuses)];
    $price = rand(200, 2000);

    $stmt_log->bind_param("ssssds", $flight_no, $route, $s_time, $status, $price, $type);
    $stmt_log->execute();

    $seed_sql_content .= "INSERT INTO flight_logs (flight_number, route, scheduled_time, status, price, type) VALUES ('$flight_no', '$route', '$s_time', '$status', $price, '$type');\n";
}

file_put_contents('../database/seed.sql', $seed_sql_content);
echo "Logs seeded and database/seed.sql generated.\n";
?>
