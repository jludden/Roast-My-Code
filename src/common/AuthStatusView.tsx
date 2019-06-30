import * as React from 'react';
import '../App.css';
import CommentableCode from './CommentableCode';
import { Container, Hero, Title, Section, Button } from "rbx";
import "rbx/index.css";
import { useIdentityContext } from "react-netlify-identity-widget";
import "react-netlify-identity-widget/styles.css";
import Avatar from './Avatar';


export interface IAppProps {
}

const IdentityModal = React.lazy(() => import("react-netlify-identity-widget"));


export default function AuthStatusView (props: IAppProps) {
  const identity = useIdentityContext()
  const [dialog, setDialog] = React.useState(false)
  const name =
    (identity && identity.user && identity.user.user_metadata && identity.user.user_metadata.name) || "NoName"
  const isLoggedIn = identity && identity.isLoggedIn
  return (
    <>
      <Avatar />
      <Button onClick={() => setDialog(true)}>
        {isLoggedIn ? `Hello ${name}, Log out here!` : "Log In"}
      </Button>      
      <React.Suspense fallback="loading...">
        <IdentityModal showDialog={dialog} onCloseDialog={() => setDialog(false)} />
      </React.Suspense>
    </>
  )
}

