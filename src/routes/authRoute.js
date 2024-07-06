const router = require('express').Router();


const { authhome, 
    register,
    login,
    getUser,
  } = require('../controllers/authController');

const { authenticateToken } = require('../middlewares/authMiddleware');
const { userValidationRules, validate } = require('../utils/error');


router.get("/auth/authhome", authhome);

router.post("/auth/register", userValidationRules(), validate, register);

router.post("/auth/login", login);

router.get("/api/users/:id", authenticateToken, getUser);






module.exports = router;