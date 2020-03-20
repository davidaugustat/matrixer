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
// testMatrix(aValues);
//testMatrix(dValues, Field.F4);
// console.log("-".replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\-]', 'g'), '\\$&'));
console.log(RegExp(getMatrixRegex(Field.F9)).test("{0,1,-1,j,1-j,-j-1}")); //0,1,-1,j,1-j,-j-jj
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

function testMatrix(data, field=Field.R){
    var matrix = new Matrix(0,0, field);
    matrix.setData(data);
    //matrix.print();
    print(matrix.getLatex(true));
    var solution = matrix.solveHomogeneousEquationSystem();
    solution.vectorSolution.forEach((vector) => vector.print());
    //matrix.print();
    print(matrix.getLatex(true));
    console.log("--------------");
}


function printAdditionFieldTable(fieldElements, field){
    var fieldObject = new Field(field);
    for(var firstElement in fieldElements){
        for(var secondElement in fieldElements){
            var result = fieldObject.getString(fieldObject.add(firstElement, secondElement));
            console.log(fieldObject.getString(firstElement) + " + " + fieldObject.getString(secondElement) + " = \t\t" + result);
        }
        console.log("---------------------");
    }
}

function printMultiplicationFieldTable(fieldElements, field){
    var fieldObject = new Field(field);
    for(var firstElement in fieldElements){
        for(var secondElement in fieldElements){
            var result = fieldObject.getString(fieldObject.multiply(firstElement, secondElement));
            console.log(fieldObject.getString(firstElement) + " * " + fieldObject.getString(secondElement) + " = \t\t" + result);
        }
        console.log("---------------------");
    }
}

function print(text){
    document.getElementById("output").textContent += text;
}


