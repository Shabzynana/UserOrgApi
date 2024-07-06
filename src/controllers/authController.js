// routes/users.js

const { prisma } = require('../../prisma/client');
// const { authMiddleware } = require('../middlewares/authMiddleware');
const { hashPassword, comparePassword } = require('../services/authService');
const { signToken, validateToken, JWT_SECRET, RESET_TOKEN_SECRET, EMAIL_TOKEN_SECRET } = require('../services/tokenService');


 

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

        // const sendToken = signToken({ id: user.id, email: user.email }, EMAIL_TOKEN_SECRET, '10m');
        // const resendUrl = `http://localhost:3000/api/confirm-email/${sendToken}`;

        try {   
          res.status(201).json({
            "status": "success",
            "message": "Registration successful",
            "data": {
              // "accessToken": "eyJh...",
              "user": newUser       
            }
        })
          console.log(newUser)
        } catch (error) {
          res.json({
            "status": "Bad request",
            "message": "Registration unsuccessful",
            "statusCode": 400
          })
        }
        // res.json(user);
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
        select: { userId: true, firstName: true, lastName: true, email: true, phone: true } // Adjust the selected fields as needed
      });
      if (!user) {
        res.json({"error": "Email is Invalid!"})
      }

      console.log(password, 1)
      console.log(user.firstName, 2)
      console.log(user.password, 2)

      if (user && comparePassword(String(password), (user.password))) {

        const token = signToken({ id: user.userId}, JWT_SECRET, '10m');

        res.json({
          status: 'success',
          message: 'Login successful',
          data: {
            accessToken: token,
            user: user
          },
        });

      } else if (user || (!comparePassword(password, user.password))) {
        res.json({"error": "Password is Incorrect!"})
      } else  {
        res.status(401).send('Invalid username or password');
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


// GET A SER DETAILS
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
