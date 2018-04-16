const Promises = require('bluebird');
const mc = require('../dbConnection');
const {GraphQLDate} = require('graphql-iso-date');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

// Bus type specification!
const busType = new GraphQLObjectType({
    name: 'bus',
    description: 'Describing bus type!',
    fields: () => ({
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
            type: GraphQLInt,
        }
    })
});

//Garage type specification!
const garageType = new GraphQLObjectType({
    name: 'garage',
    description: 'Describing garage type!',
    fields: () => ({
        garageId: {
            type: GraphQLInt
        },
        adress: {
            type: GraphQLString
        },
        owner: {
            type: GraphQLString
        },
        buses: {
            type: new GraphQLList(busType),
            description: 'Select all the buses of the specific garage.',
            resolve(root, args){
                return new Promises(function(resolve, reject) {
                    mc.query('SELECT * FROM bus WHERE garageId = ?', [root.garageId], function(err, result) {
                        return (err ? reject(err) : resolve(result));    
                    });
                });
            }
        }
    })
});


//Root query, where all the get queries are described!
const rootQueryType = new GraphQLObjectType({
    name: 'rootQuery',
    description: 'Fetching information about buses and garages!',
    fields: {
        bus: {
            type: busType,
            args: {
                busId: {
                    type: GraphQLInt
                }
            },
            resolve(root, args) {
                return new Promises(function(resolve, reject) {
                    mc.query('SELECT * FROM bus WHERE busId = ?', [args.busId], function(err, result) {
                        return (err ? reject(err) : resolve(result[0]));    
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
        },
        garage: {
            type: garageType,
            args: {
                garageId: {
                    type: GraphQLInt
                }
            },
            resolve(root, args) {
                return new Promises(function(resolve, reject) {
                    mc.query('SELECT * FROM garage WHERE garageId = ?', [args.garageId], function(err, result) {
                        return (err ? reject(err) : resolve(result[0]));    
                    });
                });
            }
        },
        garages: {
            type: new GraphQLList(garageType),
            resolve(root, args) {
                return new Promises(function(resolve, reject){
                    mc.query('SELECT * FROM garage', function(err, result) {
                        return (err ? reject(err) : resolve(result));
                    });
                })
            }
        }
    }
});

//Mutations
const rootMutation = new GraphQLObjectType({
    name: "rootMutation",
    description: 'Mutating information about buses and garages!',
    fields:{
        createNewBus: {
            type: busType,
            args: {
                model: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                indentificationNumber: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                capacity: {
                    type: new GraphQLNonNull(GraphQLInt) 
                },
                dataConstruction: {
                    type: new GraphQLNonNull(GraphQLDate)
                },
                garageId: {
                    type: new GraphQLNonNull(GraphQLInt)
                }               
            },
            resolve(root, args){
                return new Promises(function(resolve, reject) {
                    mc.query('INSERT INTO bus SET ?', args ,function(err, result) {
                        return (err ? reject(err) : resolve(
                            new Promises(function(resolve, reject){
                                mc.query('SELECT * FROM bus WHERE indentificationNumber = ? AND garageId = ?', [args.indentificationNumber, args.garageId], function(err, result) {
                                    return (err ? reject(err) : resolve(result[0]));    
                                });
                            }) 
                        ));
                    });
                });
            }
        },

        updateBus: {
            type: busType,
            args:{
                busId: {
                    type: new GraphQLNonNull(GraphQLInt)
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
            },
            resolve(root, args){
                return new Promises(function(resolve, reject) {
                    mc.query('UPDATE bus SET ? WHERE busId = ?', [args, args.busId] ,function(err, result) {
                        return (err ? reject(err) : resolve(
                            new Promises(function(resolve, reject){
                                mc.query('SELECT * FROM bus WHERE busId = ?', [args.busId], function(err, result) {
                                    return (err ? reject(err) : resolve(result[0]));    
                                });
                            }) 
                        ));
                    });
                });
            }                 
        },

        deleteBus: {
            type: busType,
            args: {
                busId: {
                    type: new GraphQLNonNull(GraphQLInt)
                }
            },
            resolve(root, args) {
                return new Promises(function(resolve, reject) {
                    mc.query('DELETE FROM bus WHERE busId = ?', [args.busId] ,function(err, result) {
                        return (err ? reject(err) : resolve(result));
                    });
                });
            }                 
        },

        createNewGarage: {
            type: garageType,
            args: {
                adress: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                owner: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve(root, args) {
                return new Promises(function(resolve, reject) {
                    mc.query('INSERT INTO garage SET ?', args, function(err, result) {
                        return (err ? reject(err) : resolve(
                            new Promises(function(resolve, reject){
                                mc.query('SELECT * FROM garage WHERE owner = ? AND adress = ?', [args.owner, args.adress], function(err, result) {
                                    return (err ? reject(err) : resolve(result[0]));    
                                });
                            })
                        ));
                    });
                });
            }
        },

        updateGarage: {
            type: garageType,
            args: {
                garageId: {
                    type: new GraphQLNonNull(GraphQLInt)
                },
                adress: {
                    type: GraphQLString
                },
                owner: {
                    type: GraphQLString
                }
            },
            resolve(root, args){
                return new Promises(function(resolve, reject) {
                    mc.query('UPDATE garage SET ? WHERE garageId = ?', [args, args.garageId] ,function(err, result) {
                        return (err ? reject(err) : resolve(
                            new Promises(function(resolve, reject){
                                mc.query('SELECT * FROM garage WHERE garageId = ?', [args.garageId], function(err, result) {
                                    return (err ? reject(err) : resolve(result[0]));    
                                });
                            }) 
                        ));
                    });
                });
            }
        },
        deleteGarage: {
            type: garageType,
            args: {
                garageId: {
                    type: new GraphQLNonNull(GraphQLInt)
                }
            },
            resolve(root, args) {
                return new Promises(function(resolve, reject) {
                    mc.query('DELETE FROM garage WHERE garageId = ?', [args.garageId] ,function(err, result) {
                        return (err ? reject(err) : resolve(result));
                    });
                });
            } 
        }
    }    
});

module.exports = new GraphQLSchema({
    query: rootQueryType, 
    mutation: rootMutation
});
