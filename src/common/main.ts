class Greeter {
    private greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    public greet() {
        return "Hello, " + this.greeting;
    }
}
 
class Calculator {        
    public add(a:number,b:number) {
        return a+b;
    }
     
    public sub(a:number,b:number) {
        return a-b;
    }
}
export {Greeter,Calculator}