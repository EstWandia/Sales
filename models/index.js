import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';
import { fileURLToPath, pathToFileURL } from 'url';
// import configData from '../config/config.json' assert { type: 'json' };
import configData from '../config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = configData[env];
const db = {};


let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// sequelize.sync({ alter: true }).then(() => {
//     console.log('Database synchronized with models.');
//   }).catch((err) => {
//     console.error('Error syncing database:', err);
//   });

fs.readdirSync(__dirname)
    .filter(file => {
        return (
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === '.js' &&
            file.indexOf('.test.js') === -1
        );
    })
    .forEach(file => {
        import(pathToFileURL(path.join(__dirname, file)).href).then(module => {
            const model = module.default(sequelize, Sequelize.DataTypes);
            db[model.name] = model;
        });
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

import Allitems from './allitems.js';
import Solditems from './solditems.js';
import users from './users.js';
import Itemscategory from './itemscategory.js';
import Debtitems from './debt.js';
import Dailyreport from './dailyreport.js';
import ReturnedItems from './returned.js';

import VillageAllitems from './village_allitems.js';
import VillageSolditems from './village_solditems.js';
import VillageItemscategory from './village_itemscategory.js';
import VillageDebtitems from './village_debt.js';
import VillageDailyreport from './village_dailyreport.js';
import VillageReturnedItems from './village_returned.js';

db.Solditems = Solditems(sequelize, Sequelize.DataTypes);
db.users = users(sequelize, Sequelize.DataTypes);
db.Allitems =Allitems(sequelize, Sequelize.DataTypes);
db.Itemscategory = Itemscategory(sequelize, Sequelize.DataTypes);
db.Debtitems =Debtitems(sequelize, Sequelize.DataTypes);
db.Dailyreport =Dailyreport(sequelize, Sequelize.DataTypes);
db.Returneditems =ReturnedItems(sequelize, Sequelize.DataTypes);

db.VillageSolditems = VillageSolditems(sequelize, Sequelize.DataTypes);
db.VillageAllitems = VillageAllitems(sequelize, Sequelize.DataTypes);
db.VillageItemscategory = VillageItemscategory(sequelize, Sequelize.DataTypes);
db.VillageDebtitems = VillageDebtitems(sequelize, Sequelize.DataTypes);
db.VillageDailyreport  = VillageDailyreport(sequelize, Sequelize.DataTypes);
db.VillageReturneditems = VillageReturnedItems(sequelize, Sequelize.DataTypes);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
