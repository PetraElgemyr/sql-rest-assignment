/*
Skapa ny store 
req.body ska innehålla info som name, adress, cityid och userid
INSERT INTO stores  (store_name, address, fk_citys_id, fk_users_id) VALUES ('', '', city id, user id) ON CONFLICT DO NOTHING;
*/
const { userRoles } = require("../constants/users");
const { sequelize } = require("../database/config");
const {
  UnauthorizedError,
  NotFoundError,
  BadRequestError,
} = require("../utils/errors");
const { QueryTypes } = require("sequelize");

exports.getAllStores = async (req, res) => {
  const [stores, metadata] = await sequelize.query("SELECT * FROM stores s ");
  return res.json(stores);
};

exports.getStoreById = async (req, res) => {
  const givenStoreId = req.params.storeId;

  const [store, metadata] = await sequelize.query(
    "SELECT * FROM stores s WHERE id = $givenStoreId",
    {
      bind: {
        givenStoreId,
      },
      type: QueryTypes.SELECT,
    }
  );

  if (!store) {
    throw new BadRequestError("There is no store with that id");
  }

  return res.json(store);
};

exports.addNewStore = async (req, res) => {
  const { storeName, givenAddress, cityId } = req.body;

  //fk_user_id is automatically the userId from the token user
  const [newStoreId] = await sequelize.query(
    "INSERT INTO stores (store_name, address, fk_citys_id, fk_users_id) VALUES ($storeName, $givenAddress, $cityId, $userId);",
    {
      bind: {
        storeName: storeName,
        givenAddress: givenAddress,
        cityId: cityId,
        userId: req.user.userId,
      },
      type: QueryTypes.INSERT, // returns ID of created row
    }
  );

  // prettier-ignore
  return res
    .setHeader('Location', `${req.protocol}://${req.headers.host}/api/v1/stores/${newStoreId}`)
    .sendStatus(201)
};

exports.createNewReviewForStoreById = async (req, res) => {
  const storeId = req.params.storeId;
  const { reviewContent, rating, userId } = req.body;

  const [newReviewId] = await sequelize.query(
    "INSERT INTO reviews (review_content, rating, fk_stores_id, fk_users_id) VALUES ($reviewContent, $rating, $storeId, $userId);",
    {
      bind: {
        reviewContent: reviewContent,
        rating: rating,
        storeId: storeId,
        userId: userId,
      },
      type: QueryTypes.INSERT, // returns ID of created row
    }
  );

  // prettier-ignore
  return res
    .setHeader('Location', `${req.protocol}://${req.headers.host}/api/v1/stores/${newReviewId}`)
    .sendStatus(201)
};

exports.updateStoreById = async (req, res) => {};

exports.deleteStoreById = async (req, res) => {
  const storeId = req.params.storeId;
  const loggedInUserId = req.user.userId;

  //Sequal raw:     DELETE FROM stores WHERE id =  storeId ;

  const [stores, metadata] = await sequelize.query(
    "SELECT id FROM stores s WHERE fk_users_id = $loggedInUserId",
    {
      bind: {
        loggedInUserId: storeId,
      },
      type: QueryTypes.SELECT,
    }
  );

  if (!stores && req.user.role !== userRoles.admin) {
    throw new UnauthorizedError(
      "You don't own any stores and you are not an admin, so you can't delete stores"
    );
  }

  //om det finns stores på användaren
  if (stores) {
    const [deleteStore, metadata] = await sequelize.query(
      "DELETE FROM stores WHERE id =  $storeId",
      {
        bind: {
          storeId,
        },
        type: QueryTypes.DELETE,
      }
    );

    await sequelize.query("DELETE FROM reviews WHERE id = $storeId ", {
      bind: {
        storeId,
      },
      type: QueryTypes.DELETE,
    });
  }

  return res.sendStatus(204);
};

exports.getAllStoresByCityId = async (req, res) => {
  const cityId = req.params.cityId;

  const [stores, metadata] = await sequelize.query(
    "SELECT * FROM stores s WHERE fk_citys_id = $cityId",
    {
      bind: {
        cityId: cityId,
      },
      type: QueryTypes.SELECT, // returns ID of created row
    }
  );

  if (!stores) {
    throw new NotFoundError("We could not find any stores in this city");
  }

  return res.json(stores);
};
