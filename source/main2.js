import {UserIoHandler} from 'mathEngine/imports';

console.log("Hi, what's up?");

const exp1 = "5*3+(5*4)+((5*4)+2*3*(4+6+8))+7";
console.log(new UserIoHandler().processCalculation(Field.R, exp1));