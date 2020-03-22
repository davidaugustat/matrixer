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

var mm = new MatrixManager();



var f4 = new Field(Field.F4);
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
//const exp6 = "(j-1+(1+1+j))";
//const exp6 = "j-1+j-1";
//console.log(getNumberFromNumberString("5", Field.R));
//testExpression("(15+700/100-9)+(-(5+8-9)+87*(-4*3))-6/2+1", Field.F7);
testExpression("(j-1)/(j)", Field.F9);


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
    matrix.print();
    print(matrix.getLatex(true));
    const solution = matrix.solveHomogeneousEquationSystem();
    solution.vectorSolution.forEach((vector) => vector.print());
    matrix.print();
    print(matrix.getLatex(true));
    console.log("--------------");
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


