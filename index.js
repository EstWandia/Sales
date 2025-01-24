import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import dataRoute from './routes/dashboarddata.js';
import auths from './routes/auth.js';
import soldRoutes from './routes/sold.js';
import categoryRoute from './routes/categories.js';
import allitems from './routes/allitemsroute.js';
import db from './models/index.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
import { checkAuth } from './middleware/checkAuth.js';
import { noCache } from './middleware/nocache.js';
import session from 'express-session';
import { checkPermission } from './middleware/allowedUsers.js';  // Adjust path as needed



dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    secret: 'your-secret-key', // Secret key for signing the session ID cookie
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to `true` if using HTTPS
}));



app.use('/dashboarddata', dataRoute);
app.use('/auth', auths);
app.use('/categories', categoryRoute);
app.use('/allitemsroute',allitems);
app.use('/sold',soldRoutes)

app.set('view engine','ejs')
app.set('views',path.join(__dirname, 'views'));

app.get('index.html',checkAuth,noCache,(req,res) =>{
    res.sendFile(path.join(__dirname,'public','index.html'));
})

app.get('/pages/samples', checkAuth, noCache,checkPermission, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'samples', 'allitems.html'));
});
app.get('/pages/reports', checkAuth, noCache,checkPermission, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'reports', 'reportitems.html'));
});

// Block unauthenticated access to static samples


app.get('/',noCache, (req, res) => {
    console.log(path.join(__dirname, 'public', 'pages', 'samples', 'login.html'));
    res.sendFile(path.join(__dirname, 'public', 'pages', 'samples', 'login.html'));
});

app.use('/public/pages/samples', checkAuth, noCache);
app.use(express.static(path.join(__dirname, 'public')));

db.sequelize.sync().then(() => {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
