const { userRoles } = require("../constants/users");
const { sequelize } = require("../database/config");
const { UnauthorizedError, NotFoundError } = require("../utils/errors");
const { QueryTypes } = require("sequelize");

exports.getReviewById = async (req, res) => {
  const givenReviewId = req.params.reviewId;

  if (req.user.role !== userRoles.ADMIN) {
    throw new UnauthorizedError("Unauthorized Access");
  }

  const [review, metadata] = await sequelize.query(
    "SELECT * FROM reviews WHERE id = $givenReviewId ",
    {
      bind: { givenReviewId: givenReviewId },
      type: QueryTypes.SELECT,
    }
  );

  if (!review) {
    throw new NotFoundError("That review does not exist");
  }

  return res.json(review);
};

exports.deleteReviewById = async (req, res) => {
  const givenReviewId = req.params.reviewId;
  const loggedInUserId = req.user.userId;

  const [review, metadata] = await sequelize.query(
    "SELECT * FROM reviews WHERE id = $givenReviewId",
    {
      bind: { givenReviewId },
      type: QueryTypes.SELECT,
    }
  );

  if (!review) throw new NotFoundError("There is no such review");

  if (
    review.fk_users_id !== loggedInUserId &&
    req.user.role !== userRoles.ADMIN
  ) {
    throw new UnauthorizedError("You can't delete this review!");
  }

  await sequelize.query(
    "DELETE FROM reviews WHERE id = $givenReviewId",

    {
      bind: {
        givenReviewId,
      },
      type: QueryTypes.DELETE,
    }
  );

  return res.sendStatus(204);
};

exports.getAllReviewsByUserId = async (req, res) => {
  const userId = req.params.userId;
  const offset = req.query.offset;
  const limit = req.query.limit;

  const [reviews, metadata] = await sequelize.query(
    "SELECT * FROM reviews r WHERE fk_users_id = $userId LIMIT $limit OFFSET $offset",
    {
      bind: {
        userId: userId,
        offset: offset,
        limit: limit,
      },
    }
  );

  if (!reviews) {
    throw new NotFoundError("We could not find any reviews by this user");
  }
  return res.json(reviews);
};

exports.getAllReviewsByStoreId = async (req, res) => {
  const storeId = req.params.storeId;
  const offset = req.query.offset;
  const limit = req.query.limit;

  const [reviews, metadata] = await sequelize.query(
    "SELECT * FROM reviews r WHERE fk_stores_id = $storeId LIMIT $limit OFFSET $offset",
    {
      bind: {
        storeId: storeId,
        offset: offset,
        limit: limit,
      },
    }
  );

  if (!reviews) {
    throw new NotFoundError("We could not find any reviews by this user");
  }

  return res.json(reviews);
};
