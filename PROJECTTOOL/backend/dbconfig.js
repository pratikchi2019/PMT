const config = {
    user :'CHI\BridgesBMDISA',
    password :'Welcome@123',
    server:'RDCQUONAPP001',
    database:'EpicBMDI',
    options:{
        trustedconnection: false,
        enableArithAbort : true,
        trustServerCertificate: true,
        instancename :'RDCQUONAPP001'
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
