import React from 'react';
import { ApolloProvider } from 'react-apollo';

import { createAuthLink } from 'aws-appsync-auth-link';
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link';
import ApolloClient from 'apollo-boost';
import { ApolloLink } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

// import AWSAppSyncClient, { defaultDataIdFromObject } from 'aws-appsync';
// import { Rehydrated } from 'aws-appsync-react';
import EventComments from './Components/EventComments';
// import './App.css';
import appSyncConfig from './aws-exports';
import { eventId } from './aws-chatroom-id';

export const ChatApp = () => {
  
  const event = {
    id: eventId, 
    comments: []
  }
  
  return (
    <div className='App'>
    hello world - put comments here
    
    </div>
  );
  //   <EventComments eventId={event.id} comments={event.comments} />
}

// old version of graphql client using aws-appsync. 
// as of july 2020 (and for something like a whole year now)
// aws-appsync does not support apollo > 2.4.6
// const client = new AWSAppSyncClient({
//   url: appSyncConfig.aws_appsync_graphqlEndpoint,
//   region: appSyncConfig.aws_appsync_region,
//   auth: {
//     type: appSyncConfig.aws_appsync_authenticationType,
//     apiKey: appSyncConfig.aws_appsync_apiKey,
//   },
//   cacheOptions: {
//     dataIdFromObject: (obj) => {
//       let id = defaultDataIdFromObject(obj);

//       if (!id) {
//         const { __typename: typename } = obj;
//         switch (typename) {
//           case 'Comment':
//             return `${typename}:${obj.commentId}`;
//           default:
//             return id;
//         }
//       }

//       return id;
//     }
//   }
// });


const url = appSyncConfig.aws_appsync_graphqlEndpoint;
const region = appSyncConfig.aws_appsync_region;
const auth = {
  type: appSyncConfig.aws_appsync_authenticationType,
  apiKey: appSyncConfig.aws_appsync_apiKey,
};
const httpLink = createHttpLink({ uri: url });
const link = ApolloLink.from([
  createAuthLink({ url, region, auth }),
  createSubscriptionHandshakeLink({url, region, httpLink})
]);

export const awsClient = new ApolloClient({
  link,
  cache: new InMemoryCache() // todo may want to re-use cache created in App.tsx
});

const WithProvider = () => (
  <ApolloProvider client={awsClient}>
    {/* <Rehydrated> */}
      <ChatApp />
    {/* </Rehydrated> */}
  </ApolloProvider>
);

export default WithProvider;