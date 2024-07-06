const express = require('express');
const bodyParser = require('body-parser');
// const session = require('express-session');
// const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
const path = require('path');



const app = express();

// app.set('view engine', 'ejs');
// app.use(express.static(path.join(__dirname, 'public')));
// app.set('views', path.join(__dirname, './src/templates'))

// // Render login page
// app.get('/login', (req, res) => {
//     res.render('login');
// });


app.use(bodyParser.json());
app.use(cors());
// app.use(cookieParser())
app.use(express.json());



const authRouter = require('./src/routes/authRoute');
const orgRouter = require('./src/routes/orgRoute');

// Use routers with specific paths
app.use('', authRouter);
app.use('', orgRouter);



app.listen(3000, () => {
    console.log('app is running on port 3000');
});