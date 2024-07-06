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

router.get("/api/users/:id", getUser);

router.get('/auth/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected endpoint', user: req.user });
});





module.exports = router;