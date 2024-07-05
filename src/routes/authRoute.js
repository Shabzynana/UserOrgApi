const router = require('express').Router();


const { authhome, 
    register,
    login,
    logout,
    current_user,
  } = require('../controllers/authController');

// const { authMiddleware } = require('../middlewares/authMiddleware');
const { userValidationRules, validate } = require('../utils/error');


router.get("/authhome", authhome);

router.post("/register", userValidationRules(), validate, register);

router.post("/login", login);

router.post("/logout", logout);

// router.get("/current_user", authMiddleware, current_user);





module.exports = router;