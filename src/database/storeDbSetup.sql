/* 
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS stores;
DROP TABLE IF EXISTS citys;


CREATE TABLE IF NOT EXISTS users (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	email TEXT NOT NULL UNIQUE,
	password TEXT NOT NULL,
	is_admin BOOLEAN NOT NULL DEFAULT 0 CHECK (is_admin IN (0, 1)) 
); 


CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    review_content TEXT NOT NULL,
    rating INTEGER,
    fk_stores_id INTEGER NOT NULL,
    fk_users_id INTEGER NOT NULL, 
    FOREIGN KEY(fk_stores_id) REFERENCES stores(id),
    FOREIGN KEY(fk_users_id) REFERENCES users(id)
);


CREATE TABLE IF NOT EXISTS stores (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	store_name TEXT NOT NULL,
    adress TEXT NOT NULL,
    fk_citys_id INTEGER NOT NULL, 
    fk_users_id INTEGER NOT NULL,
    FOREIGN KEY(fk_citys_id) REFERENCES citys(id),
    FOREIGN KEY(fk_users_id) REFERENCES users(id)
);



CREATE TABLE IF NOT EXISTS citys (
    id: INTEGER PRIMARY KEY AUTOINCREMENT,
    city_name: TEXT NOT NULL,
)

SELECT * FROM users;
SELECT * FROM reviews;
SELECT * FROM stores;
SELECT * FROM citys;

*/