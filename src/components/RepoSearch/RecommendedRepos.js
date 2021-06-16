import React, { useState, useEffect } from 'react';
import { Tag, Panel } from 'rbx';
import '../../App.css';
import { FaCodeBranch, FaComments } from 'react-icons/fa';
import { db } from '../../services/firebase';

export const RecommendedRepositories = ({ loadRepoHandler }) => {
    const [repos, setRepos] = useState({});

    useEffect(() => {
        // const repoPath64 = btoa(`${vars.repoOwner}/${vars.repoName}`);
        // const repositoryCommentIndex = db.ref(`repository-files/${repoPath64}`);
        const repoIndex = db.ref(`repository-files/`);

        const handleChildUpdate = (snap) => {
            const snapval = snap.val();
            const key = atob(snap.key);
            setRepos((previousState) => {
                const newState = { ...previousState };

                newState[key] = snapval;
                return newState;
            });
        };

        try {
            repoIndex.limitToLast(5).on('child_added', handleChildUpdate);

            repoIndex.on('child_changed', handleChildUpdate);
        } catch (error) {
            // setLoadCommentsError(error.message);
            console.log('Error loading repository details: ' + error.message);
        }
        return () => repoIndex.off();
    }, []);

    const edges = [];
    for (const [key, value] of Object.entries(repos)) {
        edges.push({
            node: {
                nameWithOwner: key,
                id: key,
                url: `/${key}`,
                ...value,
                languages: Object.keys(value.languages),
                primaryLanguage: {
                    name: 'js', // todo
                },
            },
        });
    }

    return (
        <>
            {edges &&
                edges.map((repo) => (
                    <Panel.Block
                        key={repo.node.id}
                        onClick={() => loadRepoHandler(repo.node.url)}
                        className="panelHover"
                    >
                        <Panel.Icon>
                            <FaCodeBranch />
                        </Panel.Icon>
                        <p>{repo.node.nameWithOwner} </p>
                        {/* : last updated at {repo.node.updatedAt}</p> */}
                        <Tag.Group style={{ paddingLeft: '1rem' }}>
                            {repo.node.languages &&
                                repo.node.languages.map((lang) => (
                                    <Tag rounded key={lang}>
                                        {' '}
                                        {lang}{' '}
                                    </Tag>
                                ))}
                            <Tag rounded>
                                <Panel.Icon>
                                    <FaComments />
                                </Panel.Icon>
                                {repo.node.num_comments}
                            </Tag>
                        </Tag.Group>
                    </Panel.Block>
                ))}
        </>
    );
};
