var path = require('path');
const db = require("./db/conn.js")
const userModel = require("./models/users.js");
const expertModel = require("./models/experts.js");
const contactModel = require("./models/contacts.js");
const suggestModel = require("./models/suggestions.js");
// const reportModel = require("./models/reports.js");
var express = require("express");
var router = express.Router();
var patient = userModel.find({});

var app = express();
app.use(express.json())
var session = require('express-session')
const bodyParser = require("body-parser")
var s = undefined;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }))

var static_path = path.join(__dirname, "../public")
var template_path = path.join(__dirname, "../templates/views")
// app.use(express.static)
app.use(express.static('public'))
// set the view engine to ejs

app.set("views", template_path)
app.set('view engine', 'ejs');
//initiate dtabase connection
db.init()
app.use(express.urlencoded({ extended: false }))

var port = process.env.PORT || 3000;
app.set('trust proxy', 1)

app.use(session({
    secret: 'password',
    resave: true,
    name: 'uniqueSessionID',
    saveUninitialized: true
}))

// HomePage
app.get("/", (req, res) => {
    res.render("index");
})

//User Registration
app.route("/register").get(function (req, res) {
    res.render("register", { error: "" });
}).post(function (req, res) {
    const name = req.body.name;
    const age = req.body.age;
    const phn = req.body.phn;
    const email = req.body.email;
    const pass = req.body.pass;
    const confirmpass = req.body.confirmpass;
    userModel.create({
        name: name,
        age: age,
        phn: phn,
        email: email,
        pass: pass,
        confirmpass: confirmpass
    })
        .then(function () {
            res.render("userlogin")
        })
        .catch(function (error) {
            res.status(500).send(error.message);
        })
})
app.get("/userlogin", function (req, res) {
    res.render("userlogin")
})

app.post("/userlogin", function (req, res) {
    // req.session.isLoggedIn=false;
    const email = req.body.email;
    const pass = req.body.pass;
    userModel.findOne({ email: email, pass: pass })
        .then(function (user) {
            req.session.isLoggedIn = true;
            req.session.user = user;

            res.redirect("/userhome")
        })
        .catch(function (error) {
            res.render("userlogin");
        })
})


app.get("/logout", function (req, res) {
    req.session.destroy();
    res.render("userlogin")
})

app.route("/userhome").get(function (req, res) {
    var user = req.session.user;

    if (user)
        res.render('userhome', { name: user.name, age: user.age, email: user.email, phn: user.phn, createdAt: Date(user.createdAt) })
    else
        res.render("userlogin")


}).post(function (req, res) {
    const user = req.session.user;
    const cname = req.body.cname;
    const cemail = req.body.cemail;
    const subject = req.body.subject;
    const message = req.body.message;

    contactModel.create({
        cname: cname,
        cemail: cemail,
        subject: subject,
        message: message
    }).then(function () {
        res.render("userhome", { name: user.name, age: user.age, email: user.email, phn: user.phn, createdAt: Date(user.createdAt) });
    })
        .catch(function (error) {
            console.log(error);
        })
})

app.route("/consult").get(function (req, res) {
    var user = req.session.user;
    if (user)
        res.render("consult", { name: user.name, age: user.age, email: user.email, phn: user.phn, createdAt: Date(user.createdAt) });
    else
        res.render("userlogin")


}).post(function (req, res) {

    const user = req.session.user;
    const ct = req.body.ct;
    const tri = req.body.tri;
    const hdl = req.body.hdl;
    const ldl = req.body.ldl;
    const vldl = req.body.vldl;
    const nhdl = req.body.nhdl;

    var att = [];
    att[0] = ct;
    att[1] = tri;
    att[2] = hdl;
    att[3] = ldl;
    att[4] = vldl;
    att[5] = nhdl;
    // var obj=[];
    // let j;
    var obj = []

    suggestModel.find({}, function (error, data) {

        for (var i = 0; i < 6; i++) {
            if (att[i] < data[0].MIN_VALUE[i] || att[i] > data[0].MAX_VALUE[i]) {
                obj.push(data[0].SUGGESTIONS[i]);
            }

        }
        res.render("result", { name: user.name, age: user.age, email: user.email, phn: user.phn, createdAt: Date(user.createdAt), sugg: obj })
        console.log(obj)
        var report =
        {
            ct: ct,
            tri: tri,
            hdl: hdl,
            ldl: ldl,
            vldl: vldl,
            nhdl: nhdl,
            sugg: obj
        }

        userModel.findOneAndUpdate(
            { 'email': user.email },
            { $push: { reports: [report] } },
            function (error, success) {
                if (error) {
                    console.log(error);
                } else {
                    res.render("consult", { name: user.name, age: user.age, email: user.email, phn: user.phn, createdAt: Date(user.createdAt) });
                }
            });
    });
    
})

app.get('/reports', function (req, res) {
    var user = req.session.user;
    if (user) {
        userModel.find({'email': user.email},(err, data)=> {
            // note that data is an array of objects, not a single object!
            res.render('reports.ejs', {
                usersList: data,
                user: req.user,
                name: user.name,
                age: user.age,
                email: user.email,
                phn: user.phn,
                createdAt: Date(user.createdAt)
            });
        });
    }
    else
        res.render("userlogin")

});

app.get("/doctorlogin", function (req, res) {
    res.render("doctorlogin")
})

app.post("/doctorlogin", function (req, res) {

    var docemail = req.body.docemail;
    var docpass = req.body.docpass;
    expertModel.findOne({ docemail: docemail, docpass: docpass })
        .then(function (user) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            res.redirect("/doctorhome")
        })
        .catch(function (error) {
            console.log(error);
            res.render("doctorlogin");
        })
})
app.get("/doctorhome", function (req, res) {
    // res.render("userhome");

    var user = req.session.user;
    // console.log(user)
    if (user)
        res.render('doctorhome', { docname: user.docname, docemail: user.docemail, speciality: user.speciality, experience: user.experience })
    else
        res.render("doctorlogin")


})

app.get('/patients', function (req, res) {
    // mongoose operations are asynchronous, so you need to wait 
    var user = req.session.user;
    // console.log(user)
    if (user) {
        userModel.find({}, function (err, data) {
            res.render('patients.ejs', {
                user: req.user,
                records: data,
                docname: user.docname,
                docemail: user.docemail,
                speciality: user.speciality,
                experience: user.experience
            });
        });
    }
    else
        res.render("doctorlogin")

});

app.post("/suggestions", function (req, res) {
    var sugg = req.body;
    const SERIAL_NUMBER = req.body.SERIAL_NUMBER;
    const ATTRIBUTES = req.body.ATTRIBUTES;
    const MIN_VALUE = req.body.MIN_VALUE;
    const MAX_VALUE = req.body.MAX_VALUE;
    const SUGGESTIONS = req.body.SUGGESTIONS;

    var user = req.session.user;

    suggestModel.create({
        SERIAL_NUMBER: SERIAL_NUMBER,
        ATTRIBUTES: ATTRIBUTES,
        MIN_VALUE: MIN_VALUE,
        MAX_VALUE: MAX_VALUE,
        SUGGESTIONS: SUGGESTIONS
    }).then(function () {
        res.render("doctorhome", { docname: user.docname, docemail: user.docemail, speciality: user.speciality, experience: user.experience });
    })
        .catch(function (error) {
            console.log(error);
        })
})

app.get("/dlogout", function (req, res) {
    req.session.destroy();
    res.render("doctorlogin")
})

//***************************************Report Upload **********************/
const fileUpload = require("express-fileupload");
const res = require("express/lib/response");
const pdfParse = require("pdf-parse");
const { devNull } = require("os");
const { getMaxListeners } = require('process');

app.use(fileUpload());
app.post("/extract-text", (req, res) => {
    if (!req.files && !req.files.pdfFile) {
        res.status(400);
        res.end();
    }
    pdfParse(req.files.pdfFile).then(result => {
        res.send(result.text);
    });
});
//***************************************Report Upload **********************/

app.listen(port, function () {
    console.log(`app is live at http://localhost:${port}`);
})
