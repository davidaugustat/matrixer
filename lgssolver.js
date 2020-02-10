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

var f5 = new Field(Field.F5);
//console.log(f5.multiply(2, 3));
console.log(f5.getInverse(4));

 //testMatrix(mValues);
 //testMatrix(xValues);
 //testMatrix(yValues);
 //testMatrix(aValues);

function testMatrix(data){
  var matrix = new Matrix(0,0);
  matrix.setData(data);
  matrix.print();
  var solution = matrix.solveHomogenousEquationSystem();
  solution.vectorSolution.forEach((vector) => vector.print());
  matrix.print();
  console.log("--------------");
}
