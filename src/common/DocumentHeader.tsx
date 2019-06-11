import * as React from "react";
import '../App.css';
import API, { IGithubSearchResults } from "../api/API";
import { FaBeer, FaBook, FaSearch, FaCodeBranch, FaGithub } from 'react-icons/fa';
import RepoSearch from "./RepoSearch";
import RepoExplorer from "./RepoExplorer";
import { Blob } from '../generated/graphql';

// import ICCProps from './CommentableCode';

import "rbx/index.css";
import { Section, Title, Tag, Container, Input, Button, Block, Help, Control, Delete, Field, Panel, Checkbox, Icon } from "rbx";

export interface ICCProps {
    documentName: string,
    commentsCount: number,
    loadFileHandler: (file: Blob) => void // when a file is selected
}

// color: Variables["colors"]
interface IHeaderState {
    query: string,
    queryColor: "primary" | "link" | "success" | "info" | "warning" | "danger" | undefined,
    results: IGithubSearchResults
}

export default class DocumentHeader extends React.Component<ICCProps, IHeaderState> {
    public state: IHeaderState = {
        query: "",
        queryColor: undefined,
        results: {
            data: {
                total_count: -1,
                incomplete_results: false,
                items: []
            }
        }
      };


    public render() {
        return (
            <Section>
                <Container>
                    <Title>{this.props.documentName}</Title>
                    <Title subtitle><FaGithub/> number of comments: {this.props.commentsCount}</Title>
                    
                    <Tag.Group>
                        <Tag rounded> Java </Tag>
                        <Tag> Kotlin <Delete></Delete></Tag>
                        <Tag delete> just deletes </Tag>
                    </Tag.Group>

                    {/* <RepoSearch/> */}

                    <RepoSearch queryVariables={{
                        queryString: "language:JavaScript stars:>10000",
                        first: 5
                        }}/>
                        
                    <RepoExplorer 
                        queryVariables={{path: "master:app/src/main/java/me/jludden/reeflifesurvey"}}
                        loadFileHandler={this.props.loadFileHandler}
                        />

                    {/* TEST PANEL */}
                    {/* <Panel>
                        <Panel.Heading>repositories</Panel.Heading>
                        <Panel.Block>
                            <Control iconLeft>
                                <Input size="small" type="text" placeholder="search" />
                                <Icon size="small" align="left">
                                    <FaSearch />
                                </Icon>
                            </Control>
                        </Panel.Block>
                        <Panel.Tab.Group>
                            <Panel.Tab active>all</Panel.Tab>
                            <Panel.Tab>public</Panel.Tab>
                            <Panel.Tab>private</Panel.Tab>
                            <Panel.Tab>sources</Panel.Tab>
                            <Panel.Tab>forks</Panel.Tab>
                        </Panel.Tab.Group>
                        <RepoSearch queryString="language:JavaScript stars:>10000" first={5}/>

                        <Panel.Block as="a" active>
                            <Panel.Icon>
                                <FaBook />
                            </Panel.Icon>
                            bulma
                        </Panel.Block>
                        <Panel.Block>
                            <Panel.Icon>
                                <FaBook />
                            </Panel.Icon>
                            marksheet
                        </Panel.Block>
                        <Panel.Block>
                            <Panel.Icon>
                                <FaBook />
                            </Panel.Icon>
                            minireset.css
                        </Panel.Block>
                        <Panel.Block>
                            <Panel.Icon>
                               <FaBook />
                            </Panel.Icon>
                            jgthms.github.io
                        </Panel.Block>
                        <Panel.Block>
                            <Panel.Icon>
                                <FaCodeBranch />
                            </Panel.Icon>
                            daniellowtw/infboard
                        </Panel.Block>
                        <Panel.Block>
                            <Panel.Icon>
                                <FaCodeBranch />
                            </Panel.Icon>
                            mojs
                        </Panel.Block>
                        <Panel.Block as="label">
                            <Checkbox />
                            remember me
                        </Panel.Block>
                        <Panel.Block>
                            <Button fullwidth color="link" outlined>
                            reset all filters
                            </Button>
                        </Panel.Block>
                        </Panel> */}

                    {/* OLD  */}
                    {/* <Field kind="addons">
                        <Control>
                            <Input placeholder="Find a repository" 
                                type="text" 
                                color={this.state.queryColor}
                                value={this.state.query} 
                                onChange={this.handleQueryChange}/>
                        </Control>
                        <Control>
                            <Button color="info" onClick={this.handleSearch}>Search</Button>
                        </Control>
                    </Field> */}

                    {/* <p>COUNT: {this.state.results.data.total_count}</p>
                    {this.state.results.data.items.map(item => (
                       ` <p> 
                            item: ${item.name}
                        <p/>`
                    ))} */}
                </Container>
            </Section>
        );
    }



    // private handleQueryChange = (event: React.FormEvent<HTMLInputElement>) => {
    //     this.setState({query: event.currentTarget.value});
    // }

    // private handleSearch = async (event: React.SyntheticEvent<EventTarget>) => {
    //     event.preventDefault();   

    //     const query = this.state.query; // todo
    //     if (query) {
    //         var results = await API.searchRepos(query);
    //         this.setState({results});
    //         this.setState({queryColor: "success"});

    //     }
    //     else {
    //         this.setState({queryColor: "danger"});
    //     }

    // };

                        /* <Field kind="addons">
                                <Control>
                                    <Button static>github.com/search?q=</Button>
                                </Control>
                                <Control>
                                    <Input type="text" placeholder="Your email" />
                                </Control>
                                <Help>
                                    Enter the GitHub Repository to Search
                                </Help>
                            </Field> */
}