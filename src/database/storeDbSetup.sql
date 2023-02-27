/* 
DROP TABLE IF EXISTS stores;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS citys;
DROP TABLE IF EXISTS users;


CREATE TABLE IF NOT EXISTS users (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	email TEXT NOT NULL UNIQUE,
	password TEXT NOT NULL,
	is_admin BOOLEAN NOT NULL DEFAULT 0 CHECK (is_admin IN (0, 1)) 
); 

CREATE TABLE IF NOT EXISTS stores (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	store_name: TEXT NOT NULL,
    fk_city_id INTEGER NOT NULL,        
    FOREIGN KEY(fk_city_id) REFERENCES city(id),
    overall_rating: TEXT NOT NULL
);


CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rating: TEXT NOT NULL,
    review_content: TEXT NOT NULL,
    fk_store_id INTEGER NOT NULL,
    FOREIGN KEY(fk_store_id) REFERENCES store(id),
)

CREATE TABLE IF NOT EXISTS citys (
    id: INTEGER PRIMARY KEY AUTOINCREMENT,
    city: TEXT NOT NULL,
)


SELECT * FROM citys;
SELECT * FROM stores;
SELECT * FROM reviews;

*/