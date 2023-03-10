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
const jwt = require("jsonwebtoken");

exports.getAllStores = async (req, res) => {
  const offset = req.query.offset;
  const limit = req.query.limit;

  const [stores, metadata] = await sequelize.query(
    "SELECT * FROM stores s LIMIT $limit OFFSET $offset",
    {
      bind: {
        offset: offset,
        limit: limit,
      },
    }
  );
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
  const { storeName, givenAddress, description, cityId } = req.body;

  const [newStoreId] = await sequelize.query(
    "INSERT INTO stores (store_name, address, description, fk_citys_id, fk_users_id) VALUES ($storeName, $givenAddress, $description, $cityId, $userId);",
    {
      bind: {
        storeName: storeName,
        givenAddress: givenAddress,
        description: description,
        cityId: cityId,
        userId: req.user.userId,
      },
      type: QueryTypes.INSERT,
    }
  );

  return res
    .setHeader(
      "Location",
      `${req.protocol}://${req.headers.host}/api/v1/stores/${newStoreId}`
    )
    .sendStatus(201);
};

exports.createNewReviewForStoreById = async (req, res) => {
  const storeId = req.params.storeId;
  const { reviewContent, rating } = req.body;
  const userId = req.user.userId;

  const [newReviewId] = await sequelize.query(
    "INSERT INTO reviews (review_content, rating, fk_stores_id, fk_users_id) VALUES ($reviewContent, $rating, $storeId, $userId);",
    {
      bind: {
        reviewContent: reviewContent,
        rating: rating,
        storeId: storeId,
        userId: userId,
      },
      type: QueryTypes.INSERT,
    }
  );

  return res
    .setHeader(
      "Location",
      `${req.protocol}://${req.headers.host}/api/v1/stores/${newReviewId}`
    )
    .sendStatus(201);
};

exports.updateStoreById = async (req, res) => {
  const storeId = req.params.storeId;
  const loggedInUserId = req.user.userId;
  const { name, address, description, cityId } = req.body;

  const [storeToUpdate, storeMetadata] = await sequelize.query(
    "SELECT * FROM stores WHERE id = $storeId",
    {
      bind: {
        storeId,
      },
    }
  );

  if (!storeToUpdate) {
    throw new NotFoundError("We can't find the store you are looking for");
  }

  if (
    storeToUpdate[0].fk_users_id !== loggedInUserId &&
    req.user.role !== userRoles.ADMIN
  ) {
    throw new UnauthorizedError(
      "Sorry, you don't have access to update this store's info"
    );
  }

  const [updateStore, metadata] = await sequelize.query(
    "UPDATE stores SET store_name = $name, address = $address, fk_citys_id = $cityId, description = $description WHERE id = $storeId RETURNING *;",
    {
      bind: {
        storeId: storeId,
        name: name,
        address: address,
        cityId: cityId,
        description: description,
      },
      type: QueryTypes.UPDATE,
    }
  );
  return res.json(updateStore);
  // }
};

exports.deleteStoreById = async (req, res) => {
  const storeId = req.params.storeId;
  const loggedInUserId = req.user.userId;

  const [store, metadata] = await sequelize.query(
    "SELECT * FROM stores s WHERE id = $storeId LIMIT 1",
    {
      bind: {
        storeId: storeId,
      },
    }
  );

  if (!store) {
    throw new NotFoundError("We could not find the store you are looking for");
  }

  if (
    store[0].fk_users_id !== loggedInUserId &&
    req.user.role !== userRoles.ADMIN
  ) {
    throw new UnauthorizedError(
      "You can't delete this store! You don't own the store and are no admin."
    );
  } else {
    await sequelize.query(
      "DELETE FROM reviews WHERE fk_stores_id = $storeId RETURNING *;",
      {
        bind: {
          storeId,
        },
        type: QueryTypes.DELETE,
      }
    );

    await sequelize.query(
      "DELETE FROM stores WHERE id = $storeId RETURNING *;",
      {
        bind: {
          storeId,
        },
        type: QueryTypes.DELETE,
      }
    );
    return res.sendStatus(204);
  }
};

exports.getAllStoresByCityId = async (req, res) => {
  const cityId = req.params.cityId;
  const offset = req.query.offset;
  const limit = req.query.limit;

  const [stores, metadata] = await sequelize.query(
    "SELECT * FROM stores s WHERE fk_citys_id = $cityId LIMIT $limit OFFSET $offset",
    {
      bind: {
        cityId: cityId,
        limit: limit,
        offset: offset,
      },
    }
  );

  if (!stores) {
    throw new NotFoundError("We could not find any stores in this city");
  }

  return res.json(stores);
};
