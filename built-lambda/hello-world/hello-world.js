exports.handler = async (event, context) => {
  try {
    const subject = event.queryStringParameters.name || "World";
    return { statusCode: 200, body:{msg: 'hello world'} };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
};
