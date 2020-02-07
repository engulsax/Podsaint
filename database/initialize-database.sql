

CREATE TABLE users(
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(30) NOT NULL
);

CREATE TABLE podcasts(
    pod_id VARCHAR(50) PRIMARY KEY
);

CREATE TABLE reviews (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED,
    pod_id VARCHAR(50),
    production_quality_rating INT,
    seriousness_rating INT,
    humor_rating INT,
    fact_rating INT,
    overall_rating INT,
    review_text VARCHAR(50),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_podcast FOREIGN KEY (pod_id) REFERENCES podcasts(pod_id) ON DELETE CASCADE

);

CREATE TABLE podcastlists (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED,
    name VARCHAR(30) NOT NULL,
    pod_id VARCHAR(50),
    CONSTRAINT fk_userid FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_podcastid FOREIGN KEY (pod_id) REFERENCES podcasts(pod_id) ON DELETE CASCADE
);



INSERT INTO users(username,password) VALUES ("johan","abc123");
INSERT INTO podcasts(pod_id) VALUES ("596047499");