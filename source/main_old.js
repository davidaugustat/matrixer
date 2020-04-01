/*
* Yeah I know, this file looks messy. This is just a test environment to test the code in the other files.
* */

var mValues = [
    [1,2,3,4],
    [5,6,7,8],
    [0,1,0,4],
    [0,1,0,4],
    [0,1,0,4],
    [0,1,1,4]
    /*[1,4,1,2],
    [1,4,2,2],*/
]

var xValues = [
    [-25,-27,13],
    [-21,-19,11],
    [-80,-80,42]

];

var yValues = [
    [-1,-1,2,0,0,2],
    [0,-2,-1,0,0,0],
    [0,1,-4,0,0,0],
    [0,0,0,-5,1,0],
    [0,0,0,-4,-1,0],
    [1,1,-2,0,0,-2]
];

var cValues = [
    [1,4,-8,7],
    [2,5,-10,8],
    [3,6,-12,99]
];

var aValues = [
    [1,4,-8,8,7],
    [2,5,-10,10,8],
    [3,6,-12,12,99]
];

// F4 matrix:
var dValues = [
    [Field.F4Zero, Field.F4One, Field.F4AlphaPlusOne],
    [Field.F4AlphaPlusOne, Field.F4One, Field.F4Alpha],
    [Field.F4One, Field.F4AlphaPlusOne, Field.F4Zero]
];

// F9 matrix:
var eValues = [
    [Field.F9Zero, Field.F9Zero, Field.F9One, Field.F9MinusIotaPlusOne, Field.F9Iota, Field.F9MinusIota],
    [Field.F9MinusOne, Field.F9MinusIota, Field.F9MinusOne, Field.F9Iota, Field.F9IotaMinusOne, Field.F9One],
    [Field.F9Iota, Field.F9MinusOne, Field.F9MinusIota, Field.F9IotaMinusOne, Field.F9Iota, Field.F9Zero]
];

// F2 matrix:
var fValues = [
    [1, 1],
    [0, 1],
    [1, 1]
];

// F3 matrix:
var gValues = [
    [1,1,1,1],
    [1,-1,0,0],
    [1,1,-1,0],
    [1,-1,1,-1],
    [1,1,0,-1]
];

var hValues = [
    [1, 2],
    [3, 4],
    [5, 6]
];

var iValues = [
    [7, 8, 9, 10],
    [11, 12, 13, 14]
];

var jValues = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

var aVector = [1,2,3,4];
var bVector = [5,6,7,2];

var cVector = [Field.F4Alpha, Field.F4One, Field.F4AlphaPlusOne];
var dVector = [Field.F4One, Field.F4Alpha, Field.F4One];

//const vecRes = Matrix2.fromRawData(Field.R, cValues).multiplyWith(Vector2.fromRawData(Field.R, aVector)).toString();
//const constRes = Matrix2.fromRawData(Field.R, hValues).multiplyWith(new RealNumber(2)).toString();
//const constRes = Matrix2.fromRawData(Field.R, hValues);
//const vecRes = Vector2.fromRawData(Field.R, aVector).subtract(Vector2.fromRawData(Field.R, bVector)).toString();
//const vecRes = Vector2.fromRawData(Field.R, aVector);
//const matRes = Matrix2.fromRawData(Field.R, xValues).subtract(Matrix2.fromRawData(Field.R, jValues)).toString();

//const res = Matrix2.fromRawData(Field.R, jValues).exponentiate(new RealNumber(2)).toString();
//console.log(res);

// const en1 = new ExpressionNode(null, null, null, new F8Number(Field.F4Alpha));
// const en2 = new ExpressionNode(null, null, null, new F8Number(Field.F4AlphaPlusOne));
// //const en3 = new ExpressionNode2(null, null, null, new F8Number(Field.F4One));
// const en3 = new ExpressionNode(null, null, null, Matrix.fromRawData(Field.F4, dValues));
// const en7 = new ExpressionNode(null, null, null, new RealNumber(1));
// const en4 = new ExpressionNode(en1, en2, Operators.ADD, null);
// const en5 = new ExpressionNode(en3, en4, Operators.MULTIPLY, null);
// const en6 = new ExpressionNode(en5, en7, Operators.EXPONENTIATE, null);
//console.log(en6.calculate().toString());

//console.log(new Interpreter2(Field.R).tokenize("5*(4+6)*rowReduce({5,3,4,7})", Field.R));

 //console.log(new Interpreter2(Field.R).interpret("-(15+700/100-9)+(-(5+8-9^4)+87*(-4*3))-6/2+2").calculate());
 //console.log(new Interpreter2(Field.F4).interpret("a+1-(a+1)*(a*a)*a^2").calculate().toString());
//console.log(new Interpreter2(Field.R).interpret("5*rowreduce({1,2,3;1,2,3;1,2,3})").calculate().toString());
// console.log(new Interpreter2(Field.R).isVector(["[1,34,-54.3234]"]));

// console.log(Matrix2.fromString(Field.F8, "{b,1+b,bs;0,1+bs,b+bs}").multiplyWith(Vector2.fromString(Field.F8, "[bs,1+b,1+bs]")).toString());
// const time = performance.now();
// const res = new Interpreter(Field.F8).interpret("b*b*bs*({b,1+b,bs;0,1+bs,b+bs}*[bs,1+b,1+bs])+[b,bs]").calculate().toString();
// console.log("Time: " + (performance.now()-time) + " ms");
// console.log(res);
//
// Vector.fromRawData(Field.R, bVector).toMatrix().print();
// console.log(new Interpreter2(Field.F8).isVector(["[bs,1+b,1+bs]"]));

//console.log(new Parser().removeEveryThingButBrackets("kljsdsf(q#ä){fdd}[sdfsa[fsdf]"));// {[()()()(())]})
const parser = new Parser();
//console.log(parser.containsOnlyValidNumbersAndCharacters(Field.F4, "3.5*a+1*(a-0+a+1)*a^a+1*rowReduce(a+a+a)*abs(0)"));

// console.log(new Interpreter(Field.F8).completeOmittedMultiplicationOperator("b+bs(1+b+bs(bs))"));
//const time = performance.now();
//const fixed = new Interpreter(Field.F4).interpret("1+a^2+a+1").calculate().toString();
//console.log("Time: " + (performance.now()-time) + " ms");
//const time = performance.now();
//console.log(new Interpreter(Field.R).interpret("+(+5+5)").calculate().value);
// console.log(parser.areFunctionOperatorsFollowedByBracket("(5*rowreduce(4+4+abs(5*{1,1;1,1}))"));
//console.log(parser.areAllMatricesValid(Field.F4, ""));
//console.log(RegExp(getVectorRegex(Field.F4)).test("[[a,a]"))
//console.log(parser.isValidMathExpression(Field.R,"57*5+6{5,3,5;35}*[4,2,63]*4345.3*[4,2,63]*{5,3,5;35}"));
//console.log("Time: " + (performance.now()-time) + " ms");

const converter = new InputToLatexConverter();
const interpreter = new Interpreter(Field.R);
//print('\\[' + converter.convertMatrices("5*{1,2;4,5}+5-{3,5,7;574,4,2}+6") + "\\]");
// const exp = "4*5*{1,2,3;4,5,6}*{a+1, a; 0, a+1}*[1+b+bs, b+bs]";
//const exp = "4*5*{1,2,3;4,5,6}*{9,8;7,6;5,4}*[6,7]";
const exp = "b*(1+b)*{1+b+bs,b+bs,1+b;0,1,b}*{1+bs,bs;0,1;b+bs,b}*[1+b+bs,1]";
//print(('\\[' + converter.toLatex(exp) + " = " + interpreter.interpret(exp).calculate().toLatex() + "\\]"));
//printMathDisplay(converter.toLatex("4*6/4^(2-5/(4+6))*(5+5)*{1,2,3;4,5,6}+5*[6,7,8,9,0]"));
 //console.log(converter.convertMatrices("5*{1,2;4,5}+5-{3,5,7;574,4,2}+6"));
//console.log(converter.convertMatrices("{1,2;4,5}"));
//print("\\[\\]");

//var mm = new MatrixManager();
//var f4 = new Field(Field.F4);
// testMatrix(mValues);
// testMatrix(xValues);
// testMatrix(yValues);
// testMatrix(cValues);
//testMatrix(aValues);
//testMatrix(dValues, Field.F4);
// console.log("-".replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\-]', 'g'), '\\$&'));
//console.log(RegExp(getMatrixRegex(Field.F9)).test("{0,1,-1,j,1-j,-j-1}")); //0,1,-1,j,1-j,-j-jj
//const ma = mm.getMatrixFromText(" {j,j+1,j-1;-j,-1, -j-1}", Field.F9);//`{18.89,2,3;4,5,6;7,${Math.PI},999.01}`
//ma.print();
//console.log(f4.getAdditionInverse(Field.F4AlphaPlusOne));
//console.log(f4.getString(f4.getInverse(Field.F4Alpha)));

// console.log(f4.getString(f4.multiply(0, 0)));
//console.log(F4MultiplicationLookup.find(object => object.factor1 === 2 && object.factor2 === 3).result);
// printMultiplicationFieldTable(Field.F4Numbers, Field.F4);
// printMultiplicationFieldTable(Field.F8Numbers, Field.F8);
// printMultiplicationFieldTable(Field.F9Numbers, Field.F9);
//
// printAdditionFieldTable(Field.F4Numbers, Field.F4);
// printAdditionFieldTable(Field.F8Numbers, Field.F8);
// printAdditionFieldTable(Field.F9Numbers, Field.F9);

// const n1 = new ExpressionNode(null, null, null, 5);
// const n2 = new ExpressionNode(null, null, null, 6);
// const n3 = new ExpressionNode(null, null, null, 7);
// const n4 = new ExpressionNode(n1, n2, operators.ADD);
// const n5 = new ExpressionNode(n3, n4, operators.MULTIPLY);
// console.log(n5.calculate());


const exp1 = "5*3+(5*4)+((5*4)+2*3*(4+6+8))+7";
const exp2 = "(4+3)*10";
const exp3 = "(a+1+a)*a+1*a";
const exp4 = "1+b+bs*(b*bs*bs)";
const exp5 = "bs*b*(1+bs*(b+bs))";
const exp6 = "(j+j*j)*(j-1+(1+1+j))";


const exp7 = "rowReduce({4,3,8,9;3,78,3,4;5,3,2,7})";
const exp8 = "4(4(4(4(4(4(4))))))*rowreduce({1,1;1,1})";

const time = performance.now();
//console.log(new Interpreter(Field.F8).interpret(exp).calculate());
console.log(new UserIoHandler().processCalculation(Field.R, exp1));
// console.log(interpreter._completeOmittedMultiplicationOperator("-567(4+3*(3-6))*rowreduce({1,2;3,4})*2"));
// console.log(parser._getValidNumbersAndCharacters(Field.F4));
console.log("Time: " + (performance.now()-time) + " ms");
// console.log(removeSpacesAndLineBreaks("this is \n a \r\n text!"));

// console.log(round(3.23430001, 10));


//const exp6 = "(j-1+(1+1+j))";
//const exp6 = "j-1+j-1";
//console.log(getNumberFromNumberString("5", Field.R));
//testExpression("(15+700/100-9)+(-(5+8-9)+87*(-4*3))-6/2+1", Field.F7);
//testExpression("(j-1)/(j)", Field.F9);
// testExpression("(5^2)^3", Field.R);

// const res = new RealNumber(4)
//     .multiplyWith(new RealNumber(6))
//     .addNumber(new RealNumber(5))
//     .subtractNumber(new RealNumber(4))
//     .divideByNumber(new RealNumber(5))
//     .toString();
//
// const res2 = new F4Number(Field.F4Alpha).add(new F4Number(Field.F4One)).multiplyWith(new F4Number(Field.F4Alpha)).toString();
//
// const res3 = new F9Number(Field.F9Iota).add(new F9Number(Field.F9MinusOne)).divideBy(new F9Number(Field.F9IotaPlusOne)).toString(); // 1
// // const res3 = new F9Number(Field.F9IotaMinusOne).divideBy(new F9Number(Field.F9IotaPlusOne)).toString(); // 1
// // const res3 = new F9Number(Field.F9IotaMinusOne).multiplyWith(new F9Number(Field.F9IotaMinusOne)).toString(); // j
//
// //const res3 = new F9Number(Field.F9IotaPlusOne).getMultiplicativeInverse().toString(); // j-1
//
// const res4 = new F8Number(Field.F8OnePlusBetaPlusBetaSquare).subtract(new F8Number(Field.F8One)).divideBy(new F8Number(Field.F8BetaSquare)).toString();
//
// const res5 = new PrimeFieldNumber(Field.F5, 3)
//     .add(new PrimeFieldNumber(Field.F5, 1))
//     .divideBy(new PrimeFieldNumber(Field.F5, 3))
//     .subtract(new PrimeFieldNumber(Field.F5, 4))
//     .toString();
//
// console.log(res5);

//testMatrix2(yValues, Field.R);
//testMatrix(yValues, Field.R);

//const res =Matrix2.fromRawData(Field.R, hValues).multiplyWith(Matrix2.fromRawData(Field.R, iValues)).toString();
//console.log(res);




function testExpression(expression, field){
    const mep = new MathExpressionInterpreter();
    const time = Date.now();
    const result = mep.interpret(expression, field).calculate();
    console.log("Delay: " + (Date.now()-time));
    console.log("Res: " + new Field(field).getString(result));
}


function testMatrix(data, field=Field.R){
    const matrix = new Matrix(0, 0, field);
    matrix.setData(data);
    //matrix.print();
    print(matrix.getLatex(true));
    const solution = matrix.solveHomogeneousEquationSystem();
    solution.vectorSolution.forEach((vector) => vector.print());
    matrix.print();
    print(matrix.getLatex(true));
    console.log("--------------");
}

function testMatrix2(data, field){
    const matrix = Matrix.fromRawData(field, data);

    const solution = matrix.solveHomogeneousEquationSystem();
    solution.vectorSolution.forEach(vector => vector.print());
    solution.rowReducedMatrix.print();
}

function printAdditionFieldTable(fieldElements, field){
    const fieldObject = new Field(field);
    for(const firstElement in fieldElements){
        for(const secondElement in fieldElements){
            const result = fieldObject.getString(fieldObject.add(firstElement, secondElement));
            console.log(fieldObject.getString(firstElement) + " + " + fieldObject.getString(secondElement) + " = \t\t" + result);
        }
        console.log("---------------------");
    }
}

function printMultiplicationFieldTable(fieldElements, field){
    const fieldObject = new Field(field);
    for(var firstElement in fieldElements){
        for(const secondElement in fieldElements){
            const result = fieldObject.getString(fieldObject.multiply(firstElement, secondElement));
            console.log(fieldObject.getString(firstElement) + " * " + fieldObject.getString(secondElement) + " = \t\t" + result);
        }
        console.log("---------------------");
    }
}

function print(text){
    document.getElementById("output").textContent += text;
}

function printMathDisplay(text){
    print("\\[" + text + "\\]");
}