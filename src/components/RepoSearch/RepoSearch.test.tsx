import * as React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import * as enzyme from "enzyme";
import { shallow, mount, ShallowWrapper } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Progress } from "rbx";
import RepoSearch, { REPO_SEARCH_QUERY, PanelWarningLine, IGithubQueryVariables, IGithubQueryResponse } from "./RepoSearch";
import { FaCodeBranch } from "react-icons/fa";
import { queryVars, resultMock, errorMock, graphQLErrorMock } from "./RepoSearch.mocks"
import { cache } from "../../App";


enzyme.configure({ adapter: new Adapter() });
describe("RepoSearch", () => {
    it("will render data", async () => {
      const wrapper = mount(
        <MockedProvider mocks={resultMock} addTypename={false}>
          <RepoSearch queryVariables={queryVars} loadRepoHandler={() => {}} />
        </MockedProvider>
      );

      // let graphql mock finish loading
      await new Promise(resolve => setTimeout(resolve));
      wrapper.update();

      const containsLoadingBar = wrapper.containsMatchingElement(<Progress />);
      expect(containsLoadingBar).toBe(false);
      const containsRepoContentLine = wrapper.containsMatchingElement(<FaCodeBranch />);
      expect(containsRepoContentLine).toBe(true);
    });


    it('will render loading state', () => {
        const wrapper = mount(
            <MockedProvider mocks={resultMock} addTypename={false} cache={cache}>
                <RepoSearch queryVariables={queryVars} loadRepoHandler={() => {}} />
            </MockedProvider>,
        );

        const containsLoadingBar = wrapper.containsMatchingElement(<Progress/>);
        expect(containsLoadingBar).toBe(true);
    });

    it('should show error UI after network error', async () => {
        const wrapper = mount(
            <MockedProvider mocks={errorMock} addTypename={false} cache={cache}>
                <RepoSearch queryVariables={queryVars} loadRepoHandler={() => {}} />
            </MockedProvider>,
        );
      
        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();
        const containsErrorUI = wrapper.containsMatchingElement(<PanelWarningLine text="Error :("/>);
        expect(containsErrorUI).toBe(true);
    });

    it('should show error UI after GraphQL error', async () => {
        const wrapper = mount(
            <MockedProvider mocks={graphQLErrorMock} addTypename={false} cache={cache}>
                <RepoSearch queryVariables={queryVars} loadRepoHandler={() => {}} />
            </MockedProvider>,
        );

        await new Promise(resolve => setTimeout(resolve));
        wrapper.update();          
        const containsErrorUI = wrapper.containsMatchingElement(<PanelWarningLine text="Error :("/>);
        expect(containsErrorUI).toBe(true);
    });
});