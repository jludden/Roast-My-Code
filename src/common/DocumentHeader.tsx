import * as React from "react";
import '../App.css';
import API, { IGithubSearchResults } from "../api/API";

// import ICCProps from './CommentableCode';

import "rbx/index.css";
import { Section, Title, Tag, Container, Input, Button, Block, Help, Control, Delete, Field } from "rbx";

export interface ICCProps {
    documentName: string,
    commentsCount: number,
}

interface IHeaderState {
    results: IGithubSearchResults
}

export default class DocumentHeader extends React.Component<ICCProps, IHeaderState> {
    public state: IHeaderState = {
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
            <Section backgroundColor = "primary" gradient>
                <Container  color="primary">
                    <Title>{this.props.documentName}</Title>
                    <Title subtitle>number of comments: {this.props.commentsCount}</Title>
                    <Field kind="addons">
                    <Control>
                        <Input placeholder="Find a repository" />
                    </Control>
                    <Control>
                        <Button color="info" onClick={this.handleSearch}>Search</Button>
                    </Control>
                    </Field>
                    <Tag.Group>
                        <Tag rounded> Java </Tag>
                        <Tag> Kotlin <Delete></Delete></Tag>
                        <Tag delete> just deletes </Tag>
                    </Tag.Group>
                    <p>COUNT: {this.state.results.data.total_count}</p>
                    {this.state.results.data.items.map(item => (
                       ` <p> 
                            item: ${item.name}
                        <p/>`
                    ))}
                </Container>
            </Section>
        );
    }

    private handleSearch = async () => {
            
        const query = "reeflifesurvey"; // todo
        var results = await API.searchRepos(query);
 
        this.setState({results});
    };

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