const { userRoles } = require("../constants/users");
const { sequelize } = require("../database/config");
const { UnauthorizedError, NotFoundError } = require("../utils/errors");
const { QueryTypes } = require("sequelize");
const { NOTFOUND } = require("sqlite3");


/* 
exports.getAllReviewsForStore = async (req, res) => {

} */

exports.getAllReviewsByUserId = async (req, res) => {

const userId = req.params.userId
const [reviews, metadata] = await sequelize.query('SELECT * FROM reviews r WHERE fk_users_id = $userId',
{
    bind:{userId},
    type: QueryTypes.SELECT  

})

if (!reviews) {

    throw new NotFoundError('We could not find any reviews by this user')
    
}
return res.json(reviews)

  
}

exports.deleteReviewById = async (req, res) => {

      // Grab the review id and place in local variable

    const givenReviewId = req.params.rewiewId


    // Delete the review from the database

    const [reviews, metadata] = await sequelize.query("DELETE FROM reviews WHERE id = $givenReviewId RETURNING * ",
    {
    bind: { givenReviewId },
    }
    );

    // Not found error (ok since since route is authenticated)
  if (!results || !results[0])
  throw new NotFoundError("That review does not exist");

// Send back review info
return res.sendStatus(204);
};


