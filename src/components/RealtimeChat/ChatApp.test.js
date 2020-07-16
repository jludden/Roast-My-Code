import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ChatApp } from './ChatApp';
import { EventComments, Comment } from './Components/EventComments';
import { NewComment } from './Components/NewComment';
import '@testing-library/jest-dom/extend-expect';

const sampleComment =  { 
  "eventId": "abcdefg-6d58-4479-b1ec-bafe0ca661af",
  "commentId": "abcdef-51da-4175-bc32-c1bcf853dbbd",
  "content": "hello insight",
  "createdAt": "2020-05-24T20:25:26Z"
};

describe('EventComments', () => {
  const event = {
    id: '1234',
    comments: {
      items: [
        sampleComment
      ]
    }
  }
  
  it('renders header and comments', () => {
    const { getByText } = render(<EventComments eventId={event.id} comments={event.comments} subscribeToComments={() => () => {}} />);
    expect(getByText(/Inline Chat Test with Jason Ludden/)).toBeInTheDocument();
    expect(getByText(/hello insight/)).toBeInTheDocument();
  });
  
  it('renders add new comment', () => {
    const { getByText } = render(<EventComments eventId={event.id} comments={event.comments} subscribeToComments={() => () => {}} />);
    expect(getByText(/Add Comment/)).toBeInTheDocument();
  });
  
  it('cleans up subscription on unmount', () => {
    const unsubscribe = jest.fn();
    const subscribe = jest.fn(() => unsubscribe);
    const { getByText, unmount } = render(<EventComments eventId={event.id} comments={event.comments} subscribeToComments={subscribe} />);
    
    expect(unsubscribe.mock.calls.length).toBe(0);
    expect(subscribe.mock.calls.length).toBe(1);

    unmount();
    expect(unsubscribe.mock.calls.length).toBe(1);
    expect(subscribe.mock.calls.length).toBe(1);
  });
});

test('Render Single Comment', () => {
  const { getByText } = render(<Comment comment={sampleComment} />);
  expect(getByText(/hello insight/)).toBeInTheDocument();
  expect(getByText(/May 24, 2020/)).toBeInTheDocument();
})

describe('<NewComment>', () => {
  it('can add new comment', () => {
    const createComment = jest.fn();
    
    const { getByText, getByTestId } = render(<NewComment eventId={'1234'} createComment={createComment} />);
    expect(getByText(/Add Comment/)).toBeInTheDocument();
    expect(createComment.mock.calls.length).toBe(0);

    fireEvent.change(getByTestId('comment-input'), { target: { value: 'new comment text' } })
    fireEvent.click(getByText(/Add Comment/))
  
    expect(createComment.mock.calls.length).toBe(1);
    expect(getByText(/new comment text/)).toBeInTheDocument();
    
  })
})