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
import { Message } from "rbx";

export interface IDocumentProps {
    documentName: string,
    commentsCount: number,
    name: string; // github data - refactor to new interface
    content: string;
    comments: RoastComment[]; // todo why props and state
    onSubmitComment: (comment: RoastComment) => Promise<SubmitCommentResponse>; // handler for submitting a new comment
    onEditComment: (comment: RoastComment, isDelete?: boolean) => Promise<SubmitCommentResponse>
}


const GET_CONTENT = gql`
  {
    repository(owner: "jludden", name: "ReefLifeSurvey---Species-Explorer") {
      object(expression: "master:app/src/main/java/me/jludden/reeflifesurvey/fishcards/CardViewFragment.java") {
        ... on Blob {
          text
        }
      }
    }
  }
`;

// http://localhost:8888/repo/jludden/ReefLifeSurvey---Species-Explorer?
// file=MainActivity.java
// &path=master%3Aapp%2Fsrc%2Fmain%2Fjava%2Fme%2Fjludden%2Freeflifesurvey%2F
// &q=reeflifesurvey

const Document = (props: IDocumentProps) => {
    const { data, error, loading } = useQuery(GET_CONTENT);
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (error || !data || !data.repository || !data.repository.object || !data.repository.object.text) {
      return <div>ERROR</div>;
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




 

 
// function ErrorMessage(props: IDocumentProps) {
//     return (
//         <Message color="danger">
//             <Message.Header>
//             <p>Unexpected Error</p>
//             </Message.Header>
//             <Message.Body>
//                 Failed to load document...
//             </Message.Body>
//         </Message>
//     );
// }

export default Document;
