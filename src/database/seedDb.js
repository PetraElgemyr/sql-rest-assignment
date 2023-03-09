const { sequelize } = require("./config");
const bcrypt = require("bcrypt");

const seedStoresDb = async () => {
  try {
    await sequelize.query(`DROP TABLE IF EXISTS reviews;`);
    await sequelize.query(`DROP TABLE IF EXISTS stores;`);
    await sequelize.query(`DROP TABLE IF EXISTS users;`);
    await sequelize.query(`DROP TABLE IF EXISTS citys;`);

    await sequelize.query(`
    CREATE TABLE IF NOT EXISTS users (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	email TEXT NOT NULL UNIQUE,
	password TEXT NOT NULL,
	is_admin BOOLEAN NOT NULL DEFAULT 0 CHECK (is_admin IN (0, 1))
  )
     `);

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS citys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    city_name TEXT NOT NULL
    )
    `);

    await sequelize.query(`
    CREATE TABLE IF NOT EXISTS stores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        store_name TEXT NOT NULL,
        address TEXT NOT NULL,
        description TEXT,
        fk_citys_id INTEGER NOT NULL, 
        fk_users_id INTEGER,
        FOREIGN KEY(fk_citys_id) REFERENCES citys(id),
        FOREIGN KEY(fk_users_id) REFERENCES users(id)
        )
      `);

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

    const passwordAdmin = "testar123";
    const passwordKsenia = "password456";
    const passwordPetra = "password789";
    const passwordHazan = "password123";
    const passwordUser1 = "userPassword123";
    const passwordUser2 = "userPassword456";
    const passwordUser3 = "userPassword789";

    const newPasswordAdmin = await createHashedPassword(passwordAdmin);
    const newPasswordKsenia = await createHashedPassword(passwordKsenia);
    const newPasswordPetra = await createHashedPassword(passwordPetra);
    const newPasswordHazan = await createHashedPassword(passwordHazan);
    const newUserPassword1 = await createHashedPassword(passwordUser1);
    const newUserPassword2 = await createHashedPassword(passwordUser2);
    const newUserPassword3 = await createHashedPassword(passwordUser3);

    console.log(newPasswordHazan);

    await sequelize.query(
      `INSERT INTO users (email, password, is_admin) VALUES 
      ('testus@gmail.com','${newPasswordAdmin}', 1), 
      ('ksenia.ivanova@gmail.com','${newPasswordKsenia}',0), 
      ('petra.elgemyr@gmail.com','${newPasswordPetra}',0), 
      ('hazan@gmail.com','${newPasswordHazan}',0),
      ('user1@gmail.com','${newUserPassword1}',0),
      ('user2@gmail.com','${newUserPassword2}',0),
      ('user3@gmail.com','${newUserPassword3}',0)`
    );

    await sequelize.query(
      `INSERT INTO citys (city_name) VALUES ('Stockholm'), ('Malmö'), ('Göteborg')`
    );

    await sequelize.query(`INSERT INTO stores 
    (store_name, address, description, fk_citys_id, fk_users_id ) 
    VALUES 
    ('Ica Supermarket Alvikstorg', 'Gustavslundsvägen 22', 'Vardag eller fest? Vi har det du behöver. I butiken fyller vi varje dag på med nya färskvaror, frukt och grönt, mejeriprodukter och annat gott som förgyller din matvardag. I vår charkavdelning hittar du ostar, salami och skinkor för picknick, mys eller fest. Vi ses i butiken!', (SELECT id FROM citys c WHERE city_name = 'Stockholm'), (SELECT id FROM users u WHERE email = 'hazan@gmail.com')),
    ('Lidl Göteborg', 'Kungsgatan 16', 'Vi pressar ner priserna utan att kvalitén ska ta stryk. För oss är det viktigt att bidra till hållbar och ansvarsfull odling av råvaror. Därför satsar vi bland annat på vårt ekologiska sortiment som fortsätter att växa. Välkommen in till oss!', (SELECT id FROM citys c WHERE city_name = 'Göteborg'), (SELECT id FROM users u WHERE email = 'ksenia.ivanova@gmail.com')),
    ('Lidl Medborgarplatsen', 'Folkungagatan 51', 'En stor butik på liten yta mitt på Södermalm. Lidl Medborgarplatsen strävar efter att vara ett av de billigaste alternativen på marknaden utan att förlora kvalitet.', (SELECT id FROM citys c WHERE city_name = 'Stockholm'), (SELECT id FROM users u WHERE email = 'hazan@gmail.com')), 
    ('Coop Hötorget', 'T-station Hötorget', 'Coop Hötorget har stort utbud av allt som kan behövas. Mitt i Stockholm ligger vi med fokus på att det ska vara enkelt att snabbt handla hos oss påväg hem från jobbet utan något krångel. Välkommen in hos oss!', (SELECT id FROM citys c WHERE city_name = 'Stockholm'), (SELECT id FROM users u WHERE email = 'hazan@gmail.com')), 
    ('ICA Supermarket Majorna', 'Karl Johansgatan 21', 'Ica är butiken där du kan handla mat av högsta kvalitet till bästa pris. Vi har flera hundra butiker i Sverige där svenska och ekologiska produkter samsas med utvalda utländska delikatesser.', (SELECT id FROM citys c WHERE city_name = 'Göteborg'), (SELECT id FROM users u WHERE email = 'petra.elgemyr@gmail.com')),
    ('Stora Coop Stadion', 'Stadiongatan 24', 'Coop har alltid fokus på hållbar ekologisk mat till ett bra pris, utan att minska kvaliten.', (SELECT id FROM citys c WHERE city_name = 'Malmö'), (SELECT id FROM users u WHERE email = 'hazan@gmail.com')),
    ('Ica Supermarket Hansa', 'Stora Nygatan','Ica Hansa, närbutik lagom nära och enkelt att hitta hit.', (SELECT id FROM citys c WHERE city_name = 'Malmö'), (SELECT id FROM users u WHERE email = 'ksenia.ivanova@gmail.com')),
    ('Hemköp Triangeln', 'Södra Förstadsgatan 58','Mitt i köpcentrumet ligger vi. Hjärtat av Malmö, välkommen hit!', (SELECT id FROM citys c WHERE city_name = 'Malmö') , (SELECT id FROM users u WHERE email = 'petra.elgemyr@gmail.com')), 
    ('ICA Supermarket Olskroken', 'Redbergsvägen 14','Ica Olskroken finns när du behöver och där du behöver. Vardag eller helg så har vi det du söker.', (SELECT id FROM citys c WHERE city_name = 'Göteborg'), (SELECT id FROM users u WHERE email = 'petra.elgemyr@gmail.com')),
    ('Coop Mölndalsvägen', 'Mölndalsvägen 1', 'En välsorterad butik med matbar och deli.', (SELECT id FROM citys c WHERE city_name = 'Göteborg'), (SELECT id FROM users u WHERE email = 'ksenia.ivanova@gmail.com'))`);

    await sequelize.query(`INSERT INTO reviews (review_content, rating, fk_stores_id, fk_users_id) VALUES 
    ('Coop är en av de större matbutikerna och har ett stort utbud av matvaror. Jag gillar deras sortiment av ekologiska och hälsosamma produkter, och också deras fokus på hållbarhet.', 4, (SELECT id FROM stores s WHERE store_name = 'Coop Hötorget'),(SELECT id FROM users u WHERE email = 'petra.elgemyr@gmail.com')),
    ('Coop: Jag har handlat på Coop i flera år och jag är alltid nöjd med deras utbud och kvalitet på matvaror.', 5, (SELECT id FROM stores s WHERE store_name = 'Coop Hötorget'),(SELECT id FROM users u WHERE email = 'user1@gmail.com')),
    ('ICA Nära är en liten och personlig matbutik som erbjuder bra kvalitet på matvaror. Jag gillar att de också har ett utbud av svenska produkter.', 4, (SELECT id FROM stores s WHERE store_name = 'Ica Supermarket Alvikstorg'),(SELECT id FROM users u WHERE email = 'user2@gmail.com')),
    ('För liten butik med dåligt utbud. Ok priser.', 2, (SELECT id FROM stores s WHERE store_name = 'Ica Supermarket Alvikstorg'),(SELECT id FROM users u WHERE email = 'user3@gmail.com')),
    ('Billigt men en aningen liten butik', 3, (SELECT id FROM stores s WHERE store_name = 'Lidl Göteborg'),(SELECT id FROM users u WHERE email = 'user2@gmail.com')),
    ('Bästa butiken att komplementhandla på! Så billig och fräsch frukt och grönt-avdelning', 5, (SELECT id FROM stores  s WHERE store_name = 'Lidl Göteborg'),(SELECT id FROM users u WHERE email = 'user1@gmail.com')),
    ('Bra med veckans tema! Superkul idé och varierande varor', 5, (SELECT id FROM stores s WHERE store_name = 'Lidl Medborgarplatsen'),(SELECT id FROM users u WHERE email = 'user3@gmail.com')),
    ('Utplockat på söndagar', 1, (SELECT id FROM stores s WHERE store_name = 'Lidl Medborgarplatsen'),(SELECT id FROM users u WHERE email = 'user2@gmail.com')),
    ('Nära till kollektivtrafiken så lätt att hitta dit. Okej priser!', 3, (SELECT id FROM stores s WHERE store_name = 'ICA Supermarket Majorna'),(SELECT id FROM users u WHERE email = 'user2@gmail.com')),
    ('Bra alternativ på onlineshoppen men lite dyrt!', 4, (SELECT id FROM stores s WHERE store_name = 'ICA Supermarket Majorna'),(SELECT id FROM users u WHERE email = 'user1@gmail.com')),
    ('Bra deli och charkdisk', 4, (SELECT id FROM stores s WHERE store_name = 'Stora Coop Stadion'),(SELECT id FROM users u WHERE email = 'user3@gmail.com')),
    ('Dyrt för en pensionär!', 2, (SELECT id FROM stores s WHERE store_name = 'Stora Coop Stadion'),(SELECT id FROM users u WHERE email = 'user2@gmail.com')),
    ('Okej, inget mer än så', 3, (SELECT id FROM stores WHERE store_name = 'Ica Supermarket Hansa'),(SELECT id FROM users u WHERE email = 'user3@gmail.com')),
    ('ÄLSKAR Hansa som ligger precis bredvid mig och billig!', 5, (SELECT id FROM stores s WHERE store_name = 'Ica Supermarket Hansa'),(SELECT id FROM users u WHERE email = 'user1@gmail.com')),
    ('Höga priser som allt annat i köpcentrumet...', 2, (SELECT id FROM stores s WHERE store_name = 'Hemköp Triangeln'),(SELECT id FROM users u WHERE email = 'user2@gmail.com')),
    ('Stor med jättebra utbud. Hittar alltid det jag behöver här!!', 5, (SELECT id FROM stores s WHERE store_name = 'Hemköp Triangeln'),(SELECT id FROM users u WHERE email = 'user3@gmail.com')),
    ('Sååå trevlig personal, alltid schyssta', 5, (SELECT id FROM stores s WHERE store_name = 'ICA Supermarket Olskroken' ),(SELECT id FROM users u WHERE email = 'user3@gmail.com')),
    ('Få kassor så det är alltid kö här tyvärr', 3, (SELECT id FROM stores s WHERE store_name = 'ICA Supermarket Olskroken'),(SELECT id FROM users u WHERE email = 'user1@gmail.com')),
    ('Jag gillar deras veckans erbjudande!', 4, (SELECT id FROM stores s WHERE store_name = 'Coop Mölndalsvägen'),(SELECT id FROM users u WHERE email = 'user2@gmail.com')),
    ('Jag uppskattar deras sortiment av färskvaror och deras lokala produkter', 4, (SELECT id FROM stores s WHERE store_name = 'Coop Mölndalsvägen'),(SELECT id FROM users u WHERE email = 'user3@gmail.com'))

`);

    console.log("Database successfully populated with data");
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
};

const createHashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);

  return hashedpassword;
};

seedStoresDb();
