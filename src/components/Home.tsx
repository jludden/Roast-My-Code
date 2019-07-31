import * as React from "react";
import "../App.css";

import { useQueryParam, NumberParam, StringParam } from 'use-query-params';


import API, { IGithubData } from "../api/API";
import DocumentBody from "./CommentableDocument/DocumentBody";
import DocumentHeader from "./CommentableDocument/DocumentHeader";
import RoastComment from "./RoastComment";
import ApolloClient from "apollo-boost";
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'
// import schema from '../api/github.schema.json';
import IntrospectionResultData, { Blob, Repository, RepositoryConnection } from '../generated/graphql';
import {RepositoryOwner, StargazerConnection, Language} from '../generated/graphql'; // todo shouldnt really need
import RepoSearchContainer from "./RepoSearch/RepoSearchContainer";
import RepoContents, {UseUrlQuery} from "./RepoContents";
import AuthStatusView from "./AuthStatusView";
import { useIdentityContext } from "react-netlify-identity-widget";
import update from "immutability-helper";
import { BrowserRouter as Router, Switch, Route, Redirect, Link, RouteComponentProps  } from "react-router-dom";


export interface IHomeProps {
    bar: string,
    foo: number,
    children: React.ReactElement

}


// todo
// RepoSearchContainer -> set URL w/ useQueryParam
// instead of returning repo, can return repo.resourcePath
// redirect URL: repo/resourcePath

export function Home (props: IHomeProps) {

    const [num, setNum] = useQueryParam('x', NumberParam);
    const [foo, setFoo] = useQueryParam('foo', StringParam);
    const [shouldRedirect, setShouldRedirect] = React.useState("");

    return (
        <>
            {
                (shouldRedirect.length > 0) && <Redirect to={`/repo${shouldRedirect}`} push />
            }

            <div>
                <h1>num is {num}</h1>
                <button onClick={() => setNum(Math.random())}>Change</button>
                <h1>foo is {foo}</h1>
                <button onClick={() => setFoo(`str${Math.random()}`)}>Change</button>
                <h1> link to repo </h1>
                <Link to="/repo/">Commentable Code</Link>
            </div>

            {/* <AuthStatusView showImmediately={false}/> */}

            {/* {todo use a RBX-Page Loader for this part...} */}
            {/* {this.state.loading && <Progress color="info"/>} */}
            
            {/* Repo Search */}
            <RepoSearchContainer
              loadRepoHandler={(repo: Repository) => setShouldRedirect(repo.resourcePath)}
              loadRecommendedRepo={() => setShouldRedirect("/jludden/ReefLifeSurvey---Species-Explorer")} />

            {/* {React.cloneElement(props.children, { isLoggedIn })} */}
            {props.children && React.cloneElement(props.children)}
        </>      
    );
}


