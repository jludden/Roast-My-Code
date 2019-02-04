import * as enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import * as React from 'react';
import CommentableCode from './CommentableCode';


// Component Testing
enzyme.configure({ adapter: new Adapter() });
it("renders 'hello world' component when document is null", () => {
    const codeComponent = enzyme.render(<CommentableCode document="hello"/>);
    expect(codeComponent.find(".text-xs-right").text()).toContain("custom class")
   });