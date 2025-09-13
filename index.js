import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import dataRoute from './routes/dashboarddata.js';
import auths from './routes/auth.js';
import soldRoutes from './routes/sold.js';
import categoryRoute from './routes/categories.js';
import allitems from './routes/allitemsroute.js';
import debtRoute from './routes/debtroute.js';
import dailyreportRoute from './routes/dailyreportroute.js';
import returnedRoute from './routes/returnedroute.js';
import fastmovingRoute from './routes/fastmovingroute.js';

import villagedataRoute from './routes/village_dashboarddata.js';
import villagesoldRoutes from './routes/village_sold.js';
import villagecategoryRoute from './routes/village_categories.js';
import villageallitems from './routes/village_allitemsroute.js';
import villagedebtRoute from './routes/village_debtroute.js';
import villagedailyreportRoute from './routes/village_dailyreportroute.js';
import villagereturnedRoute from './routes/village_returnedroute.js';
import villagefastmovingRoute from './routes/village_fastmovingroute.js';

import db from './models/index.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
import { checkAuth } from './middleware/checkAuth.js';
import { noCache } from './middleware/nocache.js';
import session from 'express-session';
import { checkPermission } from './middleware/allowedUsers.js';  // Adjust path as needed
import printerRoutes from "./public/printer.js"; 
import mailerRoutes from "./public/mailer.js"; 




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
app.use('/debtroute',debtRoute)
app.use('/dailyreportroute', dailyreportRoute);
app.use('/returnedroute', returnedRoute);
app.use('/fastmovingroute', fastmovingRoute);

app.use('/village_dashboarddata', villagedataRoute);
app.use('/village_categories', villagecategoryRoute);
app.use('/village_allitemsroute',villageallitems);
app.use('/village_sold',villagesoldRoutes)
app.use('/village_debtroute',villagedebtRoute)
app.use('/village_dailyreportroute',villagedailyreportRoute);
app.use('/village_returnedroute', villagereturnedRoute);
app.use('/village_fastmovingroute', villagefastmovingRoute);


app.set('view engine','ejs')
app.set('views',path.join(__dirname, 'views'));

app.get('/index.html',checkAuth,noCache,(req,res) =>{
    res.sendFile(path.join(__dirname,'public','index.html'));
})

app.get('village_index.html',checkAuth,noCache,(req,res) =>{
    res.sendFile(path.join(__dirname,'public','index.html'));
})

app.get('/pages/samples', checkAuth, noCache,checkPermission, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'samples', 'allitems.html','village_allitems.html'));
});
app.get('/pages/reports', checkAuth, noCache,checkPermission, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'reports', 'reportitems.html','village_reportitems.html'));
});

// Block unauthenticated access to static samples


app.get('/',noCache, (req, res) => {
   // console.log(path.join(__dirname, 'public', 'pages', 'samples', 'login.html'));
    res.sendFile(path.join(__dirname, 'public', 'pages', 'samples', 'login.html'));
});

app.use('/public/pages/samples', checkAuth, noCache);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', printerRoutes);  // mount them at root
app.use('/', mailerRoutes);  // mount them at root

db.sequelize.sync().then(() => {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
