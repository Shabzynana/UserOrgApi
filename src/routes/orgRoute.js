const router = require('express').Router();


const { getallOrg, getAOrg, createOrg, addUserToOrg, 
  } = require('../controllers/orgController');

const { authenticateToken } = require('../middlewares/authMiddleware');


router.get('/api/organisations', authenticateToken, getallOrg)

router.get("/api/organisations/:orgId", authenticateToken, getAOrg);

router.post("/api/organisations", authenticateToken, createOrg);

router.post('/api/organisations/:orgId/users', addUserToOrg);
  
  
  
  module.exports = router;