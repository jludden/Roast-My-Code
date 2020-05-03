// TODO DELETE UNUSEd FILE
import * as React from 'react';
import { Collapse } from 'react-collapse';
import { githubClient } from '../../App';
import { ExecutionResult } from 'graphql';

// import ApolloClient, { gql, ExecutionResult } from 'apollo-boost';
import { ApolloClient } from 'apollo-client';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import {
    Comment,
    SubmitCommentResponse,
    LoadGithubQueryVars,
    LoadGithubQueryResponse,
    LoadTodosQueryResponse,
    Todo,
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

export const LOAD_TODOS_QUERY = gql`
    query getcomments {
        allTodos {
            data {
                title
                completed
                _id
            }
        }
    }
`;

const SUBMIT_TODOS_MUTATION = gql`
    mutation createTodo($title: String!) {
        createTodo(data: { title: $title, completed: false }) {
            title
            completed
            _id
        }
    }
`;

const DELETE_TODOS_MUTATION = gql`
    mutation deleteTodo($id: ID!) {
        deleteTodo(id: $id) {
            _id
        }
    }
`;

export const LoadTodosTestWithDelete = () => {
    const [deleteTodoMut] = useMutation(DELETE_TODOS_MUTATION);
    return (
        <LoadTodosTest
            deleteTodo={(todo: Todo) =>
                deleteTodoMut({
                    variables: { id: todo._id },
                    optimisticResponse: {
                        __typename: 'Mutation',
                        deleteTodo: {
                            __typename: 'Todo',
                            _id: todo._id,
                        },
                    },
                    update: (cache, { data: { deleteTodo } }) => {
                        const data: LoadTodosQueryResponse = cache.readQuery<LoadTodosQueryResponse>({
                            query: LOAD_TODOS_QUERY,
                        }) || {
                            allTodos: { data: [] },
                        };

                        data.allTodos.data = data.allTodos.data.filter(comment => comment._id != deleteTodo._id);

                        cache.writeQuery({
                            query: LOAD_TODOS_QUERY,
                            data: data,
                        });
                    },
                })
            }
        />
    );
};

export const LoadTodosTest = ({ deleteTodo }: { deleteTodo: (todo: Todo) => Promise<ExecutionResult<any>> }) => {
    const [expanded, setExpanded] = React.useState(false);
    const { data, error, loading, refetch } = useQuery<LoadTodosQueryResponse>(LOAD_TODOS_QUERY, {
        //  client: faunaDbClient
    });

    if (loading) return <Progress color="info" />;
    if (error || !data) return <div>Error</div>; // ErrorMessage
    if (data) {
        console.log(data);
    }

    return (
        <div>
            <span onClick={() => setExpanded(!expanded)}>All Todos (toggle):</span>
            <Collapse isOpened={expanded}>
                <ul>
                    {data.allTodos.data.map(todo => {
                        if (!todo || !todo.title) return <p>Error</p>;
                        return (
                            <li key={todo.title}>
                                <b>
                                    title:
                                    {todo.title}
                                </b>
                                <p>
                                    completed:
                                    {todo.completed ? 'true' : 'false'}
                                </p>
                                <Button onClick={() => deleteTodo(todo)}>Delete</Button>
                            </li>
                        );
                    })}
                </ul>
            </Collapse>
        </div>
    );
};

/*
update(cache, { data: { addTodo } }) {
        const { todos } : any = cache.readQuery({ query: LOAD_COMMENTS_QUERY   }) || { todos: [] };
        cache.writeQuery({
          query: LOAD_COMMENTS_QUERY,
          data: { todos: todos.concat([addTodo]) },
        });
      },
*/

// function AddComment() {
//     let input: HTMLInputElement | null;
//     // const [addTodo, { data }] = useMutation(ADD_COMMENT);
//     const [addTodo] = useMutation(
//         // todo set client: faunaDbClient
//         SUBMIT_COMMENT_MUTATION,
//         {
//             //    variables: { "title": input ? input.value : 'oops empty title'},
//             update(cache, { data: { addTodo } }) {
//                 const { todos }: any = cache.readQuery({ query: LOAD_COMMENTS_QUERY }) || { todos: [] };
//                 cache.writeQuery({
//                     query: LOAD_COMMENTS_QUERY,
//                     data: { todos: todos.concat([addTodo]) },
//                 });
//             },
//         },
//     );

//     return (
//         <div>
//             <form
//                 onSubmit={e => {
//                     const val = input ? input.value : '';
//                     console.log(`comment submission attempted. value: ${val}`);
//                     e.preventDefault();
//                     addTodo({ variables: { title: val } });
//                     if (input) input.value = '';
//                 }}
//             >
//                 <input
//                     ref={node => {
//                         input = node;
//                     }}
//                 />
//                 <button type="submit">Add Todo</button>
//             </form>
//         </div>
//     );
// }
// export interface IRepoCommentsResponse {
//   allTodos: {
//     data: [
//       {
//         title: string,
//         completed: boolean
//       }
//     ]
//   }
// }

export function SubmitTodosMutation() {
    const [mutate] = useMutation(SUBMIT_TODOS_MUTATION);
    return (
        <SubmitTodosForm
            submit={(todoContent: string) =>
                mutate({
                    variables: { title: todoContent },
                    optimisticResponse: {
                        __typename: 'Mutation',
                        createTodo: {
                            __typename: 'Todo',
                            title: todoContent,
                            completed: false,
                            _id: '' + Math.round(Math.random() * -1000000),
                        },
                    },
                    update: (cache, { data: { createTodo } }) => {
                        // Read the data from our cache for this query.
                        const data: LoadTodosQueryResponse = cache.readQuery<LoadTodosQueryResponse>({
                            query: LOAD_TODOS_QUERY,
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
                        const submitTodo = createTodo;
                        if (submitTodo && submitTodo.title) {
                            data.allTodos.data.push(submitTodo);
                        } else if (submitTodo && submitTodo.createTodo) {
                            data.allTodos.data.push(submitTodo.createTodo);
                        }

                        cache.writeQuery({
                            query: LOAD_TODOS_QUERY,
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
}

export function SubmitTodosForm({ submit }: { submit: (todoContent: string) => Promise<ExecutionResult<any>> }) {
    let input: HTMLInputElement | null = null;

    return (
        <div>
            <span>SUBMIT TODOS FORM</span>
            <input
                ref={node => {
                    input = node;
                }}
            />
            <Button onClick={() => submit(input ? input.value : 'ADD TODO MUTATION TEST')}>ADD TODO</Button>
        </div>
    );
}

/*
mutate({
          variables: { repoFullName, commentContent },
          update: (store, { data: { submitComment } }) => {
            // Read the data from our cache for this query.
            const data = store.readQuery({ query: CommentAppQuery });
            // Add our comment from the mutation to the end.
            data.comments.push(submitComment);
            // Write our data back to the cache.
            store.writeQuery({ query: CommentAppQuery, data });
          }
        })

*/

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
        data: Todo[];
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

const ADD_TODO_TO_LIST_MU = gql`
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
    const [mutate] = useMutation(ADD_TODO_TO_LIST_MU);
    const listId = '245486712804868612';
    return (
        <AddTodoToList
            lists={lists}
            submit={(todoContent: string) =>
                mutate({
                    variables: { title: todoContent, listId: listId },
                    optimisticResponse: {
                        __typename: 'Mutation',
                        createTodo: {
                            __typename: 'Todo',
                            title: todoContent,
                            completed: false,
                            _id: '' + Math.round(Math.random() * -1000000),
                            list: {
                                _id: listId,
                            },
                        },
                    },
                    update: (cache, { data: { createTodo } }) => {
                        // Read the data from our cache for this query.
                        const data: LoadTodosQueryResponse = cache.readQuery<LoadTodosQueryResponse>({
                            query: LOAD_TODOS_QUERY,
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
                            query: LOAD_TODOS_QUERY,
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

function AddTodoToList({
    lists,
    submit,
}: {
    lists: ListRespObj[];
    submit: (commentContent: string) => Promise<ExecutionResult<any>>;
}) {
    let input: HTMLInputElement | null = null;

    return (
        <div>
            <span>Add TODOs to List</span>
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
            <Button onClick={() => submit(input ? input.value : 'ADD TOdos MUTATION TEST')}>ADD TODO TO LIST</Button>
        </div>
    );
}
