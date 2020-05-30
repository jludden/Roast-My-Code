import React from 'react';
import { ApolloProvider } from 'react-apollo';
import AWSAppSyncClient, { defaultDataIdFromObject } from 'aws-appsync';
import { Rehydrated } from 'aws-appsync-react';
// import EventComments from './Components/EventComments';
import './App.css';
import appSyncConfig from './aws-exports';
import { eventId } from './aws-chatroom-id';

export const App = () => {
  
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


const client = new AWSAppSyncClient({
  url: appSyncConfig.aws_appsync_graphqlEndpoint,
  region: appSyncConfig.aws_appsync_region,
  auth: {
    type: appSyncConfig.aws_appsync_authenticationType,
    apiKey: appSyncConfig.aws_appsync_apiKey,
  },
  cacheOptions: {
    dataIdFromObject: (obj) => {
      let id = defaultDataIdFromObject(obj);

      if (!id) {
        const { __typename: typename } = obj;
        switch (typename) {
          case 'Comment':
            return `${typename}:${obj.commentId}`;
          default:
            return id;
        }
      }

      return id;
    }
  }
});

const WithProvider = () => (
  <ApolloProvider client={client}>
    <Rehydrated>
      <App />
    </Rehydrated>
  </ApolloProvider>
);

export default WithProvider;