// routes/users.js

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

    try {
        const newUser =  await prisma.user.create({
            data : {
                email,
                firstName,
                lastName,
                phone,
                password: hashPassword(password),

                orgs : {
                  create: [ {
                    org: {
                      create: {
                        name: orgsname,
                      },
                    },
                  }]                  
                },
            },
            
            select: { userId: true, firstName: true, lastName: true, email: true, phone: true } // Adjust the selected fields as needed
        })

        const token = signToken({ id: newUser.userId}, JWT_SECRET, '10m');

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
          next(error)
          // res.status(400).json({
          //   "status": "Bad request",
          //   "message": "Registration unsuccessful",
          //   "statusCode": 400
          // })
        }
    } catch (error) {
        next(error)
    }
};


// Login route
async function login (req, res, next) {
    const { email, password } = req.body;
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (user && comparePassword(String(password), (user.password))) {

        const token = signToken({ id: user.userId}, JWT_SECRET, '10m');

        res.json({
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
      } 
    } catch (error) {

      next(error)
      // res.status(401).json({
      //   "status": "Bad request",
      //   "message": "Authentication failed",
      //   "statusCode": 401
      // })
      
    
    }
}; 


// GET A uSER DETAILS
async function getUser(req, res, next) {
  try {
      const {id} = req.params
      const user = await prisma.user.findUnique({
          where: { userId: (id) },
          select: { userId: true, firstName: true, lastName: true, email: true, phone: true } 
      });
      if (user) {
          res.status(200).json({
            "status": "success",
            "message": "User Details",
            "data": user
        });
      }
      else {
          res.json({ error: 'User not found.'});
      }
  } catch (error) {
      next(error) 
      }
};





module.exports = {
  authhome,
  register,
  login,
  getUser
  };
