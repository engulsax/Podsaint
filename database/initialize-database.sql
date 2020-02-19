

CREATE TABLE users(
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL
);

CREATE TABLE podcasts(
    pod_id VARCHAR(50) PRIMARY KEY,
    pod_name VARCHAR(300),
    comedy_rating INT,
    drama_rating INT,
    topic_relevence_rating INT,
    production_quality_rating INT,
    overall_rating INT
);

CREATE TABLE reviews (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED,
    pod_id VARCHAR(50),
    comedy_rating INT,
    drama_rating INT,
    topic_relevence_rating INT,
    production_quality_rating INT,
    overall_rating INT,
    review_text VARCHAR(2000),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_podcast FOREIGN KEY (pod_id) REFERENCES podcasts(pod_id) ON DELETE CASCADE ON UPDATE CASCADE

);

CREATE TABLE podcastlists (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED,
    name VARCHAR(30) NOT NULL,
    pod_id VARCHAR(50),
    CONSTRAINT fk_userid FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_podcastid FOREIGN KEY (pod_id) REFERENCES podcasts(pod_id) ON DELETE CASCADE ON UPDATE CASCADE
);


INSERT INTO users(username,email,password) VALUES ("johan","test@mail.se","abc123");
INSERT INTO podcasts(pod_id) VALUES ("596047499");