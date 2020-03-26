const Operators = {
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

const listOfAllOperators = [Operators.ADD, Operators.SUBTRACT, Operators.MULTIPLY, Operators.EXPONENTIATE,
    Operators.DIVIDE, Operators.ROW_REDUCE, Operators.DETERMINANT, Operators.ABSOLUTE_VALUE];

const functionOperators = [Operators.ROW_REDUCE, Operators.DETERMINANT, Operators.ABSOLUTE_VALUE];

const generalCharacters = [',', ';','(', ')', '{', '}', '[', ']'];
const realNumberCharacters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
const realNumberCharactersWithoutDot = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const primeFieldNumberCharacters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const f4NumberCharacters = ['0', '1', 'a'];
const f8NumberCharacters = ['0', '1', 'b', 'bs'];
const f9NumberCharacters = ['0', '1', 'j'];