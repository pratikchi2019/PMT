const config = {
    user :'LAPTOP-1FETMONQ\MSSQLSERVER01',
    password :'Welcome@123',
    server:'LAPTOP-1FETMONQ\MSSQLSERVER01',
    database:'EpicBMDI',
    options:{
        trustedconnection: true,
        enableArithAbort : true,
        trustServerCertificate: true,
        instancename :'LAPTOP-1FETMONQ\MSSQLSERVER01'
    },
    port : 1433
}

module.exports = config; 

// const sql = require("mssql/msnodesqlv8");
// const conn = new sql.ConnectionPool({
//   database: "db_name",
//   server: "server_name",
//   driver: "msnodesqlv8",
//   options: {
//     trustedConnection: true
//   }
// });
// conn.connect().then(() => {
//   // ... sproc call, error catching, etc
//   // example: https://github.com/patriksimek/node-mssql#request
// });
