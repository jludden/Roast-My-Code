import * as React from 'react';
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
            <span>Completed Todos</span>
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
    const { data, error, loading, refetch } = useQuery<FindAllTodoListsRespObj>(FIND_ALL_TODO_LISTS);

    if (loading) return <Progress color="info" />;
    if (error || !data) return <div>Error</div>; // ErrorMessage
    if (data) {
        console.log(data);
    }

    // data.allLists.data.map(todo => {
    //     if (!todo || !todo.title) todo = { title: 'error todo' };
    // });

    return (
        <div>
            <span>FindAllTodoLists response</span>
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
        </div>
    );
};

// export default GraphQLTests;
