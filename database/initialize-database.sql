

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
    pq_rating INT,
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


INSERT INTO podcasts(pod_id) VALUES("P3Dokumentar");
INSERT INTO podcasts(pod_id) VALUES("P1Dokumentar");
INSERT INTO podcasts(pod_id) VALUES("CreepyPodden");
INSERT INTO podcasts(pod_id) VALUES("podd1");
INSERT INTO podcasts(pod_id) VALUES("podd2");
INSERT INTO podcasts(pod_id) VALUES("podd3");
INSERT INTO podcasts(pod_id) VALUES("podd4");
INSERT INTO podcasts(pod_id) VALUES("podd5");


INSERT INTO users (username, password) VALUES ("Alice", "abc123");
INSERT INTO users (username, password) VALUES ("Johan","abc123");
INSERT INTO users (username, password) VALUES ("Bob", "abc123");
INSERT INTO users (username, password) VALUES ("Adam","abc123");
INSERT INTO users (username, password) VALUES ("Lars", "abc123");
INSERT INTO users (username, password) VALUES ("Anton","abc123");
INSERT INTO users (username, password) VALUES ("Axel", "abc123");
INSERT INTO users (username, password) VALUES ("Isabelle","abc123");

INSERT INTO reviews(user_id,pod_id,pq_rating, seriousness_rating, humor_rating, fact_rating, overall_rating,review_text) VALUES(1,"P3Dokumentar",3,4,5,2,3,"I like this podcast alot, it was good as hell");

INSERT INTO podcastlists (user_id, name, pod_id) VALUES (1,"Favourites", "CreepyPodden");
INSERT INTO podcastlists (user_id, name, pod_id) VALUES (1,"Favourites", "P3Dokumentar");
INSERT INTO podcastlists (user_id, name, pod_id) VALUES (1,"Favourites", "podd1");
INSERT INTO podcastlists (user_id, name, pod_id) VALUES (1,"Favourites", "podd2");
INSERT INTO podcastlists (user_id, name, pod_id) VALUES (1,"want_to_listen", "podd1");
INSERT INTO podcastlists (user_id, name, pod_id) VALUES (1,"want_to_listen", "podd2");
INSERT INTO podcastlists (user_id, name, pod_id) VALUES (1,"want_to_listen", "podd3");
INSERT INTO podcastlists (user_id, name, pod_id) VALUES (1,"want_to_listen", "podd4");
INSERT INTO podcastlists (user_id, name, pod_id) VALUES (1,"want_to_listen", "podd5");
INSERT INTO podcastlists (user_id, name, pod_id) VALUES (1,"want_to_listen", "P3Dokumentar");
