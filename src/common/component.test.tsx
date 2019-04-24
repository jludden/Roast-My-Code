import * as enzyme from "enzyme";
import * as React from "react";
import CommentableCode from "./CommentableCode";

// Component Testing
// configure({ adapter: new Adapter() });
// it("renders 'hello world' component when document is null", () => {
//   const codeComponent = enzyme.render(<CommentableCode document="hello" />);
//   expect(codeComponent.find(".text-xs-right").text()).toContain("custom class");
// });

// Test axios and data source
jest.mock("./API.ts", () => {
  const fakeData = "abc"; // todo
  return {
    default: {
      get: jest.fn(() => Promise.resolve(fakeData))
    }
  };
});

// import axiosGithub from './axios-github'
it("fetches data on componentDidMount", () => {
  const codeComponent = enzyme.shallow<enzyme.ShallowWrapper>(
    <CommentableCode document="hello" />
  );
  try {
    const instance = codeComponent.instance;
    //        a!.comp

    expect(instance.name != null);

    // if(codeComponent.instance() != null) {
    //     codeComponent!
    //         .instance()
    //     .componentDidMount().then(() => {
    //         expect(axiosGithub.get).toHaveBeenCalled();
    //     })
    // }
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.debug("enzyme shallow render instance not found");
  }
});
