import * as React from 'react';
import '../App.css';
import { Container, Hero, Title, Section, Button } from "rbx";
import "rbx/index.css";
import { useIdentityContext } from "react-netlify-identity-widget";
import "react-netlify-identity-widget/styles.css";
import Avatar from './Avatar';


export interface IAppProps {
  showImmediately?: boolean
}

const IdentityModal = React.lazy(() => import("react-netlify-identity-widget"));

export default function AuthStatusView (props: IAppProps = { showImmediately: false }) {
  const [dialog, setDialog] = React.useState(props.showImmediately || false);
  React.useEffect(() => {
    setDialog(props.showImmediately || false);
  }, [props.showImmediately]);

  const identity = useIdentityContext();
  const name =
    (identity && identity.user && identity.user.user_metadata && identity.user.user_metadata.name) || "NoName";
  const isLoggedIn = identity && identity.isLoggedIn;

  return (
    <>
      {isLoggedIn && 
        <Avatar isLoggedIn={isLoggedIn} name={name} />}
      <Button color="primary" onClick={() => setDialog(true)}>
        {isLoggedIn ? `Hello ${name}, Log out here!` : <strong>Log in</strong>}
      </Button>      
      <React.Suspense fallback="loading...">
        <IdentityModal showDialog={dialog} onCloseDialog={() => setDialog(false)} />
      </React.Suspense>
    </>
  )
}

