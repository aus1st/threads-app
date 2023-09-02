import express from 'express';
import {ApolloServer} from '@apollo/server'
import {expressMiddleware} from '@apollo/server/express4'
const app = express();

async function init() {
const port = Number(process.env.PORT) || 3000;
app.use(express.json());

const gqlServer = new ApolloServer({
        typeDefs:`
        type Query {
            hello: String
            say(name: String): String
        }
        `,
        resolvers:{
            Query: {
                 hello: ()=> 'Hey there, i am a graphql server!',
                 say:(_,{name}: {name: string})=> `Hello ${name}, how are you!`,
            }
        }
    })
    
    await gqlServer.start();



    app.use('/graphql', expressMiddleware(gqlServer))
    app.get('/',(req,res)=>{
        res.json({message: 'Server is up and running'})
    })

       
    app.listen(port, ()=>{
        console.log(`Server is listening on ${port}`)
    })
    

}

init();
