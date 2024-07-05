// routes/users.js

const { prisma } = require('../../prisma/client');
// const { authMiddleware } = require('../middlewares/authMiddleware');
const { hashPassword, comparePassword } = require('../services/authService');
// const { signToken, validateToken, JWT_SECRET, RESET_TOKEN_SECRET, EMAIL_TOKEN_SECRET } = require('../services/tokenService');


 

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
        where: { email }
      });
      if (!user) {
        res.json({"error": "Email is Invalid!"})
      }
      // if (user && (user.password)) {
      if (user && comparePassword(password, user.password)) {
        req.session.user = { id: user.id, 
                             username: user.username };
        res.send({"msg" : "Login successful"});
      } 
        // else if (user || (!user.password)) {
        else if (user || (!comparePassword(password, user.password))) {
        res.json({"error": "Password is Incorrect!"})
      } else  {
        res.status(401).send('Invalid username or password');
      }
    } catch (error) {
        next(error)
    //   res.status(500).send('Error logging in');
    }
  }; 


// Logout route
async function logout (req, res) {
    req.session.destroy(err => {
        if (err) {
        return res.status(500).send({"error": "Failed to logout"});
        }
        res.clearCookie('connect.sid');
        res.json('Logout successful');
    });
};  


// Route to get current logged-in user
async function current_user (req, res) { 
    const userId = req.session.user.id;
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, username: true } // Adjust the selected fields as needed
      });
      if (user) {
        res.json(user);
      } else {
        res.status(404).send('User not found');
      }
    } catch (error) {
      res.status(500).send('Error fetching user data');
    }
  };











module.exports = {
  authhome,
  register,
  login,
  logout,
  current_user,
  };
