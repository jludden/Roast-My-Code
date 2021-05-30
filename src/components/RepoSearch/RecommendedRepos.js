import React, { useState, useEffect } from 'react';
import {
    Progress,
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
import '../../App.css';
import {
    FaBeer,
    FaBook,
    FaSearch,
    FaCodeBranch,
    FaGithub,
    FaExclamationCircle,
    FaStar,
    FaExternalLinkAlt,
} from 'react-icons/fa';
import { db, auth } from '../../services/firebase';

export const RecommendedRepositories = () => {
    useEffect(() => {
        // const repoPath64 = btoa(`${vars.repoOwner}/${vars.repoName}`);
        // const repositoryCommentIndex = db.ref(`repository-files/${repoPath64}`);
        const repositoryCommentIndex = db.ref(`repository-files/`);

        // const handleChildUpdate = ({snap, text}: {snap: DataSnapshot, text?: string | null | undefined}) => {
        // const handleChildUpdate = (snap) => {
        //     const snapval = snap.val();
        //     const snapParent = snap.ref.parent;
        //     // const parentkey = snap.parent().key()

        //     console.log(snap.key + ' has this many comments' + snapval.num_comments);
        //     // todo add last updated too?
        //     setRepoDetails((previousState) => {
        //         const newState = previousState;
        //         const decodedRepoPath = atob(snap.key);
        //         const repoPathParts = decodedRepoPath.split(':');
        //         const fullFilePath = repoPathParts[1];
        //         const filePathParts = fullFilePath.split('/');
        //         const fileName = filePathParts[filePathParts.length - 1];

        //         const branchParts = decodedRepoPath.split(':')[0].split('/');
        //         const filePathStart = branchParts[branchParts.length - 1];

        //         newState[snap.key] = {
        //             ...snapval,
        //             _id: snap.key,
        //             oid: snap.key,
        //             decodedRepoPath,
        //             num_comments: snapval.num_comments,
        //             displayName: fullFilePath,
        //             name: fileName,
        //             filePath: decodedRepoPath.slice(
        //                 decodedRepoPath.indexOf(`${filePathStart}:`),
        //                 decodedRepoPath.lastIndexOf(fileName),
        //             ),
        //             object: {
        //                 oid: 'test',
        //             },
        //             // updatedAt: new Date(snapval.timestamp),
        //             // decodedRepoPath: btoa(snapval.key),
        //         } ;

        //         return newState;
        //     });
        // };

        // try {
        //     repositoryCommentIndex
        //         .orderByChild('num_comments')
        //         .limitToLast(5)
        //         //.on('value') -- returns one snap with subnodes
        //         .on('child_added', handleChildUpdate);

        //     repositoryCommentIndex.on('child_changed', handleChildUpdate);
        // } catch (error) {
        //     // setLoadCommentsError(error.message);
        //     console.log('Error loading repository details: ' + error.message);
        // }
        // return () => repositoryCommentIndex.off();
    }, []);


    const edges = [{
        node: {
            nameWithOwner: "bob",
            id: 123,
            primaryLanguage: {
                name: "tom",
                url: "123",
                stargazers: {
                    totalCount: 6
                }
            }
        }
    }];

    return (
        <>
        {edges && edges.map(repo => (
            <Panel.Block
                key={repo.node.id}
                onClick={() => { console.log("clicky")}}
                className="panelHover"
            >
                <Panel.Icon>
                    <FaCodeBranch />
                </Panel.Icon>
                <p>{repo.node.nameWithOwner} </p>
                {/* : last updated at {repo.node.updatedAt}</p> */}
                {repo.node.primaryLanguage && (
                    <Tag.Group style={{ paddingLeft: '1rem' }}>
                        <Tag rounded> {repo.node.primaryLanguage.name} </Tag>
                        <Tag rounded>
                            <Panel.Icon>
                                <FaStar />
                            </Panel.Icon>
                            {'hello'}
                        </Tag>
                        <a href={repo.node.url} target="_blank" rel="noopener noreferrer">
                            <FaExternalLinkAlt />
                        </a>
                    </Tag.Group>
                )}
            </Panel.Block>
        ))}
        </>
    );
}

