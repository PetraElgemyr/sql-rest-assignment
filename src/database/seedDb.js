const { sequelize } = require("./config");

const seedStoresDb = async () => {
  try {
    // Drop tables if exist

    // await sequelize.query(`DROP TABLE IF EXISTS citys;`);
    // await sequelize.query(`DROP TABLE IF EXISTS users;`);
    // await sequelize.query(`DROP TABLE IF EXISTS reviews;`);
    // await sequelize.query(`DROP TABLE IF EXISTS stores;`);

    // Create users table
    await sequelize.query(`
    CREATE TABLE IF NOT EXISTS users (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	email TEXT NOT NULL UNIQUE,
	password TEXT NOT NULL,
	is_admin BOOLEAN NOT NULL DEFAULT 0 CHECK (is_admin IN (0, 1))
     `);

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS citys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    city_name TEXT NOT NULL,
    )
    `);

    // Create stores table
    await sequelize.query(`
    CREATE TABLE IF NOT EXISTS stores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        store_name TEXT NOT NULL,
        adress TEXT NOT NULL,
        fk_citys_id INTEGER NOT NULL, 
        fk_users_id INTEGER NOT NULL,
        FOREIGN KEY(fk_citys_id) REFERENCES citys(id),
        FOREIGN KEY(fk_users_id) REFERENCES users(id)
    )
      `);

    // Create reviews table
    await sequelize.query(`
    CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        review_content TEXT NOT NULL,
        rating INTEGER,
        fk_stores_id INTEGER NOT NULL,
        fk_users_id INTEGER NOT NULL, 
        FOREIGN KEY(fk_stores_id) REFERENCES stores(id),
        FOREIGN KEY(fk_users_id) REFERENCES users(id)
    )
      `);



      


    await sequelize.query(
      `INSERT INTO users (email, password, is_admin) VALUES 
      ('testus@gmail.com','testar123', 1), 
      ('ksenia.ivanova@gmail.com', 'password456',0), 
      ('petra.elgemyr@gmail.com','password789',0), 
      ('hazan@gmail.com','password123',0)`
    );

    await sequelize.query(
      `INSERT INTO citys (city_name) VALUES ('Stockholm'), ('Malmö'), ('Göteborg')`
    );

    await sequelize.query(`INSERT INTO stores 
    (store_name, address, fk_citys_id, fk_users_id) 
    VALUES 
    ('Ica Supermarket Alvikstorg', 'Gustavslundsvägen 22', (SELECT id FROM citys c WHERE city_name = 'Stockholm'), 5),
    ('Lidl Göteborg', 'Kungsgatan 16', (SELECT id FROM citys c WHERE city_name = 'Göteborg'), 6),
    ('Lidl Medborgarplatsen', 'Folkungagatan 51', (SELECT id FROM citys c WHERE city_name = 'Stockholm'), 5), 
    ('Coop Hötorget', 'T-station Hötorget', (SELECT id FROM citys c WHERE city_name = 'Stockholm'), userid), 
    ('ICA Supermarket Majorna','Karl Johansgatan 21', (SELECT id FROM citys c WHERE city_name = 'Göteborg'), 7),
    ('Stora Coop Stadion','Stadiongatan 24', (SELECT id FROM citys c WHERE city_name = 'Malmö'), 5),
    ('Ica Supermarket Hansa',' Stora Nygatan', (SELECT id FROM citys c WHERE city_name = 'Malmö'), 6),
    ('Hemköp Triangeln',' Södra Förstadsgatan 58',(SELECT id FROM citys c WHERE city_name = 'Malmö') , 7), 
    ('ICA Supermarket Olskroken',' Redbergsvägen 14', (SELECT id FROM citys c WHERE city_name = 'Göteborg'), 7),
    ('Coop Mölndalsvägen','Mölndalsvägen 1', (SELECT id FROM citys c WHERE city_name = 'Göteborg'), 6)`);

    console.log("Database successfully populated with data");
  } catch (error) {
    // Log eny eventual errors to Terminal
    console.error(error);
  } finally {
    // End Node process
    process.exit(0);
  }
};

seedStoresDb();
