import { SubmitCommentResponse } from "../CommentableCodePage/CommentableCode";
import RoastComment from "../RoastComment";
import DocumentBody from "./DocumentBody";
import DocumentHeader from "./DocumentHeader";
import * as React from "react";
import * as ReactApollo from "react-apollo";
import * as ReactApolloHooks from "react-apollo-hooks";
import "../../App.css";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import { useQuery } from 'react-apollo-hooks';
import { Blob, Repository } from '../../generated/graphql';
import { Container, Message, Progress } from "rbx";

export interface IDocumentProps {
    queryVariables: IGithubDocQueryVariables,
    documentName: string,
    commentsCount: number,
    name: string; // github data - refactor to new interface
    content: string;
    comments: RoastComment[]; // todo why props and state
    onSubmitComment: (comment: RoastComment) => Promise<SubmitCommentResponse>; // handler for submitting a new comment
    onEditComment: (comment: RoastComment, isDelete?: boolean) => Promise<SubmitCommentResponse>
}

const GITHUB_DOCUMENT_QUERY = gql`
  query Document($owner: String!, $name: String!, $path: String!) {
    repository(owner: $owner, name: $name) {
      object(expression: $path) {
        ... on Blob {
          text
        }
      }
    }
  } 
`;

interface IGithubDocResponse {
  repository: {
      object: {
          text: string;
      }
  }
}

/*{
  "owner": "jludden",
  "name": "ReefLifeSurvey---Species-Explorer",
  "path": "master:app/src/main/java/me/jludden/reeflifesurvey/fishcards/CardViewFragment.java"
}*/
interface IGithubDocQueryVariables {
    owner: string, 
    name: string,  
    path: string, 
}

const Document = (props: IDocumentProps) => {
    const { data, error, loading } = useQuery<IGithubDocResponse, IGithubDocQueryVariables>(GITHUB_DOCUMENT_QUERY, {
        variables: props.queryVariables,
        suspend: false,
    });
  
    if (loading) {
      return <Progress color="info" />;
    }
  
    if (error || !data || !data.repository || !data.repository.object || !data.repository.object.text) {
      return <ErrorMessage />;
    }  
    return (
      <>
        <DocumentHeader 
            documentName={props.documentName} 
            commentsCount={props.commentsCount}/>
        <DocumentBody 
            name={props.name}
            content={data.repository.object.text}
            comments={props.comments}
            onSubmitComment={props.onSubmitComment}
            onEditComment={props.onEditComment}/>  
      </>
    );
};
 
function ErrorMessage() {
    return (
      <Container>
        <Message color="danger">
            <Message.Header>
              Unexpected Error
            </Message.Header>
            <Message.Body>
              Failed to load document
            </Message.Body>
        </Message>
      </Container>
    );
}

export default Document;
