import * as React from 'react';
import { useIdentityContext } from "react-netlify-identity-widget";
import "react-netlify-identity-widget/styles.css";

export interface IAppProps {
    // children: React.ReactNode 
    children: React.ReactElement
}


export const AuthWrapper = (props: IAppProps) => {
    const identity = useIdentityContext();
    const name =
      (identity && identity.user && identity.user.user_metadata && identity.user.user_metadata.name) || "NoName";
    const isLoggedIn = identity && identity.isLoggedIn;


    return (
        <>
            {React.cloneElement(props.children, { isLoggedIn })}
            {/* <CommentableCode document="passed in through props"/> */}
        </>
    );
}
