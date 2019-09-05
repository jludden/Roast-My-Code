const { ApolloServer, gql } = require("apollo-server-lambda");
const { createHttpLink } = require("apollo-link-http");
const fetch = require("node-fetch");
const {
  introspectSchema,
  makeRemoteExecutableSchema
} = require("graphql-tools");

exports.handler = async function(event, context) {
  console.log("github secret: "+process.env.REACT_APP_GITHUB_PAT);

  /*
    export const client = new ApolloClient({
      cache,
      uri:  "https://api.github.com/graphql",
      headers: {
        Authorization: `bearer ${process.env.REACT_APP_GITHUB_PAT}`,
      } 
    });
  */



  /** required for github auth */ 
  if (!process.env.REACT_APP_GITHUB_PAT) {
    const msg = `   REACT_APP_GITHUB_PAT missing.  `;
    console.error(msg);
    return {
      statusCode: 500,
      body: JSON.stringify({ msg })
    };
  }
  const b64encodedSecret = Buffer.from(
    process.env.REACT_APP_GITHUB_PAT + ":" // weird but they
  ).toString("base64");
  // const headers = { Authorization: `Basic ${b64encodedSecret}` };
  const headers = { Authorization: `bearer ${process.env.REACT_APP_GITHUB_PAT}` };


  /** standard creation of apollo-server executable schema */
  const link = createHttpLink({
    uri: "https://api.github.com/graphql", // modify as you see fit 
    fetch,
    headers
  });
  const schema = await introspectSchema(link);
  const executableSchema = makeRemoteExecutableSchema({
    schema,
    link
  });
  const server = new ApolloServer({
    schema: executableSchema
  });
  return new Promise((yay, nay) => {
    const cb = (err, args) => (err ? nay(err) : yay(args));
    server.createHandler()(event, context, cb);
  });
};
