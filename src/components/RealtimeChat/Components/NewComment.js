import React, { useState } from 'react';
import { graphql } from 'react-apollo';
import { v4 as uuid } from 'uuid';
import MutationCommentOnEvent from '../GraphQL/MutationCommentOnEvent';
import QueryGetEvent from '../GraphQL/QueryGetEvent';
import moment from 'moment';


export const NewComment = ({ eventId, createComment }) => {
    
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    
    const handleSubmit = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        setLoading(true);

        await createComment({
            content,
            eventId,
            createdAt: moment.utc().format(),
        });

        setContent('');
        setLoading(false);
    }
    
    const handleChange = ({ target: { value: content } }) => {
        setContent(content);
    }
    
    return (
        <form className="ui reply form">
            <div className="field">
                <textarea data-testid={'comment-input'} value={content} onChange={handleChange} disabled={loading}></textarea>
            </div>
            <button className={`ui blue labeled submit icon button ${loading ? 'loading' : ''}`}
                disabled={loading} onClick={handleSubmit}>
                <i className="icon edit"></i>
                Add Comment
            </button>
        </form>
    );
}

const NewCommentWithData = graphql(
    MutationCommentOnEvent,
    {
        options: props => ({
            update: (proxy, { data: { commentOnEvent } }) => {
                const query = QueryGetEvent;
                const variables = { id: commentOnEvent.eventId };
                const data = proxy.readQuery({ query, variables });

                data.getEvent = {
                    ...data.getEvent,
                    comments: {
                        ...data.getEvent.comments,
                        items: [
                            ...data.getEvent.comments.items.filter(c => c.commentId !== commentOnEvent.commentId),
                            commentOnEvent,
                        ]
                    }
                };

                proxy.writeQuery({ query, data });
            },
        }),
        props: props => ({
            createComment: (comment) => {
                return props.mutate({
                    variables: { ...comment },
                    optimisticResponse: { commentOnEvent: { ...comment, __typename: 'Comment', commentId: uuid() } },
                });
            }
        })
    }
)(NewComment);

export default NewCommentWithData;