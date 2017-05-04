//(c) 2017 RolzPro.com and Charlie Wu
//Apache 2.0 License, github.com/byteplanes

var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var fs = require('fs');
var md5 = require('md5');
var cookieParser = require('cookie-parser')
var SHA512 = require("crypto-js/sha512");


app.use(bodyParser.urlencoded({ extended: true })); 
app.set('view engine', 'pug')

app.use(express.static('./views'));
app.use(cookieParser());

function goodcookie(ccheck, username, password, redirectto, res){
    if(username=="logged out"&&password=="logged out")
    {
      fs.readFile("logs.txt", function read(err, data) {    fs.writeFile("logs.txt", data+"\n"+getDateTime()+":  "+"RELOG PLS by: "+username, function(err) {}); });
      res.render('login', {wrongpass: 'true', loginerrormessage: 'Please Re-enter your Username and Password.'});
      res.end();
      return true;
    }
    if(username!=""&&username!=null)
    {
          fs.exists("./users/"+username+".txt", function (exists) {
          if (!exists) {
            res.render(
              'login');
            return true;
          }
          else
          {
            fs.readFile("./users/"+username+".txt", function read(err, data) {
              if (err) {
                  throw err;
              }
              if(password==data)
              {
    fs.readFile("logs.txt", function read(err, data) {    fs.writeFile("logs.txt", data+"\n"+getDateTime()+":  "+"RETURN SUCCESS by: "+username, function(err) {}); });
                
                fs.exists("./emails/"+username+".txt", function (exists) {
                  if (!exists&&ccheck==true) {
                    res.render(
                      'askemail');
                    return true;
                  }
                  else
                  {
                      if (password.length<=32&&ccheck==true) {
                        res.render(
                          'changelegacypass');
                        return true;
                      }
                      else{
                        if(redirectto==""){
                            return false;
                          }
                          else{
                            res.render(redirectto, {title: 'RolzPro AAW', username: username});
                            return false;
                          }
                      }
                  }
                });
              }
              else
              {
                res.render('login');
                res.end();
                return true;
              }
            });
          }
          });
    }
    else
    {
          res.render('login');
          res.end();
          return true;
          console.log('done');
    }
}
//need to fix a headers error :/
app.post('/confirmfromlegacypass', function (req, res) {
    fs.readFile("logs.txt", function read(err, data) {    fs.writeFile("logs.txt", data+"\n"+getDateTime()+":  "+"LEGACY TO NEW ATTEMPT by: "+req.cookies.username, function(err) {}); });
    if(req.body.pass!=""&&req.body.pass!=null)
    {
          fs.exists("./users/"+req.cookies.username+".txt", function (exists) {
          if (exists) {
             fs.writeFile("./users/"+req.cookies.username+".txt", SHA512(req.body.pass), function(err) {
              if(err) {
              }
             fs.readFile("logs.txt", function read(err, data) {    fs.writeFile("logs.txt", data+"\n"+getDateTime()+":  "+"LEGACY TO NEW SUCCESS by: "+req.cookies.username, function(err) {}); });});
             goodcookie(false, req.cookies.username, req.cookies.password, 'index', res)
          }
          else{
              fs.readFile("logs.txt", function read(err, data) {    fs.writeFile("logs.txt", data+"\n"+getDateTime()+":  "+"STRANGE L TO N ERROR by: "+req.cookies.username, function(err) {}); });
              goodcookie(false, req.cookies.username, req.cookies.password, 'index', res)
          }
        });
    }
    else
    {
        return res.render(
          'changelegacypass', {wrongpass: 'true', loginerrormessage: 'Please enter a valid password (not blank)'})
    }
})

app.post('/confirmemail', function (req, res) {
    fs.readFile("logs.txt", function read(err, data) {    fs.writeFile("logs.txt", data+"\n"+getDateTime()+":  "+"EMAIL ATTEMPT by: "+req.cookies.username, function(err) {}); });
    if(req.body.email!=""&&req.body.email!=null)
    {
          fs.exists("./emails/"+req.cookies.username+".txt", function (exists) {
          if (!exists) {
             fs.closeSync(fs.openSync("./emails/"+req.cookies.username+".txt", 'w'));
             fs.writeFile("./emails/"+req.cookies.username+".txt", req.body.email, function(err) {
              if(err) {
              }
             fs.readFile("logs.txt", function read(err, data) {    fs.writeFile("logs.txt", data+"\n"+getDateTime()+":  "+"EMAIL SUCCESS by: "+req.cookies.username, function(err) {}); });});
             goodcookie(true, req.cookies.username, req.cookies.password, 'index', res)
          }
          else{
              fs.readFile("logs.txt", function read(err, data) {    fs.writeFile("logs.txt", data+"\n"+getDateTime()+":  "+"STRANGE EMAIL ERROR by: "+req.cookies.username, function(err) {}); });
              goodcookie(true, req.cookies.username, req.cookies.password, 'index', res)
          }
        });
    }
    else
    {
        return res.render(
          'askemail', {wrongpass: 'true', loginerrormessage: 'Please enter a valid email/other contact method. A confirmation for your account will be sent.'})

    }
})

app.post('/admin', function (req, res) { 
    fs.readFile("logs.txt", function read(err, data) {    fs.writeFile("logs.txt", data+"\n"+getDateTime()+":  "+"ADMIN ATTEMPT by: "+req.cookies.username, function(err) {}); });
    if(md5(md5(req.body.pass))=="3566808b216dd654e693c7a7f48bc6f5")
    {
    fs.readFile("logs.txt", function read(err, data) {    fs.writeFile("logs.txt", data+"\n"+getDateTime()+":  "+"ADMIN SUCCESS by: "+req.cookies.username, function(err) {}); });
        return res.render(
            'adminconsole',
            { title: 'RolzPro AAW'})
    }
    else{
        if((req.body.pass!='')){
    fs.readFile("logs.txt", function read(err, data) {    fs.writeFile("logs.txt", data+"\n"+getDateTime()+":  "+"ADMIN FAILURE by: "+req.cookies.username, function(err) {}); });
            return res.render('adminlogin', {wrongpass: 'true'});
        }
    }
})

app.post('/adminlogin', function (req, res) {  
    if(goodcookie(true, req.cookies.username, req.cookies.password, 'adminlogin', res)!=false){return;}
})

app.get('/logout', function (req, res) {  
    res.cookie('username', "logged out", { expires: 0, httpOnly: true });
    res.cookie('password', "logged out", { expires: 0, httpOnly: true });
    return res.render(
        'login',
        { title: 'RolzPro AAW'});
})

app.post('/confirmlogin', function (req, res) {
    fs.readFile("logs.txt", function read(err, data) {    fs.writeFile("logs.txt", data+"\n"+getDateTime()+":  "+"LOGIN ATTEMPT by: "+req.body.username, function(err) {}); });
    if(req.body.username!=""&&req.body.username!=null)
    {
          fs.exists("./users/"+req.body.username+".txt", function (exists) {
          if (!exists) {
            return res.render(
              'login', {wrongpass: 'true', loginerrormessage: 'Username does not exist. To create an account, see below.'})
          }
          else
          {
            fs.readFile("./users/"+req.body.username+".txt", function read(err, data) {
              if (err) {
                  throw err;
              }
              if(SHA512(req.body.password).toString()==data)
              {
    fs.readFile("logs.txt", function read(err, data) {    fs.writeFile("logs.txt", data+"\n"+getDateTime()+":  "+"LOGIN SUCCESS by: "+req.body.username, function(err) {}); });
                res.cookie('username', req.body.username, { expires: 0, httpOnly: true });
                res.cookie('password', SHA512(req.body.password).toString(), { expires: 0, httpOnly: true });
                return res.render('index', {title: 'RolzPro AAW', username: req.body.username});
                return res.end();
              }
              else
              {
              if(md5(req.body.password)==data)
              {
    fs.readFile("logs.txt", function read(err, data) {    fs.writeFile("logs.txt", data+"\n"+getDateTime()+":  "+"LOGIN SUCCESS by: "+req.body.username, function(err) {}); });
                res.cookie('username', req.body.username, { expires: 0, httpOnly: true });
                res.cookie('password', md5(req.body.password).toString(), { expires: 0, httpOnly: true });
                return res.render('index', {title: 'RolzPro AAW', username: req.body.username});
                return res.end();
              }
              else
              {
    fs.readFile("logs.txt", function read(err, data) {    fs.writeFile("logs.txt", data+"\n"+getDateTime()+":  "+"BAD PASSWORD by: "+req.body.username, function(err) {}); });
                return res.render(
                  'login', {wrongpass: 'true', loginerrormessage: 'Wrong password. Stawp haxoring!'})
              }
              }
            });
          }
          });
    }
    else
    {
          res.render('login', {wrongpass: 'true', loginerrormessage: 'You need to put in an username.'});
          console.log('done');
    }
})

app.post('/confirmcreate', function (req, res) {
    fs.readFile("logs.txt", function read(err, data) {    fs.writeFile("logs.txt", data+"\n"+getDateTime()+":  "+"CREATE ATTEMPT by: "+req.body.username, function(err) {}); });
    if(req.body.username!=""&&req.body.username!=null&&req.body.password!=""&&req.body.password!=null)
    {
          fs.exists("./users/"+req.body.username+".txt", function (exists) {
          if (!exists) {
             fs.closeSync(fs.openSync("./users/"+req.body.username+".txt", 'w'));
             fs.writeFile("./users/"+req.body.username+".txt", SHA512(req.body.password), function(err) {
              if(err) {
              }
    fs.readFile("logs.txt", function read(err, data) {    fs.writeFile("logs.txt", data+"\n"+getDateTime()+":  "+"CREATE SUCCESS by: "+req.body.username, function(err) {}); });
              res.render('login', {wrongpass: 'true', loginerrormessage: 'Thanks for registering! Sign in with your new credentials!'});
              console.log('done');
              console.log("The file was saved!");
         });
          }
          else
          {
            return res.render(
              'createaccount', {wrongpass: 'true', loginerrormessage: 'Username already exists. If you need to login, go to the login tab. Otherwise, choose a different username please.'})
          }
          });
    }
    else
    {
          res.render('createaccount', {wrongpass: 'true', loginerrormessage: 'Username or Password cannot be blank.'});
          console.log('done');
    }
})

app.get('/', function (req, res) {
    fs.readFile("logs.txt", function read(err, data) {    fs.writeFile("logs.txt", data+"\n"+getDateTime()+":  "+"RETURN ATTEMPT by: "+req.cookies.username, function(err) {}); });
    if(goodcookie(true, req.cookies.username, req.cookies.password, 'index', res)!=false){return;}
})

app.get('/createaccount', function (req, res) {
    return res.render('createaccount', {title: 'RolzPro AAW'});
    return res.end();
})

app.get('/disclaimer', function (req, res) {  
    if(goodcookie(true, req.cookies.username, req.cookies.password, 'disclaimer', res)!=false){
      console.log("one point five");
      return;
    }
})

app.get('/classlist', function (req, res) { 
      console.log("two");
      fs.readFile('./classidlist.txt', function read(err, data) {
         if (err) {
             throw err;
         }
        return res.render(
            'classlist',
            { title: 'RolzPro AAW', listmessage: data})
      });
})

app.get('/info', function (req, res) {  
    if(goodcookie(true, req.cookies.username, req.cookies.password, 'info', res)!=false){return;}
})

app.post('/send', function(req, res) {  
  fs.readFile("logs.txt", function read(err, data) {    fs.writeFile("logs.txt", data+"\n"+getDateTime()+":  "+"SEND ATTEMPT by: "+req.cookies.username, function(err) {}); });
  if((typeof parseInt(req.body.classid, 10) == 'number')){
    fs.exists("./classes/"+req.body.classid+".txt", function (exists) {
    if (!exists) {
      return res.render(
        'badcid',
        { title: 'RolzPro AAW',
         errormessage: "Not an Actual Class, to create a class see contact section"})
    }
    else
    {
      console.log("wow the classid was right lol");

      fs.readFile("./classes/"+req.body.classid+'.txt', function read(err, data) {
         if (err) {
             throw err;
         }
         fs.writeFile("./classes/"+req.body.classid+".txt", getDateTime()+", Submitted by: "+req.cookies.username+":   "+"\n"+req.body.hw+"\n"+"\n"+data, function(err) {
            if(err) {
                 return console.log(err);
            }
    fs.readFile("logs.txt", function read(err, data) {    fs.writeFile("logs.txt", data+"\n"+getDateTime()+":  "+"SEND SUCCESS by: "+req.cookies.username, function(err) {}); });
            console.log("The file was saved!");
         });
      });
      return res.render('submitted', { title: 'RolzPro AAW'});
      return res.end();
    }
  });
}else{
        return res.render(
        'badcid',
        { title: 'RolzPro AAW',
         errormessage: "ClassID Not A Number"})
  }
  console.log(req.body.hw+"\n"+req.body.classid+"\n"+"\n");
});

app.post('/gethw', function(req, res) {  
  fs.readFile("logs.txt", function read(err, data) {    fs.writeFile("logs.txt", data+"\n"+getDateTime()+":  "+"GET ATTEMPT by: "+req.cookies.username, function(err) {}); });
  if((typeof parseInt(req.body.getid, 10) == 'number')){
    fs.exists("./classes/"+req.body.getid+".txt", function (exists) {
    if (!exists) {
      return res.render(
        'badcid',
        { title: 'RolzPro AAW',
         errormessage: "Not an Actual Class, to create a class see contact section"})
    }
    else
    {
      console.log("wow the classid was right lol");

      fs.readFile("./classes/"+req.body.getid+'.txt', function read(err, data) {
         if (err) {
             throw err;
         }
    fs.readFile("logs.txt", function read(err, data) {    fs.writeFile("logs.txt", data+"\n"+getDateTime()+":  "+"GET SUCCESS by: "+req.cookies.username, function(err) {}); });
         return res.render('index', {title: 'RolzPro AAW', hwboxmessage: data, tellclass: req.body.getid, showhw:'true', username: req.cookies.username});
         return res.end();
      });
    }
  });
}else{
        return res.render(
        'badcid',
        { title: 'RolzPro AAW',
         errormessage: "ClassID Not A Number"})
  }
});

app.listen((process.env.PORT || 5000), function () {
  console.log('RolzPro AAW starting on port 5000.');
  console.log('(c) 2017 RolzPro.com and Charlie Wu');
  console.log('Apache 2.0 License, github.com/byteplanes');
})

function getDateTime() {
    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return month + "/" + day + "   " + hour + ":" + min ;
}



app.post('/updatefile', function(req, res) {  
    fs.exists(req.body.sendpath, function (exists) {
      console.log("wow the classid was right lol");
         fs.writeFile(req.body.sendpath, req.body.newfile, function(err) {
            if(err) {
                 return console.log(err);
            }
            console.log("The file was saved!");
         });
      return res.render('adminconsole', { title: 'RolzPro AAW'});
      return res.end();
  });
});

app.post('/getfile', function(req, res) {  
  if(1==1){
    fs.exists(req.body.getpath, function (exists) {
    if (!exists) {
      return res.render(
        'badcid',
        { title: 'RolzPro AAW',
         errormessage: "Not an Actual Class, to create a class see contact section"})
    }
    else
    {
      console.log("wow the classid was right lol");

      fs.readFile(req.body.getpath, function read(err, data) {
         if (err) {
             throw err;
         }
         return res.render('adminconsole', {title: 'RolzPro AAW', filecontents: data});
         return res.end();
      });
    }
  });
}else{
        return res.render(
        'badcid',
        { title: 'RolzPro AAW',
         errormessage: "ClassID Not A Number"})
  }

});
