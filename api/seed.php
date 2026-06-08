<?php
require_once 'db.php';

// Import Schema
$schema = file_get_contents('../database/schema.sql');
if (!$conn->multi_query($schema)) {
    echo "Schema creation failed: " . $conn->error . "\n";
}
while ($conn->next_result()) {;}

echo "Schema created successfully.\n";

$airplanes = ['Airbus A350-900', 'Boeing 787-9 Dreamliner', 'Airbus A330-300', 'Boeing 777-300ER', 'Airbus A321neo'];
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
$conn->query("TRUNCATE TABLE passengers");
$conn->query("TRUNCATE TABLE bookings");
$conn->query("TRUNCATE TABLE installment_plans");
$conn->query("SET FOREIGN_KEY_CHECKS = 1");

$flight_sql = "INSERT INTO flights (flight_number, origin, destination, departure_time, arrival_time, duration, cabin_class, price, stops, airplane_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($flight_sql);

// Generate Flights
for ($i = 0; $i < 60; $i++) {
    $route = $routes[array_rand($routes)];
    $cabin = $classes[array_rand($classes)];
    $plane = $airplanes[array_rand($airplanes)];
    $is_return = $i % 2 === 1;

    $origin = $is_return ? $route['dest'] : $route['origin'];
    $dest = $is_return ? $route['origin'] : $route['dest'];

    $days_ahead = rand(-30, 400); // Some in past
    $departure = new DateTime();
    $departure->modify(($days_ahead >= 0 ? "+" : "") . "$days_ahead days");
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
    $stmt->bind_param("sssssissds", $flight_no, $origin, $dest, $d_time, $a_time, $duration, $cabin, $price, $stops, $plane);
    $stmt->execute();
}

echo "Flights seeded.\n";

// Generate Logs from Jan 2026 till now
$log_sql = "INSERT INTO flight_logs (flight_number, route, scheduled_time, status, price, type, airplane_name) VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmt_log = $conn->prepare($log_sql);

$statuses = ['On Time', 'Delayed', 'Landed', 'Boarding'];
$start_date = new DateTime('2026-01-01');
$end_date = new DateTime(); // Now

for ($i = 0; $i < 200; $i++) {
    $route_info = $routes[array_rand($routes)];
    $type = rand(0, 1) ? 'Arrival' : 'Departure';
    $flight_no = "TK" . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);
    $route = $type === 'Arrival' ? "{$route_info['dest']} -> {$route_info['origin']}" : "{$route_info['origin']} -> {$route_info['dest']}";
    $plane = $airplanes[array_rand($airplanes)];

    // Random date between Jan 1 2026 and Now
    $random_timestamp = rand($start_date->getTimestamp(), $end_date->getTimestamp());
    $time = new DateTime();
    $time->setTimestamp($random_timestamp);
    $s_time = $time->format('Y-m-d H:i:s');

    $status = $statuses[array_rand($statuses)];
    $price = rand(200, 2000);

    $stmt_log->bind_param("ssssdss", $flight_no, $route, $s_time, $status, $price, $type, $plane);
    $stmt_log->execute();
}

echo "Logs seeded.\n";

// SEED SPECIFIC USER: Mick royl
$p_name = "Mick royl";
$p_email = "mick.royl@example.com";
$p_passport = "MR1234567";
$p_nat = "British";

$stmt = $conn->prepare("INSERT INTO passengers (name, email, passport_no, nationality) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $p_name, $p_email, $p_passport, $p_nat);
$stmt->execute();
$passenger_id = $conn->insert_id;

$flight_id = 1; // Use first flight
$total_amount = 1790.00;
$penalty = 410.00;
$ticket_id = "TK-2026-MICK-77";
$payment_type = "Installment";
$status = "Confirmed";

$stmt = $conn->prepare("INSERT INTO bookings (ticket_id, passenger_id, flight_id, payment_type, total_price, status, penalty_applied, next_due_date) VALUES (?, ?, ?, ?, ?, ?, ?, NULL)");
$stmt->bind_param("siisdsd", $ticket_id, $passenger_id, $flight_id, $payment_type, $total_amount, $status, $penalty);
$stmt->execute();
$booking_id = $conn->insert_id;

// Add 3 installments, all paid late
$inst_amount = round($total_amount / 3, 2);
for ($i = 1; $i <= 3; $i++) {
    $due_date = date('Y-m-d', strtotime("-".(120 - ($i*30))." days"));
    $paid_at = date('Y-m-d H:i:s', strtotime($due_date . " + 15 days")); // Paid 15 days late
    $inst_penalty = ($i === 3) ? $penalty : 0.00; // Put total penalty on last or distribute? Let's put 0 on others and total on booking.

    $stmt = $conn->prepare("INSERT INTO installment_plans (booking_id, installment_no, amount, due_date, paid_at, penalty) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("iidssd", $booking_id, $i, $inst_amount, $due_date, $paid_at, $inst_penalty);
    $stmt->execute();
}

echo "\n--- SPECIFIC SEED COMPLETE ---\n";
echo "Passenger: Mick royl\n";
echo "Ticket ID: $ticket_id\n";
echo "Total Amount: $total_amount\n";
echo "Penalty: $penalty\n";
echo "Status: PAID IN FULL (with late penalty)\n";
?>
