import * as React from 'react';
import { Collapse } from 'react-collapse';
import { githubClient } from '../../App';
import ApolloClient, { gql, ExecutionResult } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import {
    findRepositoryByTitle,
    // eslint-disable-next-line @typescript-eslint/camelcase
    findRepositoryByTitle_findRepositoryByTitle,
    // eslint-disable-next-line @typescript-eslint/camelcase
    findRepositoryByTitle_findRepositoryByTitle_documentsList_data_commentsList_data_comments_data as RoastComment,
} from './types/findRepositoryByTitle';

export interface FindRepoResults {
    currentRepoTitle: string;
    findRepositoryByTitle: findRepositoryByTitle_findRepositoryByTitle;
}
