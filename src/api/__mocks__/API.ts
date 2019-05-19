import API from "../API";
import RoastComment from "../../common/RoastComment";

// working implementation - do we want to mock it at all times?
const mockAPI = jest.spyOn(API, "getComments");
mockAPI.mockImplementation(() => {
  return Promise.resolve([
    new RoastComment({id: 12345, data: {lineNumber: 10, selectedText: "hello world", author: "jason", comment: "capitalize words"}})
  ]) as any;
});

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
// const mockAPI = jest.spyOn(API, "getComments");
// mockAPI.mockImplementation(() => {
//   return Promise.resolve([
//     {
//       commentText: "capitalize words",
//       id: 1,
//       lineNumber: 10,
//       selectedText: "hello world"
//     }
//   ]) as any;
// });

// const mockAPI = jest.spyOn(API, "getComments");
// mockAPI.mockImplementation(() => {
//   return Promise.resolve([
//     {
//       commentText: "capitalize words",
//       id: 1,
//       lineNumber: 10,
//       selectedText: "hello world"
//     }
//   ]) as any;
// });

// export default API;

// export default {
//   get: jest.fn(() => Promise.resolve({ data: null }))
// };
