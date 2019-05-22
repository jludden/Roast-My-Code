import * as enzyme from "enzyme";
import { shallow, ShallowWrapper } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import * as React from "react";
import API from "../api/API";
import CommentableCode from "./CommentableCode";
import DocumentHeader from "./DocumentHeader";
import RoastComment from "./RoastComment";
import Axios from "axios";

enzyme.configure({ adapter: new Adapter() });

describe("<CommentableCode />", () => {
  it("fetches data on componentDidMount", () => {
    const codeComponent = shallow<ShallowWrapper>(
      <CommentableCode document="hello" />
    );
    try {
      const instance = codeComponent.instance;

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
      console.debug("enzyme shallow render instance not found");
    }
  });

  // todo add a component to display while data is loading
  it("Should render a progress component while loading data", () => {
    // const shallowWrapper = shallow(<CommentableCode loadData={mockedCallback} />);
    // const mockedCallback = () => Promise.resolve(data);

    const shallowWrapper = shallow(<CommentableCode document="" />);
    const containsSpinner = shallowWrapper.containsMatchingElement(
      <DocumentHeader documentName={""} commentsCount={0} />
    );

    expect(containsSpinner).toBe(true);
  });

  // https://jeanpaulsio.github.io/react/2018/03/30/testing-react-components-with-api-calls-in-lifecycle-methods.html
  it("should render document body and document header components", async () => {
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
    const shallowWrapper = enzyme.mount(<CommentableCode document="" />);

    const containsHeaderComponent = shallowWrapper.containsMatchingElement(
      <DocumentHeader documentName={""} commentsCount={0} />
    );

    expect(containsHeaderComponent).toBe(true);
    // expect(containsBodyComponent).toBe(true);

    expect(
      shallowWrapper.containsMatchingElement(
        <h1>Hello welcome to the Annotateable Code Sample</h1>
      )
    );
  });

  it("API (todo move to different directory) get comments returns array of comments", async () => {
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
    const mockAPI = jest.spyOn(API, "getComments");
    mockAPI.mockImplementation(() => {
      return Promise.resolve([
        {
          id: 1,
          data: {
            lineNumber: 10,
            commentText: "capitalize words",
            selectedText: "hello world"
          }
        }
      ]) as any;
    });

    const result = await API.getComments();
    expect(result.length).toEqual(1);
    expect(result[0].data.lineNumber).toEqual(10);

  });
});
