import * as enzyme from 'enzyme';
import { shallow, ShallowWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as React from 'react';
import Axios from 'axios';
import { Progress } from 'rbx';
import API from '../../api/API';
import CommentableCode, { LOAD_REPO_QUERY } from './CommentableCode';
import DocumentHeader from '../CommentableDocument/DocumentHeader';
import DocumentBody from '../CommentableDocument/DocumentBody';
import RoastComment from '../RoastComment';
import { render, fireEvent, waitForElement } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';

enzyme.configure({ adapter: new Adapter() });

describe('<CommentableCode />', () => {
    const { location } = window;

    // beforeAll(() => {
    //     delete window.location;
    //     // window.location.pathname = '/repo/jludden/ReefLifeSurvey---Species-Explorer';
    //     window.location = { pathname: '/repo/jludden/ReefLifeSurvey---Species-Explorer', ...location };
    // });

    // afterAll(() => {
    //     window.location = location;
    // });

    xit('renders Code and Comments', async () => {
        const dogMock = {
            request: {
                query: LOAD_REPO_QUERY,
                variables: { owner: 'jludden', name: 'ReefLifeSurvey---Species-Explorer' },
            },
            result: {
                data: {
                    repository: {
                        createdAt: '2017-12-29T12:52:31Z',
                        descriptionHTML: '<div>test</div>',
                        forks: { totalCount: 1 },
                        languages: {
                            nodes: [{ name: 'Java' }],
                            name: 'ReefLifeSurvey---Species-Explorer',
                            nameWithOwner: 'jludden/ReefLifeSurvey---Species-Explorer',
                            owner: {
                                login: 'jludden',
                            },
                        },
                    },
                },
            },
        };

        const { getByText, getByRole } = render(
            <MockedProvider mocks={[dogMock]} addTypename={false}>
                <CommentableCode userIsLoggedIn={true} userName={'jason'} />
            </MockedProvider>,
        );

        const movie = await waitForElement(() => getByText('the lion king'));
    });

    xit('fetches data on componentDidMount', () => {
        const codeComponent = shallow<ShallowWrapper>(<CommentableCode />);
        try {
            const { instance } = codeComponent;

            expect(instance.name != null);

            // if (codeComponent.instance() != null) {
            //   codeComponent
            //     .instance()
            //     .componentDidMount()
            //     .then(() => {
            //       expect(API.getComments).toHaveBeenCalled();
            //     });
            // }
        } catch (e) {
            // tslint:disable-next-line:no-console
            console.debug('enzyme shallow render instance not found');
        }
    });

    // todo add a component to display while data is loading
    xit('Should render a progress component while loading data', () => {
        // const shallowWrapper = shallow(<CommentableCode loadData={mockedCallback} />);
        // const mockedCallback = () => Promise.resolve(data);

        const shallowWrapper = shallow(<CommentableCode />);
        const containsSpinner = shallowWrapper.containsMatchingElement(<Progress />);

        expect(containsSpinner).toBe(true);
    });

    // https://jeanpaulsio.github.io/react/2018/03/30/testing-react-components-with-api-calls-in-lifecycle-methods.html
    xit('should render document body and document header components', async () => {
        // const spy = jest.spyOn(API, "getComments"); // todo why wont it use default mock
        // spy.mockImplementationOnce(() => {
        //   return Promise.resolve([
        //     new RoastComment(11, "hello world", "capitalize words", 1)
        //   ]) as any;
        // });

        // const mockAxios = jest.spyOn(Axios, "get"); //toz
        // mockAxios.mockImplementationOnce(() => {
        //   return Promise.resolve({
        //     data: [new RoastComment(15, "hello world", "capitalize words", 1)]
        //   }) as any;
        // });

        // const shallowWrapper = shallow(<CommentableCode document="" />);
        const shallowWrapper = enzyme.mount(<CommentableCode />);

        const containsHeaderComponent = shallowWrapper.find(DocumentHeader);
        const containsBodyComponent = shallowWrapper.find(DocumentBody);

        // const containsHeaderComponent = shallowWrapper.containsMatchingElement(
        //   <DocumentHeader/>
        // );

        expect(containsHeaderComponent.length).toBe(1);
        // expect(containsHeaderComponent).toBe(true);
        expect(containsBodyComponent.length).toBe(1);

        expect(shallowWrapper.containsMatchingElement(<h1>Hello welcome to the Annotateable Code Sample</h1>));
    });

    xit('API (todo move to different directory) get comments returns array of comments', async () => {
        // const mockAxiosGet = jest.spyOn(axios, "get");

        // todo move to __mock__
        // mockAxiosGet.mockImplementation(() => {
        //   return Promise.resolve({
        //     data: [
        //       {
        //         id: 1,
        //         lineNumber: 10,
        //         selectedText: "hello world",
        //         commentText: "capitalize words"
        //       }
        //     ]
        //   }) as any;
        // });

        // consider having mockimpl in __mock__ and
        // mockImplOnce individual in each test as necessary
        const mockAPI = jest.spyOn(API, 'getComments');
        mockAPI.mockImplementation(() => {
            return Promise.resolve([
                {
                    id: 1,
                    data: {
                        lineNumber: 10,
                        commentText: 'capitalize words',
                        selectedText: 'hello world',
                    },
                },
            ]) as any;
        });

        const result = await API.getComments('');
        expect(result.length).toEqual(1);
        expect(result[0].data.lineNumber).toEqual(10);
    });
});
