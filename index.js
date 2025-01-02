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

app.get('/', (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    console.log(path.join(__dirname, 'public', 'pages', 'samples', 'login.html'));
    res.sendFile(path.join(__dirname, 'public', 'pages', 'samples', 'login.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

db.sequelize.sync().then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
