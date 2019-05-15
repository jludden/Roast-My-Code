/* eslint-disable */
const fetch = require("node-fetch");
exports.handler = async function(event, context) {
  try {
    const url = "https://api.github.com/repos/jludden/ReefLifeSurvey---Species-Explorer/contents/app/src/main/java/me/jludden/reeflifesurvey/detailed/DetailsActivity.kt";
    const response = await fetch(url, {
      headers: { Accept: "application/json" }
    });
    if (!response.ok) {
      // NOT res.status >= 200 && res.status < 300
      // return { statusCode: response.status, body: response.statusText };
      return {statusCode: 500, body: JSON.stringify("github call failed")};
    }
    const data = await response.json();

    return data;
    return {
      statusCode: 200,
      body: data
    };

    // return {
    //   statusCode: 200,
    //   body: JSON.stringify({ msg: "data goes here" })
    // };
  } catch (err) {
    console.log(err); // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message }) // Could be a custom message or object i.e. JSON.stringify(err)
    };
  }
};
