const { body } = require("express-validator");

exports.registerSchema = [
  body("email").isEmail().withMessage("You must provide a valid email address"),
  body("password")
    .not()
    .isEmpty()
    .isLength({ min: 6 })
    .withMessage(
      "You must provide a password that is at least 6 characters long"
    ),
];

exports.loginSchema = [
  body("email").isEmail().withMessage("You must provide a valid email address"),
  body("password").not().isEmpty().withMessage("You must provide a password"),
];

exports.storeSchema = [
  body("storeName")
    .isString()
    .not()
    .isEmpty()
    .isLength({ min: 3 })
    .withMessage("You must give your new store a name"),
  body("givenAddress")
    .isString()
    .not()
    .isEmpty()
    .isLength({ min: 5 })
    .withMessage("You must provide an address"),
  body("cityId").isInt().not().isEmpty(),
];

exports.reviewSchema = [
  body("reviewContent").isString(),
  body("rating")
    .isInt()
    .not()
    .isEmpty()
    .withMessage("You must give this store a rating"),
];
