
import { Calculator, Greeter } from './main';
 
it('greets the world', () => {
 const greeter = new Greeter("World");
 expect(greeter.greet()).toEqual("Hello, World");
});
it('add/substract two numbers', () => {
 const calc = new Calculator();
 expect(calc.add(2, 3)).toEqual(5);
 expect(calc.sub(3, 2)).toEqual(1);
});