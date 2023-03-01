const { sequelize } = require("./config");

const seedStoresDb = async () => {
  try {
    // Drop tables if exist

    await sequelize.query(` DROP TABLE IF EXISTS users;`);
    await sequelize.query(`DROP TABLE IF EXISTS reviews;`);
    await sequelize.query(`DROP TABLE IF EXISTS stores;`);
    await sequelize.query(`DROP TABLE IF EXISTS citys;`);

    // Create users table
    await sequelize.query(`
    CREATE TABLE IF NOT EXISTS users (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	email TEXT NOT NULL UNIQUE,
	password TEXT NOT NULL,
	is_admin BOOLEAN NOT NULL DEFAULT 0 CHECK (is_admin IN (0, 1)) 
    ); 
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
    );
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
    );
      `);

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS citys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    city_name TEXT NOT NULL,
    );
    `);

    let storesInsertQuery =
      "INSERT INTO stores (store_name, address, fk_citys_id, fk_users_id) VALUES ('Ica Supermarket Alvikstorg', 'Gustavslundsvägen 22', 1, userid), ('Lidl Göteborg', 'Kungsgatan 16', 3, userid), ('Lidl Medborgarplatsen', 'Folkungagatan 51', 1, userid), ('Coop Hötorget', 'T-station Hötorget', 1, userid), ('ICA Supermarket Majorna','Karl Johansgatan 21', 3, userid), ('Stora Coop Stadion','Stadiongatan 24', 2, userid), ('Ica Supermarket Hansa',' Stora Nygatan', 2, userid), ('Hemköp Triangeln',' Södra Förstadsgatan 58',2 , userid), ('ICA Supermarket Olskroken',' Redbergsvägen 14', 3, userid), ('Coop Mölndalsvägen','Mölndalsvägen 1', 3, userid);";
      
    let usersInsertQuery ="INSERT INTO users(email, password, is_admin) VALUES ('testus@gmail.com','testar123', 'true'), ('ksenia.ivanova@gmail.com', 'password456','false'), ('petra.elgemyr@gmail.com','password789','false'), ('hazan@gmail.com','password123','false')";


    /* await sequelize.query(storesInsertQuery, {
      bind: { storesInsertQuery: storesInsertQuery },
    }); */

    console.log("Database successfully populated with data...");
  } catch (error) {
    // Log eny eventual errors to Terminal
    console.error(error);
  } finally {
    // End Node process
    process.exit(0);
  }
};

seedStoresDb();
