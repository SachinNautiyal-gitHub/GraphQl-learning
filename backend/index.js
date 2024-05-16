
const express = require('express');
const { ApolloServer } = require('@apollo/server')
const bodyParser = require('body-parser');
const cors = require('cors');

const { expressMiddleware } = require('@apollo/server/express4');
const { default: axios } = require('axios');


const startServer = async () => {
    const app = express();
    const server = new ApolloServer({
         typeDefs:`
           
            type User {
                id : ID!
                name : String!
                email: String!
            }



             type todo {
                  userId: ID!
                  id: ID!
                  title: String!
                  user:User
             } 
             
             type Query {
                 getTodos :[todo]
                 getAlluser:[User]
             }
         
         
         `,

         resolvers:{
             todo:{
                 user: async(todo) => (await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.userId}`)).data,
             },
             Query:{
                getTodos: async()=> (await axios.get('https://jsonplaceholder.typicode.com/todos')).data,
                getAlluser: async()=> (await axios.get('https://jsonplaceholder.typicode.com/users')).data,
             }
         }
    });
    app.use(bodyParser.json());
    app.use(cors());

    await server.start();

    app.use('/graphql', expressMiddleware(server));



    app.listen(5000, () => console.log("Server stated at port 5000"));

}



startServer();