import React, { useState, useEffect } from 'react';
import '../App.css';
import { db } from '../services/firebase';
import { FirebaseQueryInner } from '../components/FirebaseChat/SigninModal';
import { SingleCommentUI } from '../components/CommentableDocument/SingleCommentView';
import { CardHeader } from '../components/CommentableDocument/CommentContainer';
import { Hero, Title, Container, Message, Box, Textarea, Button, Card, Content, Icon, Delete, Dropdown } from 'rbx';
import { Search } from './Search';

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
        <div className="feat-comments">
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
            <div className="home-content">
                <Title size={1}>Welcome to RoastMyCode</Title>
                {/* <a href="/Search">
                    <Button color="info">Search</Button>
                </a> */}
                <Search />
            </div>
            <div className="home-content">
                <Title size={1}>Recent Comments</Title>
                <FirebaseQueryInner>
                    {({ comments }) => (
                        <ul>
                            {comments.map((comment) => (
                                <li key={comment._id}>
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

const constrainedFlexStyle = {
    flexGrow: '0',
    flexShrink: '0',
    flexBasis: 'auto',
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
                <div style={{ display: 'flex', flexDirection: 'row', flexFlow: 'row wrap' }}>
                    <CardHeader comment={comment} styles={constrainedFlexStyle} />
                    <div className="recent-card-text-container" style={{ ...flexStyle }}>
                        <span >
                            {comment.text}
                        </span>
                    </div>
                    <RepositoryLink details={comment.queryVariables} />
                </div>
            </Card.Content>
        </Card>
    );
};

export const RepositoryLink = ({ details }) => {
    const linkStyle = {
        ...constrainedFlexStyle,
        padding: '1rem',
        // fontSize: '0.75rem',
    };
    const link = `/repo/${details.owner}/${details.name}?file=${details.path}`;

    const encodedLink = `/repo/${details.owner}/${details.name}?file=${encodeURIComponent(details.path)}`;

    return (
        <div className="recent-card" style={linkStyle}>
            <a className="recent-card-repo-name" href={encodedLink}>
                <span>{details.name}</span>
            </a><br />

            <div className="recent-card-repo-item recent-card-repo-path">
            <label>File: </label>
            <a href={encodedLink}>
                <span>{details.path}</span>
            </a>
            </div>

            <div className="recent-card-repo-item recent-card-repo-owner">
            <label>Owner: </label>
            <span>{details.owner}</span>
            </div>
        </div>
    );
};
