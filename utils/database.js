import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config({path: './.env'})

const router =mysql.createPool({
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DATABASE

});
// function query(queryString, callback){
//     pool.getConnection((error,connection)=>{
//         if(error){
//         console.error('error establishing database connection:',error);
//         callback(error, null);
//         return;
//     }
//     connection.query(queryString, (err, results) => {
//         connection.release();
//         if(err){
//             console.error('Error executing database query:',err);
//             callback(err, null);
//             return;
//         }
//         callback(null, results);
//     });
// });
// }
async function query(queryString,params){
    try{
        const [results] = await router.query(queryString,params);
        return results;
    }catch (err){
        console.error(`Error executing database query:${err.message}`);
        throw err;}
}

export default query;