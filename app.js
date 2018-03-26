var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// ***** user defined code *****

// require fs for enabling file operations
var fs = require('file-system');

// require nodemailer for sending mail
var nodemailer = require('nodemailer');

// require mongoose for using mongodb
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/finalprodatabase';

// creating an instance of the registration schema
var registermodule = require('./Registrationschema');
var dynamicregistrationmodule = require('./dynamicRegistrationSchemaDescription');

// *****************************

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// ***** user defined code *****

function accessControl(request, response) {
  console.log('!OPTIONS');
  var headers = {};
  // IE8 does not allow domains to be specified, just the *
  // headers["Access-Control-Allow-Origin"] = req.headers.origin;
  headers["Access-Control-Allow-Origin"] = "*";
  headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
  headers["Access-Control-Allow-Credentials"] = false;
  headers["Access-Control-Max-Age"] = '86400'; // 24 hours
  headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
  response.writeHead(200, headers);
  response.end();
}

// mongo database connection
mongoose.connect(url , function(error , db) {
  if(error) {
    console.log("database not created" + "\n" + error);
  }
  else {
    console.log("database created");
  }
});

// node mailer used to send mail to other users
var mailcredentials = nodemailer.createTransport({
  service : 'gmail',
  auth : {
    user : 'projectfinal201718@gmail.com',
    pass : 'projectfinal@123'
  }
});
// var maildata = {
//   from : 'projectfinal201718@gmail.com',
//   to : 'gurusainath007@gmail.com',
//   subject : 'This message from google forms replication',
//   text : 'hi hello you are welcome'
// };
// mailcredentials.sendMail(maildata , function(error , info) {
//   if(error){
//         console.log(error);
//         // res.send('error');
//     }else{
//         console.log('Message sent: ' + info.response);
//         // res.send('sent');form
//     };
// });

// registration for every user
app.use('/registration', function(request, response) {
  if(request.method === 'OPTIONS') {
    accessControl();
  }
  else {
    var maindata= {
      firstname: request.body.firstname,
      lastname: request.body.lastname,
      gmail: request.body.gmail,
      password: request.body.password,
      birthday: request.body.birthday,
      gender: request.body.gender,
      mobilenumber: request.body.mobilenumber,
      nation: request.body.nation
    }
    var gmailvalidation = {
      gmail:maindata.gmail,
    }
    registermodule.gmailcheck(gmailvalidation, function(error, data) {
      if (data[0]) {
        error="You already registered";
        response.send(error);
      } else {
        registermodule.register(maindata, function(error, data) {
          if(data) {
            response.send('success');
          }
          else {
            response.send('error');
          }
        });
      }
    });
  }
});

// login for every user
app.use('/login', function(request, response) {
  if(request.method === 'OPTIONS') {
    accessControl();
  }
  else {
    var logindata= {
      gmail: request.body.gmail,
      password: request.body.password
    }
    console.log(logindata);
    console.log(logindata.gmail + " " + logindata.password);
    registermodule.logincredentials(logindata, function(error, data) {
      if(data) {
        var success = 'success';
        response.send(success);
      }
      else {
        var error = 'error';
        response.send(error);
      }
    });
  }
});

// creating the form and generate the basic requirements in USERFORM and userformdataobject
app.use('/formgenerateddata', function(request, response) {
  if(request.method === 'OPTIONS') {
    accessControl(request, response);
  }
  else {
  var maindataset = request.body;
  // var userformrequirements = {
  //   key: maindataset.key,
  //   values: [{
  //     creatorName: maindataset.values.creatorName,
  //     formName: maindataset.values.formName,
  //     formDescription: maindataset.values.formDescription,
  //     formgeneratedDate: maindataset.values.formgeneratedDate,
  //     formgeneratedData: [{
  //       _id: request.body.creatorName,
  //       text: [{
  //         _id: request.body.text
  //       }],
  //       textarea: [{
  //         _id: request.body.textarea
  //       }],
  //       button: [{
  //         _id: request.body.button
  //       }],
  //       checkbox: [{
  //         _id: request.body.checkbox
  //       }],
  //       select: [{
  //         _id: request.body.select
  //       }]
  //     }]
  //   }]
  // }

  response.send(maindataset.key);
  // console.log(maindataset);

  //
  // var maindata = {
  //   creatorName: 'creatorName'
  // }
  //
  // console.log(maindataset);
  // console.log(maindata);
  // response.send(maindataset);
  // response.send(userformrequirements);
  // dynamicregistrationmodule.findCreatorNameData(maindata , function(error, data) {

  //   if(data) {
  //     var datas = 'find collection';
  //     response.send(datas);
  //   }
  //   else {
  //     var datas = 'error';
  //     response.send(datas);
      // dynamicregistrationmodule.createData(userformrequirements, function(error, data) {
      //   if(data) {
      //     var datas = 'success';
      //     response.send(datas);
      //   }
      //   else {
      //     var datas = 'error';
      //     response.send(datas + ' ' + error);
      //   }
      // });
  //   }
  // });
}
});

// *****************************

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
