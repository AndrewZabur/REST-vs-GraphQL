const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema.js');
const app = express();

app.use('/graphql', expressGraphQL({
    schema: schema,
    pretty: true,
    graphiql: true
}));

app.listen(1000, () => {
    console.log('Connected to the server with port 1000!!!');
});