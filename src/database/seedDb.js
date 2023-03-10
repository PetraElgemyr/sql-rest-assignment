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
      `INSERT INTO citys (city_name) VALUES ('Stockholm'), ('Malm??'), ('G??teborg')`
    );

    await sequelize.query(`INSERT INTO stores 
    (store_name, address, description, fk_citys_id, fk_users_id ) 
    VALUES 
    ('Ica Supermarket Alvikstorg', 'Gustavslundsv??gen 22', 'Vardag eller fest? Vi har det du beh??ver. I butiken fyller vi varje dag p?? med nya f??rskvaror, frukt och gr??nt, mejeriprodukter och annat gott som f??rgyller din matvardag. I v??r charkavdelning hittar du ostar, salami och skinkor f??r picknick, mys eller fest. Vi ses i butiken!', (SELECT id FROM citys c WHERE city_name = 'Stockholm'), (SELECT id FROM users u WHERE email = 'hazan@gmail.com')),
    ('Lidl G??teborg', 'Kungsgatan 16', 'Vi pressar ner priserna utan att kvalit??n ska ta stryk. F??r oss ??r det viktigt att bidra till h??llbar och ansvarsfull odling av r??varor. D??rf??r satsar vi bland annat p?? v??rt ekologiska sortiment som forts??tter att v??xa. V??lkommen in till oss!', (SELECT id FROM citys c WHERE city_name = 'G??teborg'), (SELECT id FROM users u WHERE email = 'ksenia.ivanova@gmail.com')),
    ('Lidl Medborgarplatsen', 'Folkungagatan 51', 'En stor butik p?? liten yta mitt p?? S??dermalm. Lidl Medborgarplatsen str??var efter att vara ett av de billigaste alternativen p?? marknaden utan att f??rlora kvalitet.', (SELECT id FROM citys c WHERE city_name = 'Stockholm'), (SELECT id FROM users u WHERE email = 'hazan@gmail.com')), 
    ('Coop H??torget', 'T-station H??torget', 'Coop H??torget har stort utbud av allt som kan beh??vas. Mitt i Stockholm ligger vi med fokus p?? att det ska vara enkelt att snabbt handla hos oss p??v??g hem fr??n jobbet utan n??got kr??ngel. V??lkommen in hos oss!', (SELECT id FROM citys c WHERE city_name = 'Stockholm'), (SELECT id FROM users u WHERE email = 'hazan@gmail.com')), 
    ('ICA Supermarket Majorna', 'Karl Johansgatan 21', 'Ica ??r butiken d??r du kan handla mat av h??gsta kvalitet till b??sta pris. Vi har flera hundra butiker i Sverige d??r svenska och ekologiska produkter samsas med utvalda utl??ndska delikatesser.', (SELECT id FROM citys c WHERE city_name = 'G??teborg'), (SELECT id FROM users u WHERE email = 'petra.elgemyr@gmail.com')),
    ('Stora Coop Stadion', 'Stadiongatan 24', 'Coop har alltid fokus p?? h??llbar ekologisk mat till ett bra pris, utan att minska kvaliten.', (SELECT id FROM citys c WHERE city_name = 'Malm??'), (SELECT id FROM users u WHERE email = 'hazan@gmail.com')),
    ('Ica Supermarket Hansa', 'Stora Nygatan','Ica Hansa, n??rbutik lagom n??ra och enkelt att hitta hit.', (SELECT id FROM citys c WHERE city_name = 'Malm??'), (SELECT id FROM users u WHERE email = 'ksenia.ivanova@gmail.com')),
    ('Hemk??p Triangeln', 'S??dra F??rstadsgatan 58','Mitt i k??pcentrumet ligger vi. Hj??rtat av Malm??, v??lkommen hit!', (SELECT id FROM citys c WHERE city_name = 'Malm??') , (SELECT id FROM users u WHERE email = 'petra.elgemyr@gmail.com')), 
    ('ICA Supermarket Olskroken', 'Redbergsv??gen 14','Ica Olskroken finns n??r du beh??ver och d??r du beh??ver. Vardag eller helg s?? har vi det du s??ker.', (SELECT id FROM citys c WHERE city_name = 'G??teborg'), (SELECT id FROM users u WHERE email = 'petra.elgemyr@gmail.com')),
    ('Coop M??lndalsv??gen', 'M??lndalsv??gen 1', 'En v??lsorterad butik med matbar och deli.', (SELECT id FROM citys c WHERE city_name = 'G??teborg'), (SELECT id FROM users u WHERE email = 'ksenia.ivanova@gmail.com'))`);

    await sequelize.query(`INSERT INTO reviews (review_content, rating, fk_stores_id, fk_users_id) VALUES 
    ('Coop ??r en av de st??rre matbutikerna och har ett stort utbud av matvaror. Jag gillar deras sortiment av ekologiska och h??lsosamma produkter, och ocks?? deras fokus p?? h??llbarhet.', 4, (SELECT id FROM stores s WHERE store_name = 'Coop H??torget'),(SELECT id FROM users u WHERE email = 'petra.elgemyr@gmail.com')),
    ('Coop: Jag har handlat p?? Coop i flera ??r och jag ??r alltid n??jd med deras utbud och kvalitet p?? matvaror.', 5, (SELECT id FROM stores s WHERE store_name = 'Coop H??torget'),(SELECT id FROM users u WHERE email = 'user1@gmail.com')),
    ('ICA N??ra ??r en liten och personlig matbutik som erbjuder bra kvalitet p?? matvaror. Jag gillar att de ocks?? har ett utbud av svenska produkter.', 4, (SELECT id FROM stores s WHERE store_name = 'Ica Supermarket Alvikstorg'),(SELECT id FROM users u WHERE email = 'user2@gmail.com')),
    ('F??r liten butik med d??ligt utbud. Ok priser.', 2, (SELECT id FROM stores s WHERE store_name = 'Ica Supermarket Alvikstorg'),(SELECT id FROM users u WHERE email = 'user3@gmail.com')),
    ('Billigt men en aningen liten butik', 3, (SELECT id FROM stores s WHERE store_name = 'Lidl G??teborg'),(SELECT id FROM users u WHERE email = 'user2@gmail.com')),
    ('B??sta butiken att komplementhandla p??! S?? billig och fr??sch frukt och gr??nt-avdelning', 5, (SELECT id FROM stores  s WHERE store_name = 'Lidl G??teborg'),(SELECT id FROM users u WHERE email = 'user1@gmail.com')),
    ('Bra med veckans tema! Superkul id?? och varierande varor', 5, (SELECT id FROM stores s WHERE store_name = 'Lidl Medborgarplatsen'),(SELECT id FROM users u WHERE email = 'user3@gmail.com')),
    ('Utplockat p?? s??ndagar', 1, (SELECT id FROM stores s WHERE store_name = 'Lidl Medborgarplatsen'),(SELECT id FROM users u WHERE email = 'user2@gmail.com')),
    ('N??ra till kollektivtrafiken s?? l??tt att hitta dit. Okej priser!', 3, (SELECT id FROM stores s WHERE store_name = 'ICA Supermarket Majorna'),(SELECT id FROM users u WHERE email = 'user2@gmail.com')),
    ('Bra alternativ p?? onlineshoppen men lite dyrt!', 4, (SELECT id FROM stores s WHERE store_name = 'ICA Supermarket Majorna'),(SELECT id FROM users u WHERE email = 'user1@gmail.com')),
    ('Bra deli och charkdisk', 4, (SELECT id FROM stores s WHERE store_name = 'Stora Coop Stadion'),(SELECT id FROM users u WHERE email = 'user3@gmail.com')),
    ('Dyrt f??r en pension??r!', 2, (SELECT id FROM stores s WHERE store_name = 'Stora Coop Stadion'),(SELECT id FROM users u WHERE email = 'user2@gmail.com')),
    ('Okej, inget mer ??n s??', 3, (SELECT id FROM stores WHERE store_name = 'Ica Supermarket Hansa'),(SELECT id FROM users u WHERE email = 'user3@gmail.com')),
    ('??LSKAR Hansa som ligger precis bredvid mig och billig!', 5, (SELECT id FROM stores s WHERE store_name = 'Ica Supermarket Hansa'),(SELECT id FROM users u WHERE email = 'user1@gmail.com')),
    ('H??ga priser som allt annat i k??pcentrumet...', 2, (SELECT id FROM stores s WHERE store_name = 'Hemk??p Triangeln'),(SELECT id FROM users u WHERE email = 'user2@gmail.com')),
    ('Stor med j??ttebra utbud. Hittar alltid det jag beh??ver h??r!!', 5, (SELECT id FROM stores s WHERE store_name = 'Hemk??p Triangeln'),(SELECT id FROM users u WHERE email = 'user3@gmail.com')),
    ('S?????? trevlig personal, alltid schyssta', 5, (SELECT id FROM stores s WHERE store_name = 'ICA Supermarket Olskroken' ),(SELECT id FROM users u WHERE email = 'user3@gmail.com')),
    ('F?? kassor s?? det ??r alltid k?? h??r tyv??rr', 3, (SELECT id FROM stores s WHERE store_name = 'ICA Supermarket Olskroken'),(SELECT id FROM users u WHERE email = 'user1@gmail.com')),
    ('Jag gillar deras veckans erbjudande!', 4, (SELECT id FROM stores s WHERE store_name = 'Coop M??lndalsv??gen'),(SELECT id FROM users u WHERE email = 'user2@gmail.com')),
    ('Jag uppskattar deras sortiment av f??rskvaror och deras lokala produkter', 4, (SELECT id FROM stores s WHERE store_name = 'Coop M??lndalsv??gen'),(SELECT id FROM users u WHERE email = 'user3@gmail.com'))

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
