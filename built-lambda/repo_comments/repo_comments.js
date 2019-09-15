/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
const { ApolloServer } = require('apollo-server-lambda');
const { createHttpLink } = require('apollo-link-http');
const fetch = require('node-fetch');
const { introspectSchema, makeRemoteExecutableSchema } = require('graphql-tools');

exports.handler = async function(event, context) {
    // console.log(`admin secret: ${process.env.FAUNADB_ADMIN_SECRET}`);
    // console.log(`server secret: ${process.env.FAUNADB_SERVER_SECRET}`);
    // console.log(`client secret: ${process.env.FAUNADB_CLIENT_SECRET}`);
    // console.log(`saved app client secret: ${process.env.RMC_FAUNA_CLIENT}`);

    /** required for Fauna GraphQL auth */
    if (!process.env.RMC_FAUNA_CLIENT) {
        const msg = `
    FAUNADB_SERVER_SECRET missing. 
    Did you forget to install the fauna addon or forgot to run inside Netlify Dev?
    `;
        console.error(msg);
        return {
            statusCode: 500,
            body: JSON.stringify({ msg }),
        };
    }
    const b64encodedSecret = Buffer.from(
        `${process.env.RMC_FAUNA_CLIENT}:`, // weird but they
    ).toString('base64');
    const headers = { Authorization: `Basic ${b64encodedSecret}` };

    /** standard creation of apollo-server executable schema */
    const link = createHttpLink({
        uri: 'https://graphql.fauna.com/graphql', // modify as you see fit
        fetch,
        headers,
    });
    const schema = await introspectSchema(link);
    const executableSchema = makeRemoteExecutableSchema({
        schema,
        link,
    });
    const server = new ApolloServer({
        schema: executableSchema,
    });
    return new Promise((yay, nay) => {
        const cb = (err, args) => (err ? nay(err) : yay(args));
        server.createHandler()(event, context, cb);
    });
};
