import React, { useState, useEffect } from "react";
import '../../App.css';
// import API, { IGithubSearchResults } from "../api/API";
import { FaBeer, FaBook, FaSearch, FaCodeBranch, FaGithub } from 'react-icons/fa';
import RepoSearch, {IGithubQueryVariables, IGithubQueryProps} from "./RepoSearch";
import RepoExplorer from "../RepoContents";
import "rbx/index.css";
import { Section, Title, Tag, Container, Input, Button, Block, Help, Control, Delete, Field, Panel, Checkbox, Icon } from "rbx";
import IntrospectionResultData, { Repository } from '../../generated/graphql';
import RepoContents, {UseUrlQuery} from "../RepoContents";
import AwesomeDebouncePromise from 'awesome-debounce-promise';

export interface IRepoSearchContainerProps {
    loadRepoHandler: (repo: Repository) => void, // when a repository is selected
    loadRecommendedRepo: () => void
}

const RepoSearchContainer = (props: IRepoSearchContainerProps) => {
    const [queryVariables, setQueryVariables] = useState({
        queryString: "reeflifesurvey",
        first: 5
    });  
  
    // Set up debounced handler on the search box
    const searchAPI = ((text: string) => {
      setQueryVariables({queryString: text, first: 5});
    });
    const searchAPIDebounced = AwesomeDebouncePromise(searchAPI, 500);
    const handleQueryChange = (event: React.FormEvent<HTMLInputElement>) => {
      const query = event.currentTarget.value; // todo debounce and instantly search?
      searchAPIDebounced(query);
    };
  
    return (
        <Section>
        <Container>
            <Title>Repo Search Container</Title>
            <Tag.Group>
                <Tag rounded> Java </Tag>
                <Tag> Kotlin <Delete></Delete></Tag>
                <Tag delete> just deletes </Tag>
            </Tag.Group>            
            <Panel>
                <UseUrlQuery url={queryVariables.queryString} name={"q"}/>
                <Panel.Heading>Search Repositories</Panel.Heading>
                <Panel.Block>
                <Control iconLeft>
                    <Input size="small" type="text" placeholder="search" onChange={handleQueryChange} />
                    <Icon size="small" align="left">
                    <FaSearch />
                    </Icon>
                </Control>
                </Panel.Block>
                <Panel.Tab.Group>
                <Panel.Tab active>all</Panel.Tab>
                <Panel.Tab onClick={() => props.loadRecommendedRepo()}>recommended</Panel.Tab>
                <Panel.Tab>most commented</Panel.Tab>
                <Panel.Tab>starred</Panel.Tab>
                <Panel.Tab>personal</Panel.Tab>
                </Panel.Tab.Group>
                <RepoSearch
                    queryVariables={queryVariables}
                    loadRepoHandler={props.loadRepoHandler} />
            </Panel>
        </Container>
    </Section>
    );    
}

export default RepoSearchContainer;