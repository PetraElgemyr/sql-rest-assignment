const { userRoles } = require("../constants/users");
const { NotFoundError, UnauthorizedError } = require("../utils/errors");
const { sequelize } = require("../database/config");
const { QueryTypes } = require("sequelize");

exports.deleteUserById = async (req, res) => {
  // Grab the user id and place in local variable
  const givenUserId = req.params.userId;

  // Check if user is admin || user is requesting to delete themselves
  if (givenUserId != req.user?.userId && req.user.role !== userRoles.ADMIN) {
    throw new UnauthorizedError("Unauthorized Access");
  }

  // Delete the user from the database
  const [results, metadata] = await sequelize.query(
    "DELETE FROM users WHERE id = $givenUserId RETURNING *",
    {
      bind: { givenUserId },
    }
  );

  // Not found error (ok since since route is authenticated)
  if (!results || !results[0])
    throw new NotFoundError("That user does not exist");

  // Send back user info
  return res.sendStatus(204);
};
