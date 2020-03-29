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
    DETERMINANT: 'det',
    ABSOLUTE_VALUE: 'abs'
};

export const Constants = {
    listOfAllOperators: [Operators.ADD, Operators.SUBTRACT, Operators.MULTIPLY, Operators.EXPONENTIATE,
        Operators.DIVIDE, Operators.ROW_REDUCE, Operators.DETERMINANT, Operators.ABSOLUTE_VALUE],

    infixOperators: [Operators.ADD, Operators.SUBTRACT, Operators.MULTIPLY, Operators.DIVIDE, Operators.EXPONENTIATE],

    functionOperators: [Operators.ROW_REDUCE, Operators.DETERMINANT, Operators.ABSOLUTE_VALUE],

    generalCharacters: [',', ';','(', ')', '{', '}', '[', ']'],
    realNumberCharacters: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'],
    realNumberCharactersWithoutDot: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    primeFieldNumberCharacters: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    f4NumberCharacters: ['0', '1', 'a'],
    f8NumberCharacters: ['0', '1', 'b', 'bs'],
    f9NumberCharacters: ['0', '1', 'j']
};

