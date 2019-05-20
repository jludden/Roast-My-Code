import * as enzyme from "enzyme";
// import API from "../API";
// import API from "../__mocks__/API";
import Adapter from "enzyme-adapter-react-16";
import RoastComment from "../../common/RoastComment";
import mockAPI from "../API";
import Axios from "axios";

enzyme.configure({ adapter: new Adapter() });

it("API get comments returns array of comments", async () => {
  // can override mock implementation for this specific test
  const spy = jest.spyOn(mockAPI, "getComments");
  spy.mockImplementationOnce(() => {
    return Promise.resolve([
      new RoastComment({id: 12345, data: {lineNumber: 15, selectedText: "hello world", author: "jason", comment: "capitalize words"}})
    ]) as any;
  });

  const results = await mockAPI.getComments();
  // use toEqual for objects and arrays, use toBe for scalar data types only
  expect(results.length).toBe(1);
  expect(results[0]).toEqual(expect.any(RoastComment));
  expect(results[0].data.lineNumber).toBe(15);

  // expect(mockAPI.getComments).toHaveBeenCalledTimes(1);
});

//theoretically possible to mock at a axios level to test things like request params & url
// it("calls axios and returns array of comments", async () => {
//   const spy = jest.spyOn(mockAPI, "getComments");
//   spy.mockRestore();

//   const mockAxios = jest.spyOn(Axios, "get");
//   mockAxios.mockImplementationOnce(() => {
//     return Promise.resolve({
//       data: [new RoastComment(15, "hello world", "capitalize words", 1)]
//     }) as any;
//   });

//   const result = await mockAPI.getComments(); // todo this doesnt work, but below does...
//   // const axiosStatic = Axios.create({ baseURL: "http://localhost:3001/" });
//   // const { data } = await axiosStatic.get("/comments");
//   // const result = data as RoastComment[];

//   expect(result.length).toBe(1);
//   expect(result[0]).toEqual(expect.any(RoastComment));
//   expect(result[0].lineNumber).toBe(11);
//   expect(mockAPI.getComments).toHaveBeenCalledTimes(1);

//   // expect(Axios.get).toHaveBeenCalledTimes(1);

//   // expect(Axios.get).toHaveBeenCalledWith("/comments");

//   // todo can expand this in the future to include request params
//   // expect(Axios.get).toHaveBeenCalledWith(
//   //   "/comments",
//   //   {
//   //     params: {
//   //       client_id: process.env.REACT_APP_GITHUB_TOKEN,
//   //       query: "abcd_efg"
//   //     }
//   //   }
//   // );
// });
