import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MockedProvider } from '@apollo/react-testing';
import * as enzyme from "enzyme";
import { shallow, mount, ShallowWrapper } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Progress } from "rbx";
import RepoSearch, {REPO_SEARCH_QUERY} from "./RepoSearch";
import { IdentityContextProvider } from "react-netlify-identity-widget";




const mocks = [
    {
        request: {
            query: REPO_SEARCH_QUERY,
            variables: {
                queryString: "reeflifesurvey",
                first: 5
            }
        },
        result: {
            data: {
                search: {
                    repositoryCount: 1,
                    edges: [
                        {
                            node: {
                                id: 1,
                                nameWithOwner: "jludden/ReefLifeSurvey",
                                url: "www.google.com",
                                updatedAt: "1/1/2019",
                                primaryLanguage: "Java",
                                stargazers: 7
                            }
                        }
                    ]
                }
            }
        }
    }
];


enzyme.configure({ adapter: new Adapter() });
describe("RepoSearch", () => {
    it('will render loading state', () => {
        const wrapper = mount(
            <MockedProvider mocks={mocks} addTypename={false}>
                <RepoSearch 
                    queryVariables={{
                        queryString: "reeflifesurvey",
                        first: 5
                    }}
                    loadRepoHandler={() => {}}
                />
            </MockedProvider>,
        );

        const containsLoadingBar = wrapper.containsMatchingElement(
          <Progress/>
        );

        expect(containsLoadingBar).toBe(true);

      });



    // it('will render data', async () => {
 
    // const wrapper = mount(
    //     <MockedProvider mocks={mocks}>
    //     <IdentityContextProvider url={"https://jludden-react.netlify.com/"}>
    //         <App />
    //     </IdentityContextProvider>
    //     </MockedProvider>
    // );
    // await new Promise(resolve => setTimeout(resolve));
    // wrapper.update();

    //     const containsSpinner = wrapper.containsMatchingElement(
    //     <Progress/>
    //     );

    //     const containsApp = wrapper.containsMatchingElement(
    //     <App />
    //     );

    //     expect(containsSpinner).toBe(false);
    // });
});