//260402 DB 연결
const oracledb = require('oracledb');

async function getConnection() {
    let connection;
    try{
        connection = await oracledb.getConnection({
            user: 'user206',
            password:'pass',
            connectString:'172.18.7.134:1521/xe'
        });
        console.log('DB 연결 성공');
        return connection;
    }catch(err){
        console.log('DB연결 오류:', err.message);
    }
}

module.exports = {getConnection};