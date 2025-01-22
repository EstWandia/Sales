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

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



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

app.get('/pages/samples/allitems.html', checkAuth, noCache, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'samples', 'allitems.html'));
});

// Block unauthenticated access to static samples
app.use('/public/pages/samples', (req, res) => {
    res.status(403).send('Access denied');
});


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
