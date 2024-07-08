const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');
// const session = require('express-session');
// const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
const path = require('path');



const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
// app.use(cookieParser())
app.use(express.json());


const orgRouter = require('./src/routes/orgRoute');
const authRouter = require('./src/routes/authRoute');

// Use routers with specific paths
app.use('', authRouter);
app.use('', orgRouter);


app.listen(3000, () => {
    console.log('app is running on port 3000');
});

module.exports = app;

// const server = app.listen(3000, () => {
//     console.log('App is listening on port 3000');
//   });

// const server = (port) => {
//   const serverPort = port || process.env.PORT || 3000;
//   return new Promise((resolve, reject) => {
//     const server = app
//       .listen(serverPort, () => {
//         console.log(`Server is running on PORT ${serverPort}`);
//         resolve(server);
//       })
//       .on("error", reject);
//   });
// };

// if (process.env.NODE_ENV !== 'test') {
//   server().catch(err => {
//     console.error('Failed to start server:', err);
//     process.exit(1);
//   });
// }
  
// module.exports ={app, sever};