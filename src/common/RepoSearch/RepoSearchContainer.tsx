import * as React from "react";
import '../../App.css';
// import API, { IGithubSearchResults } from "../api/API";
import { FaBeer, FaBook, FaSearch, FaCodeBranch, FaGithub } from 'react-icons/fa';
import RepoSearch from "./RepoSearch";
import RepoExplorer from "../RepoContents";
import "rbx/index.css";
import { Section, Title, Tag, Container, Input, Button, Block, Help, Control, Delete, Field, Panel, Checkbox, Icon } from "rbx";
import IntrospectionResultData, { Repository } from '../../generated/graphql';

export interface IRepoSearchContainerProps {
    loadRepoHandler: (repo: Repository) => void // when a repository is selected
}

// color: Variables["colors"]
interface IRepoSearchContainerState {
    // query: string,
    // queryColor: "primary" | "link" | "success" | "info" | "warning" | "danger" | undefined,
    // results: IGithubSearchResults
}

export default class RepoSearchContainer extends React.Component<IRepoSearchContainerProps, IRepoSearchContainerState> {
    public state: IRepoSearchContainerState = { };
    //     query: "",
    //     queryColor: undefined,
    //     results: {
    //         data: {
    //             total_count: -1,
    //             incomplete_results: false,
    //             items: []
    //         }
    //     }
    //   };


    public render() {
        return (
            <Section>
                <Container>
                    <Title>Repo Search Container</Title>
                    <Tag.Group>
                        <Tag rounded> Java </Tag>
                        <Tag> Kotlin <Delete></Delete></Tag>
                        <Tag delete> just deletes </Tag>
                    </Tag.Group>

                    {/* <RepoSearch/> */}

                    <RepoSearch 
                        loadRepoHandler={this.props.loadRepoHandler}
                        queryVariables={{                        
                            queryString: "language:JavaScript stars:>10000",
                            first: 5
                        }}
                    />
                        
                    {/* <RepoExplorer 
                        queryVariables={{path: "master:app/src/main/java/me/jludden/reeflifesurvey"}}
                        loadFileHandler={this.props.loadFileHandler}
                        /> */}
                
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