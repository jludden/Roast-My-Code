
import * as React from 'react';
import '../App.css';
import { ApolloClient } from 'apollo-client';
import gql from 'graphql-tag';

import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks';

export const AppSyncChatView = ({}) => {
    return (
        <span>Hello World</span>
    );  
}