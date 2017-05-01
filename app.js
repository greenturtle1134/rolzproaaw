//(c) 2017 RolzPro.com and Charlie Wu
//Apache 2.0 License, github.com/byteplanes

var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var fs = require('fs');
var md5 = require('md5');

app.use(bodyParser.urlencoded({ extended: true })); 
app.set('view engine', 'pug')

app.use(express.static('./views'));

app.post('/admin', function (req, res) {  
    if(md5(md5(req.body.pass)+md5(req.body.pass+"1b2e3t4a5r6o7l8z9p0"))=="f7b2ee1dca92c8a591e588c1fedc8179")
    {
        return res.render(
            'adminconsole',
            { title: 'RolzPro AAW'})
    }
    else{
        if((req.body.pass!='')){
            return res.render('adminlogin', {wrongpass: 'true'});
        }
    }
})

app.post('/adminlogin', function (req, res) {  
    return res.render(
        'adminlogin',
        { title: 'RolzPro AAW'})
})


app.get('/', function (req, res) {  
    res.render('index.pug');
    console.log('done');
})

app.get('/disclaimer', function (req, res) {  
    return res.render(
        'disclaimer',
        { title: 'RolzPro AAW'})
})

app.get('/classlist', function (req, res) { 
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
    return res.render(
        'info',
        { title: 'RolzPro AAW'})
})

app.post('/send', function(req, res) {  
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
         fs.writeFile("./classes/"+req.body.classid+".txt", getDateTime()+":   "+"\n"+req.body.hw+"\n"+"\n"+data, function(err) {
            if(err) {
                 return console.log(err);
            }
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
         return res.render('./', {title: 'RolzPro AAW', hwboxmessage: data, tellclass: req.body.getid, showhw:'true'});
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
