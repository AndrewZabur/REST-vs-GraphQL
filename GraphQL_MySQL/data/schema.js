
const Promises = require('bluebird');
const mc = require('../dbConnection');
const GraphQLDate = require('graphql-date');


const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

var busType = new GraphQLObjectType({
    name: 'bus',
    fields: ()=>( {
        busId: {
            type: GraphQLInt
        },
        model: {
            type: GraphQLString
        },
        indentificationNumber: {
            type: GraphQLString
        },
        capacity: {
            type: GraphQLInt 
        },
        dataConstruction: {
            type: GraphQLDate
        },
        garageId: {
            type: GraphQLInt
        }
    })
});

var busQueryType = new GraphQLObjectType({
    name:'busQuery',
    fields: {
        bus: {
            type: busType,
            args: {
                id: {
                    type: GraphQLInt
                }
            },
            resolve(root, args) {
                return new Promises(function(resolve, reject) {
                    mc.query('SELECT * FROM bus WHERE busId = ?', [args.id], function(err, result) {
                        if(result.length > 0){
                            return (err ? reject(err) : resolve(result[0]));    
                        } else{
                            return "szddgg";
                        }
                    });
                });
            }
        },
        buses: {
            type: new GraphQLList(busType),
            resolve(root, args){
                return new Promises(function(resolve, reject) {
                    mc.query('SELECT * FROM bus', function(err, result) {
                      return (err ? reject(err) : resolve(result));
                    });
                });
            }
        }
    }
});

module.exports =  new GraphQLSchema({
    query: busQueryType
});