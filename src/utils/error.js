const { body, validationResult } = require('express-validator');
const { prisma } = require('../../prisma/client');



const userValidationRules = () => {
    return [
      body('email').isEmail().withMessage('Must be a valid email')
        .notEmpty().withMessage('Email cannot be empty')
        .custom(async (email) => {
          const existingUser = await prisma.user.findUnique({ where: { email } });
          if (existingUser) {
            throw new Error('Email already in use');
          }
          return true;
        }),
      // body('userId').custom(async (userId) => {
      //   const existingUserId = await prisma.user.findUnique({ where: { userId } });
      //   if (existingUserId) {
      //     throw new Error('UserId already exist!');
      //   }
      //   return true;
      // }),
      body('firstName').notEmpty().withMessage('First name cannot be empty')
        .isLength({ max: 64 }).withMessage('Must be at most 64 characters long'),
      body('lastName').notEmpty().withMessage('Last name cannot be empty')
        .isLength({ max: 64 }).withMessage('Must be at most 64 characters long'),
      body('password').notEmpty().withMessage('Password cannot be empty')
        .isLength({ max: 64 }).withMessage('Must be at most 64 characters long'),
      body('phone').optional().isLength({ max: 20 }).withMessage('Must be at most 20 characters long'),
        

    ];
  };

  const organisationValidationRules = () => {
    return [
      body('name').notEmpty().withMessage('Name cannot be empty')
        .isLength({ max: 128 }).withMessage('Must be at most 128 characters long'),
      body('description').optional().isLength({ max: 256 }).withMessage('Must be at most 256 characters long'),
    ];
  };  



const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ field: err.path, message: err.msg }));

    return res.status(422).json({
        errors: extractedErrors,
    });
};


module.exports = {
  userValidationRules, organisationValidationRules,validate,
}