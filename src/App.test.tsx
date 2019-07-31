import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import { MockedProvider } from 'react-apollo/test-utils';
import * as enzyme from "enzyme";
import { shallow, mount, ShallowWrapper } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Progress } from "rbx";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import RepoContents, {REPO_CONTENTS_QUERY} from "./components/RepoContents";
import { IdentityContextProvider } from "react-netlify-identity-widget";



enzyme.configure({ adapter: new Adapter() });


// it('renders without crashing', () => {
//   const div = document.createElement('div');
//   ReactDOM.render(<App />, div);
//   ReactDOM.unmountComponentAtNode(div);
// });


// const shallowWrapper = shallow(<CommentableCode document="" />);
//     const containsSpinner = shallowWrapper.containsMatchingElement(
//       <Progress/>
//     );

//     expect(containsSpinner).toBe(true);

const query2 = gql`
query($path: String!, $repoName: String!, $repoOwner: String!) {
  repository(name: $repoName, owner: $repoOwner) {

    refs(refPrefix:"refs/heads/", first: 100) {
      nodes {
        name
      }
    }

    folder: object(expression: $path) {
    ... on Tree {
      entries {
        oid
        name

        object {
          ... on Blob {
            id 
            oid 
            commitResourcePath
            commitUrl 
            isTruncated
            text
          }
        }          
      }
    }
  }
}
}
`;


it('will render data', async () => {
  const mocks = [
    {
      request: { query2 },
      result: { data: { hello: 'world' } }
    }
  ];
  const wrapper = mount(
    <MockedProvider mocks={mocks}>
      <IdentityContextProvider url={"https://jludden-react.netlify.com/"}>
        <App />
      </IdentityContextProvider>
    </MockedProvider>
  );
  await new Promise(resolve => setTimeout(resolve));
  wrapper.update();

      const containsSpinner = wrapper.containsMatchingElement(
      <Progress/>
    );

    const containsApp = wrapper.containsMatchingElement(
      <App />
    );

    expect(containsSpinner).toBe(false);
});