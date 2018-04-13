var express = require('express');
var graphQL = require('express-graphql');
var schema = require('./data/schema'); 
var bodyParser = require('body-parser');
var app = express();



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


app.use('/graphql', graphQL({
    schema: schema,
    graphiql: true
}));

app.listen(3000, function(){
    console.log("server started");
});