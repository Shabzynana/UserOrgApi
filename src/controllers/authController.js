// routes/users.js
// const jwt = require("jsonwebtoken");
// const bcrypt = require('bcrypt');


const { prisma } = require('../../prisma/client');
const { hashPassword, comparePassword } = require('../services/authService');
const { signToken, JWT_SECRET,} = require('../services/tokenService');


 

// TEST ROUTE
async function authhome(req, res) {
  res.json("auth route is up");

};

async function register(req, res, next)  {
    const { email, firstName, lastName, password, phone } = req.body;
    const orgsname = firstName + "'s" + ' Organiztaion';

    // console.log(await prismaClient(), 'prisma')

    // console.log(await prisma.user.findMany(), 'all users')

    console.log(email,firstName,lastName, password, phone, 'email-instance')

    // const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser =  await prisma.user.create({
            data : {
                email,
                firstName,
                lastName,
                phone,
                // password: hashedPassword,
                password: hashPassword(password),


                orgs : {
                  create:  {
                    org: {
                      create: {
                        name: orgsname,
                      },
                    },
                  }                 
                },
            },
            
            select: { userId: true, firstName: true, lastName: true, email: true, phone: true } // Adjust the selected fields as needed
        })
        console.log(newUser, 'instance')

        const token = signToken({ id: newUser.userId}, JWT_SECRET, '1h');
  
        try {   
          res.status(201).json({
            "status": "success",
            "message": "Registration successful",
            "data": {
              "accessToken": token,
              "user": {
                userId: newUser.userId,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                phone: newUser.phone,
              },       
            }
        })
          console.log(newUser.email,  'register')
        } catch (error) {
          // next(error)
          res.status(400).json({
            "status": "Bad request",
            "message": "Registration unsuccessful",
            "statusCode": 400
          })
        }
    } catch (error) {
      next(error)
      console.log('An error occurred:', error.message);

      // console.log(error, 'error')
    }

};


// Login route
async function login (req, res, next) {
    const { email, password } = req.body;
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      console.log(user)
      console.log(password, user.password)
      if (user && comparePassword((password), (user.password))) {

        const token = signToken({ id: user.userId}, JWT_SECRET, '1h');

        res.status(200).json({
          status: 'success',
          message: 'Login successful',
          data: {
            accessToken: token,
            user: {
              userId: user.userId,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phone: user.phone,
            },
          },
        });
       console.log(user.email, 'login')
      }  else {
        res.status(401).json({
        "status": "Bad request",
        "message": "Authentication failed",
        "statusCode": 401
      })
      }
   
    } catch (error) {
      next(error)
    }
}; 


// GET A uSER DETAILS
// async function getUser(req, res, next) {
//   try {
//       const {id} = req.params
//       const user = await prisma.user.findUnique({
//           where: { userId: (id) },
//           select: { userId: true, firstName: true, lastName: true, email: true, phone: true } 
//       });
//       if (user) {
//           res.status(200).json({
//             "status": "success",
//             "message": "User Details",
//             "data": user
//         });
//       }
//       else {
//           res.json({ message: 'User not found.'});
//       }
//   } catch (error) {
//       next(error) 
//       }
// };

async function getUser(req, res, next) {
  const { id } = req.params;
  const currentUserId = req.user.id;

  try {
    // Fetch the current logged-in user's organizations
    const currentUserOrgs = await prisma.orgUser.findMany({
      where: { user_Id: currentUserId },
      include: { org: true },
    });

    // Get a list of organization IDs the current user belongs to
    const currentUserOrgIds = currentUserOrgs.map(orgUser => orgUser.org_Id);

    // Fetch the requested user and related organizations
    const user = await prisma.user.findUnique({
      where: { userId: id },
      include: {
        orgs: {
          include: {
            org: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the requested user belongs to any of the current user's organizations
    const isSameOrg = user.orgs.some(orgUser => currentUserOrgIds.includes(orgUser.org_Id));

    if (id !== currentUserId && !isSameOrg) {
      return res.status(403).json({ error: 'Access forbidden: not in the same organization' });
    }
    res.status(200).json({
      "status": "success",
      "message": "User Details",
      "data":  {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    });


  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the user data' });
  }
};





module.exports = {
  authhome,
  register,
  login,
  getUser
  };
