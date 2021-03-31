const { ApolloServer } = require('apollo-server-lambda');
const { introspectSchema, makeRemoteExecutableSchema } = require('graphql-tools');
const { fetch } = require('cross-fetch');
const { print } = require('graphql');

const createHandler = async () => {
    // https://www.graphql-tools.com/docs/remote-schemas/#creating-an-executor
    const executor = async ({ document, variables }) => {
      if (!process.env.RMC_GITHUB_PAT) {
        console.log('no Github auth token provided, please set environment variable RMC_GITHUB_PAT');
      }

      const query = print(document);
      const fetchResult = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `bearer ${process.env.RMC_GITHUB_PAT}`,
        },
        body: JSON.stringify({ query, variables })
      });
      return fetchResult.json();
    }; 

    const schema = await introspectSchema(executor); 
    const executableSchema = makeRemoteExecutableSchema({
        schema,
        executor
    });
    const server = new ApolloServer({
        schema: executableSchema,
        uploads: false
    });

		console.log("creating graphql handler");
    return server.createHandler();
}

// The function's class stays in memory, 
// so clients and variables that are declared outside of the handler method
// in initialization code can be reused. 
const initPromise = createHandler();

exports.graphqlHandler = async function(event, context) {
	const handler = await initPromise;

  console.log("handling event");
  console.log(event);


  return new Promise((resolve, reject) => {
    const callbackFilter = (error, output) => {
      console.log('finished:'+output);
      resolve(
        {
          ...output, // should have the body and some headers
          "statusCode": 200,
          "isBase64Encoded": false,
          "headers": {
            ...output.headers,
            "access-control-allow-origin": "https://roast-my-code.com"
          },
        });
    }
    handler(event, context, callbackFilter);
  })
}

