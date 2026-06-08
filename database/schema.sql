CREATE TABLE IF NOT EXISTS flights (
    id INT AUTO_INCREMENT PRIMARY KEY,
    flight_number VARCHAR(10) NOT NULL,
    origin VARCHAR(3) NOT NULL,
    destination VARCHAR(3) NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    duration INT NOT NULL, -- in minutes
    cabin_class ENUM('Economy', 'Business', 'First') NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stops INT DEFAULT 0,
    airplane_name VARCHAR(50) DEFAULT 'Airbus A330',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS flight_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    flight_number VARCHAR(10) NOT NULL,
    route VARCHAR(50) NOT NULL,
    scheduled_time DATETIME NOT NULL,
    status ENUM('On Time', 'Delayed', 'Landed', 'Boarding') NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    type ENUM('Arrival', 'Departure') NOT NULL,
    airplane_name VARCHAR(50) DEFAULT 'Airbus A330',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS passengers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    passport_no VARCHAR(20) NOT NULL,
    nationality VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id VARCHAR(20) UNIQUE NOT NULL,
    passenger_id INT NOT NULL,
    flight_id INT NOT NULL,
    payment_type ENUM('Full', 'Installment') NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status ENUM('Confirmed', 'Pending', 'Cancelled') DEFAULT 'Confirmed',
    penalty_applied DECIMAL(10, 2) DEFAULT 0.00,
    next_due_date DATE DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (passenger_id) REFERENCES passengers(id),
    FOREIGN KEY (flight_id) REFERENCES flights(id)
);

CREATE TABLE IF NOT EXISTS installment_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    installment_no INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    due_date DATE NOT NULL,
    paid_at DATETIME DEFAULT NULL,
    penalty DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);
