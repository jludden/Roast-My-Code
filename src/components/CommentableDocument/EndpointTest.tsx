import * as React from 'react';
import * as R from 'ramda';
import { ApolloClient } from 'apollo-client';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import {
    Section,
    Title,
    Tag,
    Container,
    Input,
    Button,
    Block,
    Help,
    Control,
    Delete,
    Field,
    Panel,
    Checkbox,
    Icon,
    Progress,
} from 'rbx';

const TEST_FQL_ENDPOINT = gql`
    query test($name: String!) {
        sayHello(name: $name)
    }
`;

export const EndpointTest = () => {
    const [showTest, setShowTest] = React.useState(false);

    return (
        <>
            <Button color="info" onClick={() => setShowTest(!showTest)}>
                Test Endpoint
            </Button>
            {showTest && <EndpointTestDisplay />}
        </>
    );
};

export const EndpointTestDisplay = () => {
    // Load Repo
    const name = 'Jason';
    const { data, error, loading, client, refetch } = useQuery<any>(TEST_FQL_ENDPOINT, {
        variables: { name },
    });

    return (
        <>
            <Title> hello world</Title>
            {loading && <p>loading..</p>}
            {!loading && data && <p>{data.sayHello}</p>}
        </>
    );
};
