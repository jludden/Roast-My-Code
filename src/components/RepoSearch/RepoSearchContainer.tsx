import React, { useState, useEffect } from 'react';
import '../../App.css';
import { FaBeer, FaBook, FaSearch, FaCodeBranch, FaGithub, FaShareSquare, FaPlay } from 'react-icons/fa';
import { RecommendedRepositories } from './RecommendedRepos';
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
import IntrospectionResultData, { Repository, Scalars } from '../../generated/graphql';
import RepoSearch, { IGithubQueryVariables, IGithubQueryProps } from './RepoSearch';
// import { analytics } from '../../services/firebase';
// import { githubClient } from '../../App';

export interface IRepoSearchContainerProps {
    loadRepoHandler: (path: Scalars["URI"]) => void; // when a repository is selected
    loadRecommendedRepo: () => void;
}

const RepoSearchContainer = (props: IRepoSearchContainerProps) => {
    const [currentTab, setCurrentTab] = useState(true);

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
                <Panel backgroundColor="grey-darker">
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
                                    {/* <FaShareAltSquare />
                                    <FaShareSquare /> */}
                                    <Icon><FaPlay /></Icon>
                                    <span className="link-to-site-code-long">This website's code</span>
                                    <span className="link-to-site-code-short">!</span>
                                </Button>
                            </span>
                        </div>
                    </Panel.Heading>
                    <Panel.Tab.Group className="panel-container">
                        <Panel.Tab active={!!currentTab} onClick={() => setCurrentTab(true)}>search all</Panel.Tab>
                        <Panel.Tab active={!currentTab} onClick={() => setCurrentTab(false)}>recommended</Panel.Tab>
                        {/* <Panel.Tab>most commented</Panel.Tab>
                        <Panel.Tab>starred</Panel.Tab>
                        <Panel.Tab>personal</Panel.Tab> */}
                    </Panel.Tab.Group>

                    {currentTab && (
                        <>
                            <Panel.Block style={{paddingBottom: '0.25em'}}>
                                <Control iconLeft>
                                    <Input
                                        color="light"
                                        size="small"
                                        className="input-dark"
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
                        </>
                    )}

                    {!currentTab && <RecommendedRepositories loadRepoHandler={props.loadRepoHandler}/>}
                </Panel>
            </Container>
        </Section>
    );
};

export default RepoSearchContainer;
