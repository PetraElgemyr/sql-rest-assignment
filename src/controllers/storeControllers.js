/*
Skapa ny store 
req.body ska innehålla info som name, adress, cityid och userid
INSERT INTO stores  (store_name, address, fk_citys_id, fk_users_id) VALUES ('', '', city id, user id) ON CONFLICT DO NOTHING;
*/
const { userRoles } = require("../constants/users");
const { sequelize } = require("../database/config");
const { UnauthorizedError, NotFoundError } = require("../utils/errors");
const { QueryTypes } = require("sequelize");

exports.addNewStore = async (req, res) => {
  const { storeName, givenAddress, cityId, userId } = req.body;

  const [newStoreId] = await sequelize.query(
    "INSERT INTO stores (store_name, address, fk_citys_id, fk_users_id) VALUES ($storeName, $givenAddress, $cityId, $userId);",
    {
      bind: {
        storeName: storeName,
        givenAddress: givenAddress,
        cityId: cityId,
        userId: userId,
      },
      type: QueryTypes.INSERT, // returns ID of created row
    }
  );

  // prettier-ignore
  return res
    .setHeader('Location', `${req.protocol}://${req.headers.host}/api/v1/stores/${newStoreId}`)
    .sendStatus(201)
};

exports.deleteStoreById = async (req, res) => {
  //   const storeId = req.params.storeId;
  //Sequal raw:     DELETE FROM stores WHERE id =  storeId ;
  //   if (req.user.role !== userRoles.admin) {
  //     const [userListRole, userListRoleMeta] = await sequelize.query(
  //       `
  // 			SELECT r.role_name
  // 			FROM users_lists ul
  // 				JOIN roles r ON r.id = ul.fk_roles_id
  // 			WHERE ul.fk_lists_id = $listId AND fk_users_id = $userId
  // 			LIMIT 1
  // 		`,
  //       {
  //         bind: { listId: listId, userId: req.user.userId },
  //         type: QueryTypes.SELECT,
  //       }
  //     );
  //     if (!userListRole) {
  //       throw new NotFoundError("We could not find the list you are looking for");
  //     }
  //     // @ts-ignore
  //     if (userListRole?.role_name !== listRoles.owner) {
  //       throw new UnauthorizedError(
  //         "You do not have permission to delete this list"
  //       );
  //     }
  //   }
  //   await sequelize.query(
  //     `DELETE FROM users_lists WHERE fk_lists_id = $listId;`,
  //     {
  //       bind: { listId: listId },
  //       type: QueryTypes.DELETE,
  //     }
  //   );
  //   await sequelize.query(`DELETE FROM todos WHERE fk_lists_id = $listId;`, {
  //     bind: { listId: listId },
  //   });
  //   await sequelize.query(`DELETE FROM lists WHERE id = $listId;`, {
  //     bind: { listId: listId },
  //     type: QueryTypes.DELETE,
  //   });
  //   return res.sendStatus(204);
};

/* raw sql text
INSERT INTO reviews (review_content, rating, fk_stores_id, fk_users_id) VALUES ('Coop: Jag har handlat på Coop i flera år och jag är alltid nöjd med deras utbud och kvalitet på matvaror.', 
5, 6, 5 ); */

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

exports.getAllStores = async (req, res) => {
  const [stores, metadata] = await sequelize.query('SELECT * FROM stores s ' )
  return res.json(stores)
}

