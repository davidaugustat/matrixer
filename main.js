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

var aValues = [
    [1,4,-8,7],
    [2,5,-10,8],
    [3,6,-12,99]
];

var aValues = [
    [1,4,-8,8,7],
    [2,5,-10,10,8],
    [3,6,-12,12,99]
];

var mm = new MatrixManager();



var f4 = new Field(Field.F4);
//console.log(f4.getString(f4.getInverse(Field.F4Alpha)));

console.log(f4.getString(f4.multiply(0, 0)));
//console.log(F4MultiplicationLookup.find(object => object.factor1 === 2 && object.factor2 === 3).result);
printFieldTable(Field.F4Numbers, Field.F4);
printFieldTable(Field.F8Numbers, Field.F8);
printFieldTable(Field.F9Numbers, Field.F9);

function testMatrix(data){
    var matrix = new Matrix(0,0);
    matrix.setData(data);
    matrix.print();
    var solution = matrix.solveHomogenousEquationSystem();
    //solution.vectorSolution.forEach((vector) => vector.print());
    matrix.print();
    console.log("--------------");
}

function printFieldTable(fieldElements, field){
    var fieldObject = new Field(field);
    for(var firstElement in fieldElements){
        for(var secondElement in fieldElements){
            var result = fieldObject.getString(fieldObject.multiply(firstElement, secondElement));
            console.log(fieldObject.getString(firstElement) + " * " + fieldObject.getString(secondElement) + " = \t\t" + result);
        }
        console.log("---------------------");
    }
}


