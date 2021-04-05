# Github GraphQL Api Lambda Proxy

Used by Roast My Code to hide the Github API key

### Setup
Create an API Key with Github, then set it as an environment variable 
named RMC_GITHUB_PAT in lambda
Serverless has been configured to read the environment variable from secrets.yml

### Debugging locally
A great way to debug this in VSCode is with:
https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_javascript-debug-terminal
then using the opened terminal to execute: 
`$ serverless invoke local --function graphql --path event.json`
or simply
`$ yarn test`

### Deploying to Lambda
`serverless deploy`
Make sure to set RMC_GITHUB_PAT environment variable in Lambda console

### Testing in Api Gateway console
POST /graphql
Here is a sample header and body to test with:

Headers:
```
authority: roast-my-code.com
method: POST
path: /.netlify/functions/repo_github
scheme: https
accept: */*
accept-encoding: gzip, deflate, br
accept-language: en-US,en;q=0.9
content-length: 1218
content-type: application/json
origin: https://roast-my-code.com
referer: https://roast-my-code.com/
sec-fetch-dest: empty
sec-fetch-mode: cors
sec-fetch-site: same-origin
```

body:
```
{"operationName":"SearchMostTop10Star","variables": {"queryString":"js","first":5},"query":"query SearchMostTop10Star($queryString: String!, $first: Int) {  search(query: $queryString, type: REPOSITORY, first: $first) {    repositoryCount    edges {      node { ... on Repository { nameWithOwner name id databaseId createdAt descriptionHTML url resourcePath updatedAt defaultBranchRef { name __typename } owner { id login __typename } primaryLanguage { name color __typename } languages(first: 5) { nodes { name __typename } __typename } descriptionHTML stargazers { totalCount __typename } forks { totalCount __typename } __typename } __typename } __typename } __typename }}" }
```