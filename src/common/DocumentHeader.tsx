import * as React from "react";
import '../App.css';
// import ICCProps from './CommentableCode';

import "rbx/index.css";
import { Section, Title, Tag, Container, Input, Button, Block, Help, Control, Delete, Field } from "rbx";

export interface ICCProps {
    documentName: string,
    commentsCount: number,
}

export default class DocumentHeader extends React.Component<ICCProps, object> {
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
                        <Button color="info">Search</Button>
                    </Control>
                    </Field>
                    <Tag.Group>
                        <Tag rounded> Java </Tag>
                        <Tag> Kotlin <Delete></Delete></Tag>
                        <Tag delete> just deletes </Tag>
                    </Tag.Group>
                </Container>
            </Section>
        );
    }

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