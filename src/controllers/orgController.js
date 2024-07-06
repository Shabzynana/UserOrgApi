const { prisma } = require('../../prisma/client');



async function getallOrg(req, res, next)  {
    try {
      const organisations = await prisma.organisation.findMany({
        where: {
          users: {
            some: {
              user_Id: req.user.id,
            },
          },
        },
      });
  
      res.json({
        status: 'success',
        message: 'Organisations retrieved successfully',
        data: {
            'orrganisations': [organisations]
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
};


async function getAOrg(req, res, next)  {
    try {

        const {orgId} = req.params
        const organisations = await prisma.organisation.findMany({
            where: { orgId :(orgId) },
          
        });
    
        res.json({
            status: 'success',
            message: 'Organisations retrieved successfully',
            data: organisations    
        });
        } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        }
};


async function createOrg(req, res, next)  {
  const { name, description } = req.body;

  try {
    const organisation = await prisma.organisation.create({
      data: {
        name,
        description,
        users: {
          create: {
            user: {
              connect: {
                userId: req.user.id,
              },
            },
          },
        },
      },
    });

    res.status(201).json({
      status: 'success',
      message: 'Organisation created successfully',
      data: organisation,
    });
  } catch (error) {
    res.status(400).json({
        "status": "Bad Request",
        "message": "Client error",
        "statusCode": 400
    });
  }
};

// router.post('/api/organisations/:orgId/users', authenticateToken, addUserToOrgValidationRules(), validate, async (req, res) => {
//     const { orgId } = req.params;
//     const { userId } = req.body;
  
//     try {
//       // Check if the organisation exists
//       const organisation = await prisma.organisation.findUnique({ where: { orgId } });
//       if (!organisation) {
//         return res.status(404).json({ message: 'Organisation not found' });
//       }
  
//       // Check if the user exists
//       const user = await prisma.user.findUnique({ where: { userId } });
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
  
//       // Add the user to the organisation
//       await prisma.orgUser.create({
//         data: {
//           user_Id: userId,
//           org_Id: orgId
//         }
//       });
  
//       res.status(201).json({
//         status: 'success',
//         message: 'User added to the organisation successfully'
//       });
//     } catch (error) {
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });





  module.exports = {
   getallOrg, getAOrg
  
    };
