import React, { useState, useEffect } from 'react';
import '../../App.css';
import { FaBeer, FaBook, FaSearch, FaCodeBranch, FaGithub } from 'react-icons/fa';
// import 'rbx/index.css';
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
} from 'rbx';
import { useQueryParam, NumberParam, StringParam } from 'use-query-params';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import IntrospectionResultData, { Repository } from '../../generated/graphql';
import RepoSearch, { IGithubQueryVariables, IGithubQueryProps } from './RepoSearch';
// import { analytics } from '../../services/firebase';
// import { githubClient } from '../../App';

export interface IRepoSearchContainerProps {
    loadRepoHandler: (repo: Repository) => void; // when a repository is selected
    loadRecommendedRepo: () => void;
}

const RepoSearchContainer = (props: IRepoSearchContainerProps) => {
    const [queryString, setQueryString] = useQueryParam('q', StringParam);
    const queryVariables = {
        queryString: queryString || '',
        first: 5,
    };

    // Set up debounced handler on the search box toDO use https://github.com/xnimorz/use-debounce
    const searchAPI = (text: string) => {
        // analytics.logEvent(`github repository search for: {text}`);
        setQueryString(text);
    };
    const searchAPIDebounced = AwesomeDebouncePromise(searchAPI, 500);
    const handleQueryChange = (event: React.FormEvent<HTMLInputElement>) => {
        const query = event.currentTarget.value; // todo debounce and instantly search?
        searchAPIDebounced(query);
    };

    return (
        <Section>
            <Title size={1}>Search Code Repositories</Title>

            <Container>
                <Panel backgroundColor="grey-dark">
                    <Panel.Heading backgroundColor="black-bis">
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ display: 'flex', alignItems: 'center' }}>
                                <FaGithub size="1.5em" />
                                &nbsp;&nbsp;Github Repositories
                            </span>
                            <span>
                                <Button
                                    as="a"
                                    outlined
                                    color="link"
                                    href="/repo/jludden/Roast-My-Code?path=master%3Asrc%2F"
                                >
                                    This website's code
                                </Button>
                            </span>
                        </div>
                    </Panel.Heading>
                    <Panel.Tab.Group>
                        <Panel.Tab active>search all</Panel.Tab>
                        <Panel.Tab onClick={() => props.loadRecommendedRepo()}>recommended</Panel.Tab>
                        {/* <Panel.Tab>most commented</Panel.Tab>
                        <Panel.Tab>starred</Panel.Tab>
                        <Panel.Tab>personal</Panel.Tab> */}
                    </Panel.Tab.Group>

                    <Panel.Block>
                        <Control iconLeft>
                            <Input
                                size="small"
                                type="text"
                                placeholder={queryString || 'search'}
                                onChange={handleQueryChange}
                            />
                            <Icon size="small" align="left">
                                <FaSearch />
                            </Icon>
                        </Control>
                    </Panel.Block>

                    <RepoSearch
                        // githubClient={githubClient}
                        queryVariables={queryVariables}
                        loadRepoHandler={props.loadRepoHandler}
                    />
                </Panel>
            </Container>
        </Section>
    );
};

export default RepoSearchContainer;
