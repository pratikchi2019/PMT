var Db = require('./dboperations');
const dboperations = require('./dboperations');
const nodemailer = require("nodemailer");
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var multer = require('multer');
var app = express();
var router = express.Router();
var upload = multer();
app.use(upload.array());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 1000000 }));
app.use(cors());

app.use('/api', router);

app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

const multipart = require('connect-multiparty');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, 'file')
    }
})
const multipartMiddleware = multer({ storage: storage }).single('file');

app.post('/api/upload', multipartMiddleware, (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.json({
        'message': 'File uploaded succesfully.'
    });
    console.log(req.files)
});

router.route('/data').get((request, response) => {
    dboperations.getAllData().then(result => {
        response.json(result[0]);
    })
})

router.route('/dataInventory').get((request, response) => {
    dboperations.getAllDataInventory().then(result => {
        response.json(result[0]);
    })
})

router.route('/regions').get((request, response) => {
    dboperations.getAllRegions().then(result => {
        response.json(result[0]);
    })
})

router.route('/users').get((request, response) => {
    dboperations.getAllUsers().then(result => {
        response.json(result[0]);
    })
})

router.route('/createUser').post((request, response) => {
    let record = { ...request.body }
    dboperations.createUser(record).then(result => {
        console.log(result)
        return response.status(201).json(result);
    })
})

router.route('/deleteUser').post((request, response) => {
    let record = { ...request.body }
    dboperations.deleteUser(record).then(result => {
        console.log(result)
        return response.status(201).json(result[0]);
    })
})

router.route('/updateUser').post((request, response) => {
    let record = { ...request.body }
    dboperations.updateUser(record).then(result => {
        console.log(result)
        return response.status(201).json(result[0]);
    })
})

router.use((request, response, next) => {
    console.log('middleware');
    next();
})

router.route('/emr').post((request, response) => {
    dboperations.getDataByEMR(request.body).then(result => {
        return response.json(result[0]);
    })
})

router.route('/region').post((request, response) => {
    dboperations.getRegionData(request.body.Region).then(result => {
        return response.json(result[0]);
    })
})

router.route('/state').post((request, response) => {
    dboperations.getStateData(request.body.selectedRegion, request.body.state).then(result => {
        return response.json(result[0]);
    })
})

router.route('/hospital').post((request, response) => {
    dboperations.getHospitalData(request.body.selectedRegion, request.body.state, request.body.hospitalName).then(result => {
        return response.json(result[0]);
    })
})

router.route('/department').post((request, response) => {
    dboperations.getDepartmentData(request.body.selectedRegion, request.body.state, request.body.hospital, request.body.department).then(result => {
        return response.json(result[0]);
    })
})

router.route('/update').put((request, response) => {
    dboperations.updateData(request.body.project).then(result => {
        return response.json(result[0]);
    })
})

router.route('/ACH').get((request, response) => {
    dboperations.getACH().then(result => {
        response.json(result[0]);
    })
})

router.route('/SLEH').get((request, response) => {
    dboperations.getSLEH().then(result => {
        response.json(result[0]);
    })
})

router.route('/fhs/:id').get((request, response) => {

    dboperations.getFHS(request.params.id).then(result => {
        response.json(result[0]);
    })

})

router.route('/create').post((request, response) => {
    let record = { ...request.body }
    dboperations.createRecord(record).then(result => {
        console.log(result)
        response.status(201).json(result[0]);
    })
})

router.route('/delete').delete((request, response) => {
    let record = { ...request.body }
    dboperations.deleteRecord(record).then(result => {
        response.status(201).json(result);
    })
})

router.route('/comments').post((request, response) => {
    dboperations.getComments(request.body.idx).then(result => {
        return response.json(result[0]);
    })
})

router.route('/saveComment').post((request, response) => {
    console.log(request.body)
    dboperations.saveComments(request.body.comment).then(result => {
        return response.json(result[0]);
    })
})

router.route('/login').post((request, response) => {
    let body = { ...request.body }
    dboperations.login(body).then(result => {
        console.log(result)
        if (result === "User Not Found") {
            return response.status(404).json(result);
        } else {
            return response.status(201).json(result);
        }
    })
})

router.route('/logout').post((request, response) => {
    dboperations.logout(request.body.idx, request.body.uid, request.body.loginDtTm, request.body.logoutDtTm).then(result => {
        return response.json(result[0]);
    })
})

router.route('/loginInfo').post((request, response) => {
    dboperations.loginInfo(request.body.userID, request.body.LoginDateTime, request.body.LogoutDateTime).then(result => {
        return response.json(result[0]);
    })
})

router.route('/projectDetails').post((request, response) => {
    dboperations.getProjectDetails(request.body.projectId).then(result => {
        return response.json(result[0]);
    })
})

router.route('/upload').post((request, response) => {
    console.log(request.body)
    // dboperations.upload(request.body).then(result => {
    //     return response.json(result[0]);
    // })
})

router.route('/attachments').post((request, response) => {
    dboperations.getAttachments(request.body.projectId).then(result => {
        return response.json(result[0]);
    })
})

router.route('/saveHistory').post((request, response) => {

    dboperations.saveHistory(request.body).then(result => {
        async function main() {
            // Generate test SMTP service account from ethereal.email
            // Only needed if you don't have a real mail account for testing
            let testAccount = await nodemailer.createTestAccount();

            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: "kashinatharora29@gmail.com", // generated ethereal user
                    pass: "fnzttxfyoishntvv", // generated ethereal password
                },
            });

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: '"Kashinath Arora" <kashinatharora29@gmail.com>', // sender address
                to: "pratik.srivastava@commonspirit.org, nitintalwar1982@gmail.com, srivastavapratik@yahoo.com, kashinatharora29@gmail.com", // list of receivers 
                subject: "Kashi Checking mailing service for PMT ✔", // Subject line
                text: "Hello world?", // plain text body
                html: "<div><h2> There is a change in project assigned to you </h2></div> <div><b>Please find below details</b></div>" + "<div><b>Project Name : </b>" + request.body.projectName + "</div>" + "<div><b>Field Name : </b>" + request.body.fieldName + "</div>" + "<div><b>Old Value : </b>" + "<s>" + request.body.oldValue + "</s>" + "</div>" + "<div><b>New Value : </b>" + request.body.newValue + "</div>" + "<div><b>Username : </b>" + request.body.FirstName + " " + request.body.LastName + "</div>", // html body
            });

            console.log("Message sent: %s", info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

            // Preview only available when sending through an Ethereal account
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        }

        main().catch(console.error);
        return response.json(result[0]);
    })
})

router.route('/getHistory').post((request, response) => {
    dboperations.getHistory(request.body.IDX).then(result => {
        return response.json(result[0]);
    })
})

router.route('/getSubtasks').post((request, response) => {
    dboperations.getSubtasks(request.body.IDX).then(result => {
        return response.json(result[0]);
    })
})

var port = process.env.PORT || 8085;
app.listen(port);
console.log('PMT API is runnning at ' + port);