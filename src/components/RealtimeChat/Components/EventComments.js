import React, { useEffect } from 'react';
import { graphql } from 'react-apollo';
import moment from 'moment';
import QueryGetEvent from '../GraphQL/QueryGetEvent';
import SubscriptionEventComments from '../GraphQL/SubscriptionEventComments';
import NewComment from './NewComment';

export const EventComments = ({ eventId, comments, subscribeToComments }) => {
    useEffect(() => {
        const subscription = subscribeToComments();
        return () => subscription();
    });
    
    return (
        <div className='ui items'>
            <div className='item'>
                <div className='ui comments'>
                    <h4 className='ui dividing header'>Inline Chat Test with Jason Ludden</h4>
                    {[].concat(comments.items).sort((a, b) => a.createdAt.localeCompare(b.createdAt)).map(c => c && c.commentId && <Comment key={c.commentId} comment={c} /> )}
                    <NewComment eventId={eventId} />
                </div>
            </div>
        </div>
    );
}

export const Comment = ({ comment }) => {
    if (!comment || !comment.commentId) return null;
    return (
        <div className='comment' key={comment.commentId}>
            <div className='avatar'><i className='icon user circular'></i></div>
            <div className='content'>
                <div className='text'>
                    {comment.content}
                </div>
                <div className='metadata'>{moment(comment.createdAt).format('LL, LT')}</div>
            </div>
        </div>
    );
}

const EventCommentsWithData = graphql(
    QueryGetEvent,
    {
        options: ({ eventId: id }) => ({
            fetchPolicy: 'cache-first',
            variables: { id }
        }),
        props: props => ({
            comments: props.data.getEvent ? props.data.getEvent.comments : { items: [] },
            subscribeToComments: () => props.data.subscribeToMore({
                document: SubsriptionEventComments,
                variables: {
                    eventId: props.ownProps.eventId,
                },
                updateQuery: (prev, { subscriptionData: { data: { subscribeToEventComments } } }) => {
                    const res = {
                        ...prev,
                        getEvent: {
                            ...prev.getEvent,
                            comments: {
                                __typename: 'CommentConnections',
                                ...prev.getEvent.comments,
                                items: [
                                    ...prev.getEvent.comments.items.filter(c => c.commentId !== subscribeToEventComments.commentId),
                                    subscribeToEventComments,
                                ]
                            }
                        }
                    };

                    return res;
                }
            })
        }),
    },
)(EventComments);

export default EventCommentsWithData;