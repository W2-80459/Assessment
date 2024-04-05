create schema support_system;
use support_system;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  role ENUM('end_user', 'tech_support', 'admin') NOT NULL
);
drop table users;
CREATE TABLE tickets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  attachment VARCHAR(255), 
  status ENUM('open', 'closed','Resolved') DEFAULT 'open',
  user_id INT,
  support_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (support_id) REFERENCES users(id)
);



drop table tickets;

INSERT INTO users (email, password, role)
VALUES ('yash@gmail.com', 'yash123', 'tech_support');

INSERT INTO users (email, password, role)
VALUES ('Parth@gmail.com', 'p123', 'end_user');

INSERT INTO tickets (title, description, attachment, status, user_id) VALUES
('Internet Connection Issue', 'Unable to connect to the internet.', 'internet_issue.png', 'Open', 1);

select * from tickets;

select * from users;

CREATE TABLE ticket_answers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,
    answer_text TEXT NOT NULL,
    attachment VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id)
);

