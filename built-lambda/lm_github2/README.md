# Github GraphQL Api Lambda Proxy

Used by Roast My Code to hide the Github API key

# Setup
Create an API Key with Github, then set it as an environment variable 
named RMC_GITHUB_PAT in lambda
Serverless has been configured to read the environment variable from secrets.yml

### Debugging
A great way to debug this in VSCode is with:
https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_javascript-debug-terminal
then using the opened terminal to execute: 
`$ serverless invoke local --function graphql --path event.json`
or simply
`$ yarn test`

# Deploying
`serverless deploy`
Make sure to set RMC_GITHUB_PAT environment variable in Lambda console