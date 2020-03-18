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


 // testMatrix(mValues);
 // testMatrix(xValues);
 // testMatrix(yValues);
 // testMatrix(aValues);

  console.log(new Field(Field.F7).getInverse(5));
 //extendedEuclideanAlgorithm(7, 3);

function testMatrix(data){
  var matrix = new Matrix(0,0);
  matrix.setData(data);
  matrix.print();
  var solution = matrix.solveHomogenousEquationSystem();
  //solution.vectorSolution.forEach((vector) => vector.print());
  matrix.print();
  console.log("--------------");
}

function extendedEuclideanAlgorithm(num1, num2){
  var multiples = [1];

  var u1 = 0;
  var u2 = num1;
  var u3 = num2;

  while(u3 > 0){
    u1 = u2;
    u2 = u3;
    u3 = u1 % u2;
    multiples.push((u1-u3)/u2);
  }

  console.log("gcd: " + u2);
  console.log("multiples: " + multiples);
  multiples = multiples.reverse();
  console.log("multiples: " + multiples);

  var wPrePrevious = 0;
  var wPrevious = 0;
  var wCurrent = 1;
  for(var i = 0; i < multiples.length-2; i++){
    // wOld = wOld - multiples[i+1] * w;
    // w = w - multiples[i+2] * wOld;
    wPrePrevious = wPrevious;
    wPrevious = wCurrent;
    wCurrent = wPrePrevious-multiples[i+1]*wPrevious;
  }
  console.log("wPrePrevious " + wPrePrevious);
  console.log("wPrevious " + wPrevious);
  console.log("Wcurrent " + wCurrent);
}
