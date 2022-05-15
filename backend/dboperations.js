var config = require('./dbconfig');
const sql = require('mssql');
const sql1 = require("mssql/msnodesqlv8");
const CryptoJS = require("crypto-js");
const crypto = require("crypto");

const conn = new sql1.ConnectionPool({
    database: "ProjectMgmtTool",
    server: "WKWIN0410329",
    driver: "msnodesqlv8",
    options: {
        trustedConnection: true
    }
});
conn.connect().then(() => {
    console.log("connected")
});

function get(keys, value) {
    var key = CryptoJS.enc.Utf8.parse(keys);
    var iv = CryptoJS.enc.Utf8.parse(keys);
    var decrypted = CryptoJS.AES.decrypt(value, key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
}

async function getAllData() {
    try {
        let pool = await conn.connect(config);
        let products = await pool.request()
            .query(`SELECT * from PROJECTLIST Order By projectName`);
        return products.recordsets;
    } catch (error) {
        console.log(error);
    }
}
async function getAllRegions() {
    try {
        let pool = await conn.connect(config);
        let products = await pool.request()
            .query(`SELECT Region from MDIDetails Order by Region ASC`);
        return products.recordsets;
    } catch (error) {
        console.log(error);
    }
}

async function getAllUsers() {
    try {
        let pool = await conn.connect(config);
        let products = await pool.request()
            .query(`SELECT * from UserManagement`);
        return products.recordsets;
    } catch (error) {
        console.log(error);
    }
}

async function getDataByEMR(EMR) {
    try {
        let pool = await conn.connect(config);
        let products = await pool.request()
            .input('input_parameter', sql.NVarChar, EMR)
            .query(`SELECT * from MDIDetails where EMR = @input_parameter`);
        return products.recordsets;
    } catch (error) {
        console.log(error);
    }
}

async function getRegionData(regionName) {
    try {
        let pool = await conn.connect(config);
        let products = await pool.request()
            // .input('input_parameter1', sql.NVarChar, selectedEMR)
            .input('input_parameter2', sql.NVarChar, regionName)
            .query(`SELECT * from MDIDetails where Region = @input_parameter2 Order By Hospital ASC`);
        return products.recordsets;
    } catch (error) {
        console.log(error);
    }
}

async function getHospitalData(selectedRegion, state, hospitalName) {
    try {
        let pool = await conn.connect(config);
        let product = await pool.request()
            .input('input_parameter1', sql.NVarChar, state)
            .input('input_parameter2', sql.NVarChar, hospitalName)
            .input('input_parameter3', sql.NVarChar, selectedRegion)
            .query(`SELECT * from MDIDetails where Region = @input_parameter3 AND State = @input_parameter1 AND Hospital = @input_parameter2 Order By Hospital ASC`);
        return product.recordsets;

    } catch (error) {
        console.log(error);
    }
}

async function getStateData(selectedRegion, state) {
    try {
        let pool = await conn.connect(config);
        let product = await pool.request()
            //.input('input_parameter1', sql.NVarChar, emr)
            .input('input_parameter2', sql.NVarChar, state)
            .input('input_parameter3', sql.NVarChar, selectedRegion)
            .query(`SELECT * from MDIDetails where Region = @input_parameter3 AND State = @input_parameter2 Order By Hospital ASC`);
        return product.recordsets;

    } catch (error) {
        console.log(error);
    }
}

async function getDepartmentData(selectedRegion, state, hospitalName, department) {
    try {
        let pool = await conn.connect(config);
        let product = await pool.request()
            .input('input_parameter', sql.NVarChar, hospitalName)
            .input('input_parameter1', sql.NVarChar, department)
            .input('input_parameter2', sql.NVarChar, state)
            .input('input_parameter3', sql.NVarChar, selectedRegion)
            .query(`SELECT * from MDIDetails where Region = @input_parameter3 AND State = @input_parameter2 AND Hospital = @input_parameter AND Department= @input_parameter1 Order By Hospital ASC`);
        return product.recordsets;

    } catch (error) {
        console.log(error);
    }
}

async function getComments(IDX) {
    try {
        let pool = await conn.connect(config);
        let product = await pool.request()
            .input('input_parameter', sql.Int, IDX)
            .query(`SELECT * from Comments where IDX = @input_parameter Order By CommentDateTime DESC`);
        return product.recordsets;

    } catch (error) {
        console.log(error);
    }
}

async function saveComments(comment) {
    try {
        let pool = await conn.connect(config);
        let product = await pool.request()
            .input('IDX', sql.Int, comment.IDX)
            .input('PRM', sql.Int, comment.PRM)
            .input('CommentDateTime', sql.NVarChar, comment.CommentDateTime)
            .input('UserID', sql.NVarChar, comment.UserID)
            .input('Comment', sql.NVarChar, comment.Comment)
            .input('FirstName', sql.NVarChar, comment.FirstName)
            .input('LastName', sql.NVarChar, comment.LastName)
            .query(`INSERT INTO Comments (IDX, PRM, CommentDateTime, UserID, Comment,  FirstName,
                LastName) VALUES (@IDX, @PRM, @CommentDateTime, @UserID, @Comment, @FirstName, 
                    @LastName) Select * from Comments Order By CommentDateTime DESC `);
        return product.recordsets;

    } catch (error) {
        console.log(error);
    }
}

async function getFHS(orderId) {
    let id = "FHS_id"
    try {
        let pool = await conn.connect(config);
        let product = await pool.request()
            .input('input_parameter', sql.Int, orderId)
            .query(`SELECT * from FHS where ${id} = @input_parameter`);
        return product.recordsets;

    } catch (error) {
        console.log(error);
    }
}

async function updateData(record) {
    try {
        let pool = await conn.connect(config);
        let product = await pool.request()
            .input('IDX', record.IDX)
            //  .input('EMR', record.EMR)
            .input('PRM', record.PRM)
            .input('projectName', record.projectName)
            .input('issueType', record.issueType)
            .input('priority', record.priority)
            .input('status', record.status)
            .input('assignee', record.assignee)
            .input('reporter', record.reporter)
            .input('description', record.description)
            .input('attachments', record.attachments)
            .input('startDate', record.startDate)
            .input('estimatedHours', record.estimatedHours)
            .input('parentTaskLink', record.parentTaskLink)
            .input('comments', record.comments)
            .input('history', record.history)
            .input('subTasks', record.subTasks)
            .input('projectManager', record.projectManager)
            .input('health', record.health)
            .input('region', record.region)
            .input('goLive', record.goLive)
            .input('checklist', record.checklist)
            .input('progress', record.progress)
            .query(`UPDATE PROJECTLIST SET PRM = @PRM, projectName = @projectName,
            issueType = @issueType, priority = @priority, status = @status, assignee = @assignee, reporter = @reporter,
            description = @description, attachments = @attachments, startDate = @startDate, estimatedHours = @estimatedHours, 
            parentTaskLink = @parentTaskLink, comments = @comments,
            history = @history, subTasks = @subTasks, projectManager = @projectManager, health = @health,
            region = @region, goLive = @goLive, checklist = @checklist, progress = @progress 
            WHERE IDX = @IDX; Select * from PROJECTLIST Order By projectName`)
            console.log(product)
        return product.recordsets;
    } catch (error) {
        console.log(error);
    }
}


async function getACH() {
    try {
        let pool = await conn.connect(config);
        let products = await pool.request().query("SELECT * from ACH");
        return products.recordsets;
    } catch (error) {
        console.log(error);
    }
}

async function getSLEH() {
    try {
        let pool = await conn.connect(config);
        let products = await pool.request().query("SELECT * from SLEH");
        return products.recordsets;
    } catch (error) {
        console.log(error);
    }
} 

async function getProjectDetails(projectId) {
    try {
        let pool = await conn.connect(config);
        let product = await pool.request()
            .input('input_parameter', sql.Int, projectId)
            .query(`SELECT * from PROJECTLIST where IDX = @input_parameter`);
        return product.recordsets;

    } catch (error) {
        console.log(error);
    }
} 


async function createRecord(record) {
    console.log(record)
    try {
        let pool = await conn.connect(config);
        let insertProduct = await pool.request()
        .input('PRM', record.PRM)
        .input('projectName', record.projectName)
        .input('issueType', record.issueType)
        .input('priority', record.priority)
        .input('status', record.status)
        .input('assignee', record.assignee)
        .input('reporter', record.reporter)
        .input('description', record.description)
        .input('attachments', record.attachments)
        .input('startDate', record.startDate)
        .input('estimatedHours', record.estimatedHours)
        .input('parentTaskLink', record.parentTaskLink)
        .input('comments', record.comments)
        .input('history', record.history)
        .input('subTasks', record.subTasks)
        .input('projectManager', record.projectManager)
        .input('health', record.health)
        .input('region', record.region)
        .input('goLive', record.goLive)
        .input('checklist', record.checklist)
        .input('progress', record.progress)
            .query(`INSERT INTO PROJECTLIST (PRM, projectName, issueType, priority, status,  assignee,
                reporter, description, startDate, estimatedHours, parentTaskLink,
                projectManager, health, region, 
                goLive) VALUES (@PRM, @projectName, @issueType, @priority, @status, @assignee, 
                    @reporter, @description, @startDate, @estimatedHours, @parentTaskLink, @projectManager, @health, @region,
                    @goLive) Select * from PROJECTLIST Order By projectName`);
        return insertProduct.recordsets;

    } catch (err) {
        console.log("err-----------------------------------------------------------------------------------------------");
        // err.originalError.info.message = "Data Insertion Failed. Missing input values."
        return err;
    }
}

async function createUser(user) {
    try {
        let decrypted = get('123456$#@$^@1ERF', user.Password);
        let pool = await conn.connect(config);
        let insertUser = await pool.request()
            .input('FirstName', user.FirstName)
            .input('LastName', user.LastName)
            .input('UserID', user.UserID)
            .input('Password', decrypted)
            .input('Role', user.Role)
            .query(`INSERT INTO UserManagement (FirstName, LastName, Role, UserID, Password) VALUES
             (@FirstName, @LastName, @Role, @UserID, @Password)`);
        return insertUser.recordsets;
    } catch (err) {
        console.log("err-----------------------------------------------------------------------------------------------");
        err.originalError.info.message = "User creation Failed. Missing input values."
        return err;
    }
}
async function deleteUser(record) {
    try {
        let pool = await conn.connect(config);
        let deleteRecord = await pool.request()
            .input('input_parameter', sql.Int, record.IDX)
            .query(`DELETE FROM UserManagement WHERE IDX = @input_parameter; Select * FROM UserManagement `);
        return deleteRecord.recordsets;
    } catch (err) {
        console.log(err);
    }
}

async function updateUser(user) {
    try {
        let decrypted = get('123456$#@$^@1ERF', user.Password);
        let pool = await conn.connect(config);
        let deleteRecord = await pool.request()
            .input('IDX', user.IDX)
            .input('FirstName', user.FirstName)
            .input('LastName', user.LastName)
            .input('UserID', user.UserID)
            .input('Password', decrypted)
            .input('Role', user.Role)
            .query(`Update UserManagement SET FirstName = @FirstName , LastName = @LastName,
         Role = @Role, UserID = @UserID, Password =  @Password  WHERE IDX = @IDX; Select * from UserManagement`);
        return deleteRecord.recordsets;
    } catch (err) {
        console.log(err);
    }
}

async function deleteRecord(record) {
    try {
        let pool = await conn.connect(config);
        let deleteRecord = await pool.request()
            .input('input_parameter', sql.Int, record.IDX)
            .query(`DELETE FROM MDIDetails WHERE IDX = @input_parameter`);
        return deleteRecord.recordsets;
    } catch (err) {
        console.log(err);
    }
}

async function login(body) {
    try {
        let decrypted = get('123456$#@$^@1ERF', body.password);
        let pool = await conn.connect(config);
        let loginUser = await pool.request()
            .input('userId', sql.VarChar, body.userId)
            .input('psw', sql.VarChar, decrypted)
            .query(`select * from UserManagement WHERE USERID = @userId AND Password = @psw`);
        if (loginUser.recordsets[0].length == 0) {
            return "User Not Found";
        } else {
            return {
                IDX: loginUser.recordset[0].IDX,
                FirstName: loginUser.recordset[0].FirstName,
                LastName: loginUser.recordset[0].LastName,
                Role: loginUser.recordset[0].Role,
                UserID: loginUser.recordset[0].UserID
            }
        }
    } catch (err) {
        return { err }
    }
}

async function loginInfo(userID, LoginDateTime, LogoutDateTime) {
    try {
        let pool = await conn.connect(config);
        let products = await pool.request()
            .input('input_parameter1', sql.NVarChar, userID)
            .input('input_parameter2', sql.NVarChar, LoginDateTime)
            .input('input_parameter3', sql.NVarChar, LogoutDateTime)
            .query(`INSERT INTO UserLoginInfo (UserID, LoginDateTime, LogoutDateTime) VALUES (@input_parameter1, @input_parameter2, @input_parameter3);
            select * FROM UserLoginInfo WHERE UserID = @input_parameter1 AND LoginDateTime = @input_parameter2 `);
        return products.recordset;
    } catch (error) {
        console.log(error);
    }
}

async function logout(idx, uid, LoginDateTime, LogoutDateTime) {
    try {
        let pool = await conn.connect(config);
        let products = await pool.request()
            .input('input_parameter1', sql.Int, idx)
            .input('input_parameter2', sql.NVarChar, uid)
            .input('input_parameter3', sql.NVarChar, LoginDateTime)
            .input('input_parameter4', sql.NVarChar, LogoutDateTime)
            .query(`UPDATE UserLoginInfo SET LoginDateTime = @input_parameter3, LogoutDateTime = @input_parameter4
            WHERE IDX = @input_parameter1 AND UserID = @input_parameter2; Select * from UserLoginInfo WHERE IDX = @input_parameter1`);
        return products.recordsets;
    } catch (error) {
        console.log(error);
    }
}
async function upload(body) {
    try {
        let pool = await conn.connect(config);
        let products = await pool.request()
            .input('input_parameter2', sql.NVarChar, body)
            .query(`UPDATE PROJECTLIST SET attachments = @input_parameter2 WHERE IDX = 202; Select * from PROJECTLIST Order By projectName`);
        return products.recordsets;
    } catch (error) {
        console.log(error);
    }
} 

module.exports = {
    getFHS: getFHS,
    createRecord: createRecord,
    deleteRecord: deleteRecord,
    getACH: getACH,
    getSLEH: getSLEH,
    getHospitalData: getHospitalData,
    getDepartmentData: getDepartmentData,
    getRegionData: getRegionData,
    getAllData: getAllData,
    updateData: updateData,
    login: login,
    getDataByEMR,
    getDataByEMR,
    loginInfo: loginInfo,
    logout: logout,
    getAllUsers: getAllUsers,
    createUser: createUser,
    deleteUser: deleteUser,
    updateUser: updateUser,
    getAllRegions: getAllRegions,
    getStateData: getStateData,
    getProjectDetails: getProjectDetails,
    getComments: getComments,
    saveComments: saveComments,
    upload: upload
}