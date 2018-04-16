const express = require('express');
const graphQL = require('express-graphql');
const schema = require('./data/schema'); 
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/graphql', graphQL({
    schema: schema,
    pretty: true,
    graphiql: true
}));

app.listen(3000, function(){
    console.log('Connected to the server via the port 3000!!!');
});