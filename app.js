var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var fs = require('fs');
var hw = "";
var classid = "";
var getid = "";

app.use(bodyParser.urlencoded({ extended: true })); 
app.set('view engine', 'pug')

app.get('/', function (req, res) {  
    return res.render(
        'index',
        { title: 'RolzPro AAW', hwboxmessage: 'No class selected yet, to view the HW for a class, type in the correct ClassID above.'})
})

app.get('/disclaimer', function (req, res) {  
    return res.render(
        'disclaimer',
        { title: 'RolzPro AAW'})
})

app.get('/classlist', function (req, res) { 
    fs.readFile('classidlist.txt', function read(err, data) {
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
  hw = req.body.hw;
  classid = req.body.classid;
  
  if((typeof parseInt(classid, 10) == 'number')){
    fs.exists(classid+".txt", function (exists) {
    if (!exists) {
      return res.render(
        'badcid',
        { title: 'RolzPro AAW',
         errormessage: "Not an Actual Class, to create a class see contact section"})
    }
    else
    {
      console.log("wow the classid was right lol");

      fs.readFile(classid+'.txt', function read(err, data) {
         if (err) {
             throw err;
         }
         fs.writeFile(classid+".txt", getDateTime()+":   "+hw+"\n"+data, function(err) {
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
  console.log(hw+"\n"+classid+"\n"+"\n");
});

app.post('/gethw', function(req, res) {
  getid = req.body.getid;
  
  if((typeof parseInt(getid, 10) == 'number')){
    fs.exists(getid+".txt", function (exists) {
    if (!exists) {
      return res.render(
        'badcid',
        { title: 'RolzPro AAW',
         errormessage: "Not an Actual Class, to create a class see contact section"})
    }
    else
    {
      console.log("wow the classid was right lol");

      fs.readFile(getid+'.txt', function read(err, data) {
         if (err) {
             throw err;
         }
         return res.render('./', {title: 'RolzPro AAW', hwboxmessage: data});
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
  console.log(hw+"\n"+classid+"\n"+"\n");
});

app.listen(8080, function () {
  console.log('AAW starting on port 8080.');
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
    return month + ":" + day + ":" + hour + ":" + min ;
}