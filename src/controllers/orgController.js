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
  
      res.status(200).json({
        status: 'success',
        message: 'Organisations retrieved successfully',
        data: {
            'organisations': organisations
        },
      });
    } catch (error) {
      res.status(500).json({ 'error': 'You are not doing something right' });
    }
};


async function getAOrg(req, res, next)  {
    try {

        const {orgId} = req.params
        const organisation = await prisma.organisation.findUnique({
            where: { orgId :(orgId) },
            include: {
                users: true
            }
        });

        if (!organisation) {
          res.status(404).json({ error: 'Organisation not found' });
        }
        
        console.log(organisation.users)
        const isUserInOrg = organisation.users.some(user => user.user_Id === req.user.id);
        console.log(isUserInOrg)

        if (!isUserInOrg) {
          return res.status(403).json({ message: 'Access denied' });
        }
         else {
          res.status(200).json({
            status: 'success',
            message: 'Organisation retrieved successfully',
            data: {
              "orgId": organisation.orgId,
              "name": organisation.name,
              "description": organisation.description, }   
        });
        }
        
        } catch (error) {
          // next(error)
          res.status(500).json({ 'error': 'You are not doing something right' });
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



async function addUserToOrg(req, res, next)  {    
    const { orgId } = req.params;
    const { userId } = req.body;
  
    try {
      // Check if the organisation exists
      const organisation = await prisma.organisation.findUnique({ where: { orgId } });
      if (!organisation) {
        return res.status(404).json({ message: 'Organisation not found' });
      }
  
      // Check if the user exists
      const user = await prisma.user.findUnique({ 
        where: { userId } });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Add the user to the organisation
      await prisma.orgUser.create({
        data: {
          user_Id: userId,
          org_Id: orgId
        }
      });
  
      res.status(201).json({
        status: 'success',
        message: 'User added to the organisation successfully'
      });
    } catch (error) {
      // next(error)
      res.status(500).json({'error': 'You are not doing something right' });
    }
  };





  module.exports = {
   getallOrg, getAOrg, createOrg, addUserToOrg
  
    };
