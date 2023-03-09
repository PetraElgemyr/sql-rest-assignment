const { userRoles } = require("../constants/users");
const { NotFoundError, UnauthorizedError } = require("../utils/errors");
const { sequelize } = require("../database/config");
const { QueryTypes } = require("sequelize");

exports.getAllUsers = async (req, res) => {
  const offset = req.query.offset;
  const limit = req.query.limit;

  if (req.user.role !== userRoles.ADMIN) {
    throw new UnauthorizedError(
      "Unauthorized Access! Only admins can do that!"
    );
  }
  if (req.user.role === userRoles.ADMIN) {
    const [users, metadata] = await sequelize.query(
      "SELECT * FROM users u LIMIT $limit OFFSET $offset",
      {
        bind: {
          offset: offset,
          limit: limit,
        },
      }
    );

    return res.json(users);
  }
};

exports.getUserById = async (req, res) => {
  const userId = req.params.userId;

  const [users, metadata] = await sequelize.query(
    "SELECT id, email FROM users u WHERE id = $userId",
    {
      bind: { userId: userId },
      type: QueryTypes.SELECT,
    }
  );

  if (!users) {
    throw new NotFoundError("We could not find this user");
  }
  return res.json(users);
};

exports.deleteUserById = async (req, res) => {
  const givenUserId = req.params.userId;

  const [userExists, metadata] = await sequelize.query(
    "SELECT * FROM users WHERE id = $givenUserId LIMIT 1 ",
    {
      bind: { givenUserId },
    }
  );

  if (!userExists[0]) {
    throw new NotFoundError("That user does not exist");
  }

  if (
    userExists[0].id !== req.user?.userId &&
    req.user.role !== userRoles.ADMIN
  ) {
    throw new UnauthorizedError("Unauthorized access to delete user");
  }

  await sequelize.query(
    "DELETE FROM reviews WHERE fk_users_id = $givenUserId",
    {
      bind: { givenUserId },
    }
  );

  await sequelize.query(
    "UPDATE stores SET fk_users_id = NULL WHERE fk_users_id = $givenUserId",
    {
      bind: { givenUserId },
    }
  );

  await sequelize.query("DELETE FROM users WHERE id = $givenUserId", {
    bind: { givenUserId },
  });

  return res.sendStatus(204);
};
