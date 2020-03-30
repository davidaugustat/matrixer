import UserIoHandler from "./mathEngine/stringInterpretation/UserIoHandler";
import Field from "./mathEngine/math/Field";

console.log("Hi, what's up?");

const exp1 = "5*3+(5*4)+((5*4)+2*3*(4+6+8))+7";
const exp2 = "(4+3)*10";
const exp3 = "(a+1+a)*a+1*a";
const exp4 = "1+b+bs*(b*bs*bs)";
const exp5 = "bs*b*(1+bs*(b+bs))";
const exp6 = "(j+j*j)*(j-1+(1+1+j))";

 const exp8 = "4(4(4(4(4(4(4))))))*rowreduce({1,1;1,1})";
// const exp8 = "{1,2;2,4}*[3,4]";
const exp9 = "3(3+6)*{1,2,3;4,5,6}*[9,8,7]";
//console.log(new UserIoHandler().processCalculation(Field.R, exp9));

const time = performance.now();
const sol = new UserIoHandler().processCalculation(Field.R, exp9);
const time2 = performance.now();

document.write("Input: " + sol.latexUserInput + "<br>");
document.write("Result: " + sol.userInputResult + "<br><br>");
document.write("Time: " + (time2 - time) + " ms<br>");
