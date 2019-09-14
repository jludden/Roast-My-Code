#!/usr/bin/env node

/* sync GraphQL schema to your FaunaDB account - use with `netlify dev:exec <path-to-this-file>` */
function createFaunaGraphQL() {
  console.log("admin secret: "+process.env.FAUNADB_ADMIN_SECRET);
  console.log("server secret: "+process.env.FAUNADB_SERVER_SECRET);
  console.log("client secret: "+process.env.FAUNADB_CLIENT_SECRET);
  console.log("saved app client secret: "+process.env.RMC_FAUNA_CLIENT);


  if (!process.env.RMC_FAUNA_CLIENT) {
    console.log("No FAUNADB_SERVER_SECRET in environment, skipping DB setup");
  }
  console.log("Upload GraphQL Schema!");

  const fetch = require("node-fetch");
  const fs = require("fs");
  const path = require("path");
  var dataString = fs
    .readFileSync(path.join(__dirname, "schema.graphql"))
    .toString(); // name of your schema file

  // encoded authorization header similar to https://www.npmjs.com/package/request#http-authentication
  // const Authorization = Buffer.from(
  //   process.env.FAUNADB_SERVER_SECRET + ":"
  // ).toString("base64");

  // { Authorization: `bearer ${process.env.RMC_FAUNA_CLIENT}`}
  // const headers = Buffer.from(
  //   process.env.FAUNADB_SERVER_SECRET + ":"
  // ).toString("base64");
  //const headers = `Basic process.env.FAUNADB_SERVER_SECRET`;
  const b64encodedSecret = Buffer.from(
    process.env.FAUNADB_SERVER_SECRET + ":" // weird but they
  ).toString("base64");
  //  const headers = `Basic ${b64encodedSecret}`;
   const headers = `Bearer ${process.env.RMC_FAUNA_CLIENT}`;
  // const headers = { Authorization: `Basic ${b64encodedSecret}` };
  //const headers = { Authorization: `Bearer ${process.env.FAUNADB_SERVER_SECRET}`};

    console.log("headers: "+headers);
//     headers: { Authorization }

  var options = {
    method: "POST",
    body: dataString,
    headers: { Authorization: headers }
  };

  fetch("https://graphql.fauna.com/import", options)
    // // uncomment for debugging
    .then(res => res.text())
    .then(body => {
      console.log(
        "Netlify Functions:Create - `fauna-graphql/sync-schema.js` success!"
      );
      console.log(body);
    })
    .catch(err => console.error("something wrong happened: ", { err }));
}

createFaunaGraphQL();
