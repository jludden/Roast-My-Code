/* eslint-disable no-console */
import * as React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import * as enzyme from 'enzyme';
import { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Progress } from 'rbx';
import { FaCodeBranch } from 'react-icons/fa';
import { act } from 'react-dom/test-utils';
import { ApolloClient } from 'apollo-client';
import gql from 'graphql-tag';
import RepoSearch, {
    REPO_SEARCH_QUERY,
    PanelWarningLine,
    IGithubQueryVariables,
    IGithubQueryResponse,
} from './RepoSearch';
import { queryVars, resultMock, errorMock, graphQLErrorMock } from './RepoSearch.mocks';
// import { cache } from '../../App';
// export const mockClient: ApolloClient<InMemoryCache> = new ApolloClient({ cache });

// suppress error messages - there are many for apollo
// console.log = jest.fn();
// console.error = jest.fn();
// console.warn = jest.fn();

// https://github.com/testing-library/react-testing-library#suppressing-unnecessary-warnings-on-react-dom-168
// https://reactjs.org/docs/testing-recipes.html
// https://blog.logrocket.com/a-quick-guide-to-testing-react-hooks-fa584c415407/

enzyme.configure({ adapter: new Adapter() });
describe('RepoSearch', () => {
    xit('will render data', async () => {
        const wrapper = mount(
            <MockedProvider mocks={resultMock} addTypename={false}>
                <RepoSearch queryVariables={queryVars} loadRepoHandler={() => {}} />
            </MockedProvider>,
        );

        // let graphql mock finish loading
        //  await act(async () => {
        console.log(wrapper.debug());

        await new Promise(resolve => setTimeout(resolve, 3000));
        wrapper.update();
        //  });

        const containsLoadingBar = wrapper.containsMatchingElement(<Progress />);
        expect(containsLoadingBar).toBe(false);
        const containsRepoContentLine = wrapper.containsMatchingElement(<FaCodeBranch />);
        expect(containsRepoContentLine).toBe(true);
    });

    xit('will render loading state', async () => {
        let wrapper;
        // await act(async () => {
        wrapper = mount(
            <MockedProvider mocks={resultMock} addTypename={false}>
                <RepoSearch queryVariables={queryVars} loadRepoHandler={() => {}} />
            </MockedProvider>,
        );
        //  });

        const containsLoadingBar = wrapper.containsMatchingElement(<Progress />);
        expect(containsLoadingBar).toBe(true);
    });

    xit('should show error UI after network error', async () => {
        const wrapper = mount(
            <MockedProvider mocks={errorMock} addTypename={false}>
                <RepoSearch queryVariables={queryVars} loadRepoHandler={() => {}} />
            </MockedProvider>,
        );

        //   await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
        // });

        const containsErrorUI = wrapper.containsMatchingElement(<PanelWarningLine text="Error :(" />);
        expect(containsErrorUI).toBe(true);
    });

    xit('should show error UI after GraphQL error', async () => {
        const wrapper = mount(
            <MockedProvider mocks={graphQLErrorMock} addTypename={false}>
                <RepoSearch queryVariables={queryVars} loadRepoHandler={() => {}} />
            </MockedProvider>,
        );

        // await act(async () => {
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
        // });
        console.log(wrapper.debug());

        const containsErrorUI = wrapper.containsMatchingElement(<PanelWarningLine text="Error :(" color="danger" />);
        expect(containsErrorUI).toBe(true);
    });
});
