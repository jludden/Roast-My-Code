import * as React from 'react';
import { Collapse } from 'react-collapse';
import { githubClient } from '../../App';
import ApolloClient, { gql, ExecutionResult } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import {
    IComment,
    SubmitCommentResponse,
    IGithubRepoVars,
    IGithubRepoResponse,
    IRepoCommentsResponse,
    IRepoCommentsObj,
    LOAD_COMMENTS_QUERY,
} from './CommentableCode';
import {
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
    Progress,
} from 'rbx';

const FIND_COMPL_TODOS = gql`
    query FindAllCompletedTodos {
        todosByCompletedFlag(completed: true) {
            data {
                title
            }
        }
    }
`;

interface TodosByCompletedRespObj {
    todosByCompletedFlag: {
        data: TitleCommentsRespObj[];
    };
}

export interface TitleCommentsRespObj {
    title: string;
}

export const CompletedTodos = () => {
    const [expanded, setExpanded] = React.useState(false);
    const { data, error, loading, refetch } = useQuery<TodosByCompletedRespObj>(FIND_COMPL_TODOS);

    if (loading) return <Progress color="info" />;
    if (error || !data) return <div>Error</div>; // ErrorMessage
    if (data) {
        console.log(data);
    }

    data.todosByCompletedFlag.data.map(todo => {
        if (!todo || !todo.title) todo = { title: 'error todo' };
    });

    return (
        <div>
            <span onClick={() => setExpanded(!expanded)}>Completed Todos: (toggle)</span>
            <Collapse isOpened={expanded}>
                <ul>
                    {data.todosByCompletedFlag.data.map(todo => (
                        <li key={todo.title}>
                            <b>
                                title:
                                {todo.title}
                            </b>
                        </li>
                    ))}
                </ul>
            </Collapse>
        </div>
    );
};

const FIND_ALL_TODO_LISTS = gql`
    query FindAllLists {
        allLists {
            data {
                _id
                title
                todos {
                    data {
                        title
                        completed
                        _id
                    }
                }
            }
        }
    }
`;

interface FindAllTodoListsRespObj {
    allLists: {
        data: ListRespObj[];
    };
}

export interface ListRespObj {
    _id: string;
    title: string;
    todos: {
        data: IRepoCommentsObj[];
    };
}

export const GraphQLTodoList = () => {
    const [expanded, setExpanded] = React.useState(false);
    const { data, error, loading, refetch } = useQuery<FindAllTodoListsRespObj>(FIND_ALL_TODO_LISTS);

    if (loading) return <Progress color="info" />;
    if (error || !data) return <div>Error</div>; // ErrorMessage
    if (data) {
        console.log(data);
    }

    return (
        <div>
            <span onClick={() => setExpanded(!expanded)}>FindAllTodoLists: (toggle)</span>
            <Collapse isOpened={expanded}>
                <ul>
                    {data.allLists.data.map(list => (
                        <li key={list.title}>
                            <b>
                                title:
                                {list.title}
                            </b>
                            {list.todos &&
                                list.todos.data &&
                                list.todos.data.map(todo => (
                                    <p>
                                        <b>title: {todo.title}</b>
                                        <p>completed: {todo.completed ? 'true' : 'false'}</p>
                                    </p>
                                ))}
                        </li>
                    ))}
                </ul>
                <span>
                    <GraphQLListMutation lists={data.allLists.data} />
                </span>
            </Collapse>
        </div>
    );
};

const ADD_COMMENT_TO_LIST_MU = gql`
    mutation createTodo($title: String!, $completed: Boolean = false, $listId: ID!) {
        createTodo(data: { title: $title, completed: $completed, list: { connect: $listId } }) {
            title
            completed
            _id
            list {
                title
            }
        }
    }
`;

export const GraphQLListMutation = ({ lists }: { lists: ListRespObj[] }) => {
    const [mutate] = useMutation(ADD_COMMENT_TO_LIST_MU);
    const listId = '245486712804868612';
    return (
        <AddCommentToList
            lists={lists}
            submit={(commentContent: string) =>
                mutate({
                    variables: { title: commentContent, listId: listId },
                    optimisticResponse: {
                        __typename: 'Mutation',
                        createTodo: {
                            __typename: 'Todo',
                            title: commentContent,
                            completed: false,
                            _id: '' + Math.round(Math.random() * -1000000),
                            list: {
                                _id: listId,
                            },
                        },
                    },
                    update: (cache, { data: { createTodo } }) => {
                        // Read the data from our cache for this query.
                        const data: IRepoCommentsResponse = cache.readQuery<IRepoCommentsResponse>({
                            query: LOAD_COMMENTS_QUERY,
                        }) || {
                            allTodos: { data: [] },
                        };
                        // Write our data back to the cache with the new comment in it
                        // cache.writeQuery({ query: LOAD_COMMENTS_QUERY, data: {
                        //   ...data,
                        //   allTodos: [...data, submitComment]
                        // } as any});
                        // data.allTodos.data
                        //const newData = data.allTodos.data.concat(submitComment);
                        // const myCom = new [];
                        const submitComment = createTodo;
                        if (submitComment && submitComment.title) {
                            data.allTodos.data.push(submitComment);
                        } else if (submitComment && submitComment.createTodo) {
                            data.allTodos.data.push(submitComment.createTodo);
                        }

                        cache.writeQuery({
                            query: LOAD_COMMENTS_QUERY,
                            data: data,
                            // data: {
                            //     allTodos: {
                            //         data: newData,
                            //     },
                            // },
                        });
                    },
                })
            }
        />
    );
};

function AddCommentToList({
    lists,
    submit,
}: {
    lists: ListRespObj[];
    submit: (commentContent: string) => Promise<ExecutionResult<any>>;
}) {
    let input: HTMLInputElement | null = null;

    return (
        <div>
            <span>Add Comment to List</span>
            <select>
                {lists.map(list => (
                    <option value={list.title}>
                        {list.title}_{list._id}
                    </option>
                ))}
            </select>
            <input
                ref={node => {
                    input = node;
                }}
            />
            <Button onClick={() => submit(input ? input.value : 'ADD COMMENT MUTATION TEST')}>ADD TO LIST</Button>
        </div>
    );
}
