import React, { useState, useEffect } from 'react';
import '../App.css';
import { db } from '../services/firebase';
import { FirebaseQueryInner } from '../components/FirebaseChat/SigninModal';
import { SingleCommentUI } from '../components/SingleCommentView';
import { CardHeader } from '../components/CommentableDocument/CommentContainer';
import { Hero, Title, Container, Message, Box, Textarea, Button, Card, Content, Icon, Delete, Dropdown } from 'rbx';

export const Home = () => {
    const comment = {
        text: 'hello',
        author: { displayName: 'user 1' },
        queryVariables: {
            name: 'ReefLifeSurvey---Species-Explorer',
            owner: 'jludden',
            path: 'master:README.md',
        },
    };

    return (
        <div>
            {/* <Hero primary="danger">
                <Hero.Body>
                    <Container>
                        <Title>Roast My Code</Title>
                        <a href="/Search">
                            <Button color="info">Search</Button>
                        </a>
                    </Container>
                </Hero.Body>
            </Hero> */}
            <div style={{ padding: '2em' }}>
                <Title size={1}>Welcome to RoastMyCode.com!</Title>
                <a href="/Search">
                    <Button color="info">Search</Button>
                </a>
            </div>
            <div style={{ padding: '2em' }}>
                <Title size={1}>Recent Comments</Title>
                <FirebaseQueryInner>
                    {({ comments }) => (
                        <ul>
                            {comments.map((comment) => (
                                <li>
                                    <RecentCommentCard key={comment._id} comment={comment} />
                                </li>
                            ))}
                        </ul>
                    )}
                </FirebaseQueryInner>
            </div>
        </div>
    );
};

const flexStyle = {
    flexGrow: '1',
    flexShrink: '1',
    flexBasis: 'auto',
};

export const RecentCommentCard = ({ comment }) => {
    return (
        <Card>
            <Card.Content>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <CardHeader comment={comment} styles={flexStyle} />
                    <div style={{ ...flexStyle, paddingLeft: '5px' }}>{comment.text}</div>
                    <RepositoryLink details={comment.queryVariables} />
                </div>
            </Card.Content>
        </Card>
    );
};

export const RepositoryLink = ({ details }) => {
    const linkStyle = {
        ...flexStyle,
        paddingLeft: '5px',
        fontSize: '0.75rem',
    };
    const link = `/repo/${details.owner}/${details.name}?file=${details.path}`;

    return (
        <a style={linkStyle} href={link}>
            <span>{`${details.owner}/${details.name}`}</span>
            <br />
            <span>{details.path}</span>
        </a>
    );
};
