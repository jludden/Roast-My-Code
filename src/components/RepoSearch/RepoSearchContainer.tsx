import React, { useState, useEffect } from "react";
import '../../App.css';
import { FaBeer, FaBook, FaSearch, FaCodeBranch, FaGithub } from 'react-icons/fa';
import RepoSearch, {IGithubQueryVariables, IGithubQueryProps} from "./RepoSearch";
import "rbx/index.css";
import { Section, Title, Tag, Container, Input, Button, Block, Help, Control, Delete, Field, Panel, Checkbox, Icon } from "rbx";
import IntrospectionResultData, { Repository } from '../../generated/graphql';
import { useQueryParam, NumberParam, StringParam } from 'use-query-params';
import AwesomeDebouncePromise from 'awesome-debounce-promise';

export interface IRepoSearchContainerProps {
    loadRepoHandler: (repo: Repository) => void, // when a repository is selected
    loadRecommendedRepo: () => void
}

const RepoSearchContainer = (props: IRepoSearchContainerProps) => {

    const [queryString, setQueryString] = useQueryParam("q", StringParam);  
    const queryVariables = {
        queryString: queryString || "",
        first: 5
    }
  
    // Set up debounced handler on the search box
    const searchAPI = ((text: string) => {
        setQueryString(text);
    });
    const searchAPIDebounced = AwesomeDebouncePromise(searchAPI, 500);
    const handleQueryChange = (event: React.FormEvent<HTMLInputElement>) => {
      const query = event.currentTarget.value; // todo debounce and instantly search?
      searchAPIDebounced(query);
    };
  
    return (
        <Section>
        <Container>
            <Panel>
                <Panel.Heading>Github Repositories</Panel.Heading>
                <Panel.Tab.Group>
                    <Panel.Tab active>search all</Panel.Tab>
                    <Panel.Tab onClick={() => props.loadRecommendedRepo()}>recommended</Panel.Tab>
                    <Panel.Tab>most commented</Panel.Tab>
                    <Panel.Tab>starred</Panel.Tab>
                    <Panel.Tab>personal</Panel.Tab>
                </Panel.Tab.Group>

                <Panel.Block>
                    <Control iconLeft>
                        <Input size="small" type="text" placeholder={queryString ? queryString : "search"} onChange={handleQueryChange} />
                        <Icon size="small" align="left">
                        <FaSearch />
                        </Icon>
                    </Control>
                </Panel.Block>

                <RepoSearch
                    queryVariables={queryVariables}
                    loadRepoHandler={props.loadRepoHandler} />
            </Panel>
        </Container>
    </Section>
    );    
}

export default RepoSearchContainer;