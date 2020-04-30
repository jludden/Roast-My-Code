  
import React from "react";
import { useSubscription } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { subscribeToNewMessage } from './graphql/subscriptions';
import { graphqlMutation } from 'aws-appsync-react';
import { buildSubscription} from 'aws-appsync';
import {
    SubscribeToNewMessageSubscriptionVariables,
    SubscribeToNewMessageSubscription,
} from './generated/rmc-amp-graphql';

// interface Event {
//   id: string;
//   name: string;
// }

// interface News {
//   subscribeToNewMessage: Event;
// }

// const LATEST_EVENTS = gql`
//   subscription getNewEvents {
//     subscribeToEvents {
//       id
//       name
//     }
//   }
// `;

// interface IAwsConversationSubscriptionVars {
//   conversationId: string;
// }

export default () => {
  const { loading, data } = useSubscription<SubscribeToNewMessageSubscriptionVariables, SubscribeToNewMessageSubscription>(subscribeToNewMessage, {
    variables: { conversationId: 10 }
  }
    );
  //   const { data, error, loading } = useQuery<IGithubDocResponse, IGithubDocQueryVariables>(GITHUB_DOCUMENT_QUERY, {
  //     variables: props.queryVariables,
  //     client: githubClient,
  // }); // todo potentially could get repoComments from cache.readQuery instead of passing it down?!


  return (
    <div>
      <h5>Latest News</h5>
      <p>{loading ? "Loading..." : data!.subscribeToNewMessage.name}</p>
    </div>
  );
};