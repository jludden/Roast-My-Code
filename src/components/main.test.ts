import { Calculator } from './calculator';
import CommentableCode from './CommentableCodePage/CommentableCode';
import { Greeter } from './main'; 


// Unit Testing
it('greets the world', () => {
 const greeter = new Greeter("World");
 expect(greeter.greet()).toEqual("Hello, World");
});
it('add/substract two numbers', () => {
 const calc = new Calculator();
 expect(calc.add(2, 3)).toEqual(5);
 expect(calc.sub(3, 2)).toEqual(1);
});
xit('runs a simple method', () => {
    const props : any = "ab"; // todo
    const codeComponent = new CommentableCode(props);
    expect(codeComponent.simpleMethod(15,3)).toEqual(45);
})

