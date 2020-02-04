const express = require('express');
const path = require('path');
const url = require('url');
const bodyParser = require('body-parser');
const axios = require('axios');
var cors = require('cors');
const MongoClient = require('mongodb').MongoClient;

let ObjectId = require('mongodb').ObjectId;
let mongurl = "mongodb+srv://karim:qhacksgangshit@cluster0-juenz.mongodb.net/test?retryWrites=true&w=majority";

let app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/properties', function(req,res){
  dbo.collection("property").find({}).toArray(function(err,results){
    if(err) throw err;
    var data = {"results":results};
    res.json(data);
  });
});

app.get('/coordinates', function(req,res){
  let addy = req.query.address;
  addy = addy.split(" ");
  let ad = "";
  addy.forEach(function(a){
    ad += (a + "+");
  });
  ad+=","+"+Kingston"+",+ON";
  let coords = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + ad + '&key=AIzaSyDdB4zEdQh5Ma5zNy_SX1_QzYNliMee_tk';
  axios.get(coords).then(function(response){
    console.log(""+JSON.stringify(response.data.results[0].geometry.location, null, 4));
    res.json(response.data.results[0].geometry.location);
  });
});

app.get('/property', getProperties, nearMe);

function getProperties(req,res, next){
  console.log(req.query);
  let beds, baths, minLength, maxLength, minPrice, maxPrice, maxDistance;
  if(req.query.beds){
    beds = parseInt(req.query.beds, 10);
  } else{ beds = null; }
  if(req.query.baths){
    baths = parseInt(req.query.baths, 10);
  } else{ baths = null; }
  if(req.query.minLength){
    minLength= parseInt(req.query.minLength, 10);
  } else{ minLength = 0; }
  if(req.query.maxLength){
    maxLength= parseInt(req.query.maxLength, 10);
  } else{ maxLength = Infinity; }
  if(req.query.minPrice){
    minPrice = parseInt(req.query.minPrice, 10);
  } else{ minPrice = 0; }
  if(req.query.maxPrice){
    maxPrice = parseInt(req.query.maxPrice, 10);
  } else{ maxPrice = Infinity; }
  if(req.query.maxDistance){
    maxDistance = parseInt(req.query.maxDistance, 10);
  } else{ maxDistance = Infinity; }
  let queryObj = {"bed":beds, "bath":baths, "price": {$gt:minPrice, $lt:maxPrice}}; //
  console.log(queryObj);
  if(!beds){delete queryObj["bed"];}
  if(!baths){delete queryObj["bath"];}
  dbo.collection("property").find(queryObj).toArray(function(err,results){
    if(err) throw err;
    let data = {"results":results};
    req.results = results;
    req.maxDistance  = maxDistance;
    next();
  });
};

function nearMe(req,res){
  let closeListings = [];
  req.results.forEach(function(i){
    let dLongitude = i["address"];
    let dLong = dLongitude.split(" ");
    let address = "";
    dLong.forEach(function(a){
      address += (a + "+");
    });
    address+="Kingston+ON";
    let originStr = "origins=" + req.query.lat + "," + req.query.lng;
    let destionationStr = "destinations=" + address;
    let keyStr = "key=AIzaSyDdB4zEdQh5Ma5zNy_SX1_QzYNliMee_tk";
    let travelStr = "mode=walking";
    let queryString = 'https://maps.googleapis.com/maps/api/distancematrix/json?' + originStr + "&" + destionationStr + "&" + keyStr + "&" + travelStr;
    i['request'] = axios.get(queryString);
    let geocodingURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=AIzaSyDdB4zEdQh5Ma5zNy_SX1_QzYNliMee_tk';
    i['location'] = axios.get(geocodingURL);
    console.log(queryString);
  });
  Promise.all(req.results.map(property => property.request)).then(function(data) {
    data.forEach((resp, i) => {
      let property = req.results[i];
      property['api_data'] = resp.data.rows[0].elements[0];
      delete property['request'];
      if(property['api_data'].distance.value < req.maxDistance){ closeListings.push(property); }
      console.log("DISTANCE: " + property['api_data'].distance.value + " < " + req.maxDistance);
    })

      closeListings.sort((a, b) => a.api_data.distance.value - b.api_data.distance.value);
      let resData = {"data":closeListings};
      Promise.all(req.results.map(p => p.location)).then(function(data) {
        data.forEach((resp, i) => {
          let property = req.results[i];
          property['location'] = resp.data.results[0].geometry.location;
          console.log(property['location']);
        })
        res.json(resData);

      })

  }).catch(err => {
    console.log(err);
    res.json({'error': 'FATAL API ERROR'})
  });
};

MongoClient.connect(mongurl, function(err, db) {
  if (err) throw err;
  dbo = db.db("qhacks");
  //Start server at port 3000
  let server = app.listen(8080, function(){
    console.log("Listening to requests on port 8080");
  });
});
