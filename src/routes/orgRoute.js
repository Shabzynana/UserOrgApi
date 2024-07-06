const router = require('express').Router();


const { getallOrg, getAOrg, 
  } = require('../controllers/orgController');

const { authenticateToken } = require('../middlewares/authMiddleware');


router.get('/api/organisations', authenticateToken, getallOrg)

router.get("/api/organisations/:orgId", getAOrg);

  
  
  
  
  module.exports = router;