const { userRoles } = require("../constants/users");
const { sequelize } = require("../database/config");
const { UnauthorizedError, NotFoundError } = require("../utils/errors");
const { QueryTypes } = require("sequelize");

exports.getReviewById = async (req, res) => {
  // Grab the review id and place in local variable
  const givenReviewId = req.params.reviewId;

  // Check if user is admin
  if (req.user.role !== userRoles.ADMIN) {
    throw new UnauthorizedError("Unauthorized Access");
  }

  // Get the reviews from the database
  const [review, metadata] = await sequelize.query(
    "SELECT * FROM reviews WHERE id = $givenReviewId ",
    {
      bind: { givenReviewId: givenReviewId },
      type: QueryTypes.SELECT,
    }
  );

  // Not found error (ok since since route is authenticated)
  if (!review) {
    throw new NotFoundError("That review does not exist");
  }

  // Send back user info
  return res.json(review);
};

exports.deleteReviewById = async (req, res) => {
  // Grab the review id and place in local variable
  const givenReviewId = req.params.reviewId;
  // Grab the logged in user id and place in local variable
  const loggedInUserId = req.user.userId;
  
  const [review, metadata] = await sequelize.query(
    "SELECT * FROM reviews WHERE id = $givenReviewId",
    {
      bind: { givenReviewId },
      type: QueryTypes.SELECT,
    }
  );

   
  //check if review exists
  if (!review) throw new NotFoundError("There is no such review")
 
  
  // Check if review belongs to logged-in user 
  if (review.fk_users_id !== loggedInUserId && req.user.role !== userRoles.ADMIN) {
    throw new UnauthorizedError("You can't delete this review!");
  }

   
  // Delete the review from the database
  await sequelize.query(
    "DELETE FROM reviews WHERE id = $givenReviewId",
    
    {
      bind: {
        givenReviewId
      },
      type: QueryTypes.DELETE,
    }
  );

   
  return res.sendStatus(204);
 
};


exports.getAllReviewsByUserId = async (req, res) => {
  const userId = req.params.userId;
  const [reviews, metadata] = await sequelize.query(
    "SELECT * FROM reviews r WHERE fk_users_id = $userId",
    {
      bind: { userId },
      type: QueryTypes.SELECT,
    }
  );

  if (!reviews) {
    throw new NotFoundError("We could not find any reviews by this user");
  }
  return res.json(reviews);
};
