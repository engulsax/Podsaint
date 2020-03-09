

CREATE TABLE users(
    username VARCHAR(50) PRIMARY KEY,
    email VARCHAR(50) NOT NULL UNIQUE,
    id INT UNSIGNED AUTO_INCREMENT UNIQUE,
    password VARCHAR(100) NOT NULL
);

CREATE TABLE podcasts(
    pod_id VARCHAR(50) PRIMARY KEY,
    pod_name VARCHAR(300),
    pod_creators VARCHAR(300),
    comedy_rating INT,
    drama_rating INT,
    topic_relevence_rating INT,
    production_quality_rating INT,
    overall_rating INT
);

CREATE TABLE reviews (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    review_poster VARCHAR(50),
    post_date DATETIME,
    pod_id VARCHAR(50),
    comedy_rating INT,
    drama_rating INT,
    topic_relevence_rating INT,
    production_quality_rating INT,
    overall_rating INT,
    review_text VARCHAR(2000),
    CONSTRAINT fk_review_poster FOREIGN KEY (review_poster) REFERENCES users(username) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_podcast FOREIGN KEY (pod_id) REFERENCES podcasts(pod_id) ON DELETE CASCADE ON UPDATE CASCADE

);

CREATE TABLE playlists(
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    playlist_name VARCHAR(50) NOT NULL,
    list_owner VARCHAR(50),
    CONSTRAINT fk_list_owner FOREIGN KEY (list_owner) REFERENCES users(username) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE podinlist(
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    pod_id VARCHAR(50) NOT NULL,
    playlist_id INT UNSIGNED NOT NULL,
    CONSTRAINT fk_pod FOREIGN KEY (pod_id) REFERENCES podcasts(pod_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_play FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY playlist_dup (pod_id, playlist_id)
);