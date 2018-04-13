const axios = require('axios');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

const customerType = new GraphQLObjectType({
    name: 'customerType',
    fields: () =>({
        id: {
            type: GraphQLInt
        },
        firstName: {
            type: GraphQLString
        },
        lastName:{
            type: GraphQLString
        },
        email: {
            type: GraphQLString
        },
        company:{
            type: GraphQLString
        },
        country:{
            type: GraphQLString
        },
        creditCardType:{
            type: GraphQLString
        },
        job: {
            type: GraphQLString
        }
    }) 
});

const rootQuery = new GraphQLObjectType({
    name: 'rootQuery',
    fields: {
        customer: {
            type: customerType,
            args: {
                id: {
                    type: GraphQLInt
                }
            },
            resolve(root, args){
                return axios.get('http://localhost:3000/customers/' + args.id)
                            .then((response) =>{
                                return response.data;
                            });
                       
            }
        },
        customers:{
            type: new GraphQLList(customerType),
            resolve(root, args){
                return axios.get('http://localhost:3000/customers')
                            .then((response) =>{
                                return  response.data;
                            });
            }
        }
    }
});

const mutation = new GraphQLObjectType({
    name: "mutation",
    fields:{
        addCustomer: {
            type: customerType,
            args: {
                firstName: {
                    type: new GraphQLNonNull(GraphQLString) 
                },
                lastName:{
                    type: new GraphQLNonNull(GraphQLString)
                },
                email: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                company:{
                    type: new GraphQLNonNull(GraphQLString)
                },
                country:{
                    type: new GraphQLNonNull(GraphQLString)
                },
                creditCardType:{
                    type: new GraphQLNonNull(GraphQLString)
                },
                job: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve(root, args){
                return axios.post('http://localhost:3000/customers', args)
                            .then((response) =>{
                                return  response.data;
                            });
            }
        },
        updateCustomer: {
            type: customerType,
            args: {
                id:{
                    type: new GraphQLNonNull(GraphQLInt)
                },
                firstName: {
                    type: GraphQLString 
                },
                lastName:{
                    type: GraphQLString
                },
                email: {
                    type: GraphQLString
                },
                company:{
                    type: GraphQLString
                },
                country:{
                    type: GraphQLString
                },
                creditCardType:{
                    type: GraphQLString
                },
                job: {
                    type: GraphQLString
                }
            },
            resolve(root, args){
                return axios.patch('http://localhost:3000/customers/' + args.id, args)
                            .then((response) =>{
                                return  response.data;
                            });
            }
        },
        deleteCustomer: {
            type: customerType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLInt) 
                }
            },
            resolve(root, args){
                return axios.delete('http://localhost:3000/customers/' + args.id)
                            .then((response) =>{
                                return  response.data;
                            });
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: rootQuery,
    mutation: mutation
});