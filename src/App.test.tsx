import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MockedProvider } from '@apollo/react-testing';
import * as enzyme from 'enzyme';
import { shallow, mount, ShallowWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Progress } from 'rbx';
import { useQuery } from '@apollo/react-hooks';
import { IdentityContextProvider } from 'react-netlify-identity-widget';
import RepoContents, { REPO_CONTENTS_QUERY } from './components/RepoContents';
import App from './App';

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

xit('will render data', async () => {
    const mocks = [
        {
            request: { query: {} },
            result: { data: { hello: 'world' } },
        },
    ];
    const wrapper = mount(
        <MockedProvider mocks={mocks}>
            <IdentityContextProvider url="https://jludden-react.netlify.com/">
                <App />
            </IdentityContextProvider>
        </MockedProvider>,
    );
    await new Promise(resolve => setTimeout(resolve));
    wrapper.update();

    const containsSpinner = wrapper.containsMatchingElement(<Progress />);

    const containsApp = wrapper.containsMatchingElement(<App />);

    expect(containsSpinner).toBe(false);
});
