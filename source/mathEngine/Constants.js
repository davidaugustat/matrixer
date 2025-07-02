/**
 * This file contains several global constants that are used by the math engine.
 *
 * @author David Augustat
 * */

export const Operators = {
    ADD: '+',
    SUBTRACT: '-',
    MULTIPLY: '*',
    EXPONENTIATE: '^',
    DIVIDE: '/',
    TERMINAL: '€',
    ROW_REDUCE: 'rowreduce',
    TRANSPOSE: 'transpose',
    MULTIPLICATIVE_INVERSE: 'multinverse',
    ADDITIVE_INVERSE: 'additiveinverse',
    SOLVE_HOMOGENEOUS: 'solvehom',
    DETERMINANT: 'determinant'
};

export const MathElementType = {
    NUMBER: 1,
    MATRIX: 2,
    VECTOR: 3,
};

export const Constants = {
    listOfAllOperators: [Operators.ADD, Operators.SUBTRACT, Operators.MULTIPLY, Operators.EXPONENTIATE,
        Operators.DIVIDE, Operators.ROW_REDUCE, Operators.TRANSPOSE, Operators.MULTIPLICATIVE_INVERSE,
        Operators.ADDITIVE_INVERSE, Operators.SOLVE_HOMOGENEOUS, Operators.DETERMINANT],

    infixOperators: [Operators.ADD, Operators.SUBTRACT, Operators.MULTIPLY, Operators.DIVIDE, Operators.EXPONENTIATE],

    // bracket operators are function operators AND non-math-element operators
    bracketOperators: [Operators.ROW_REDUCE, Operators.TRANSPOSE, Operators.MULTIPLICATIVE_INVERSE,
        Operators.ADDITIVE_INVERSE, Operators.SOLVE_HOMOGENEOUS, Operators.SOLVE_HOMOGENEOUS, Operators.DETERMINANT],

    functionOperators: [Operators.ROW_REDUCE, Operators.TRANSPOSE, Operators.MULTIPLICATIVE_INVERSE,
        Operators.ADDITIVE_INVERSE, Operators.SOLVE_HOMOGENEOUS, Operators.DETERMINANT],

    // Operators, that don't return a MathElement:
    nonMathElementOperators: [Operators.SOLVE_HOMOGENEOUS],

    generalCharacters: [',', ';','(', ')', '{', '}', '[', ']'],
    realNumberCharacters: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'],
    realNumberCharactersWithoutDot: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    primeFieldNumberCharacters: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    f4NumberCharacters: ['0', '1', 'a'],
    f8NumberCharacters: ['0', '1', 'b', 'bs'],
    f9NumberCharacters: ['0', '1', 'j']
};

