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

