
/**
 * This file contains all exceptions that can be thrown by the math engine.
 *
 * Every exception object contains an English as well as a German text describing the error. The error strings are
 * suited for being displayed to the user in case of an error.
 *
 * @author David Augustat
 * */

/*
Template exception:

Exception: {
    englishMessage: "",
    germanMessage: ""
},
*/

export const Exceptions = {
    InvalidBracketsException: {
        englishMessage: "An invalid order or quantity of brackets has been detected.",
        germanMessage: "Eine falsche Anordnung oder Anzahl von Klammern wurde erkannt."
    },

    EmptyBracketsException: {
        englishMessage: "An empty pair of brackets has been detected.",
        germanMessage: "Ein leeres Klammerpaar wurde erkannt."
    },

    InvalidNumbersOrCharactersException: {
        englishMessage: "Invalid characters or numbers has been detected.",
        germanMessage: "Ungültige Zeichen oder Zahlen wurden erkannt."
    },

    OperatorsAtInvalidPositionException: {
        englishMessage: "Operators at disallowed positions have been detected.",
        germanMessage: "Es wurden Operatoren an ungültigen Stellen erkannt."
    },

    FunctionOperatorNotFollowedByBracketException: {
        englishMessage: "Function operators must always be followed by round brackets. E.g. rowreduce({1,2;3,4})",
        germanMessage: "Auf Funktionsoperatoren müssen immer runde Klammern folgen. z.B. rowreduce({1,2;3,4})"
    },

    InvalidMatrixException: {
        englishMessage: "Invalid matrix has been detected.",
        germanMessage: "Eine ungültige Matrix wurde gefunden."
    },

    InvalidVectorException: {
        englishMessage: "Invalid vector has been detected.",
        germanMessage: "Ein ungültiger Vektor wurde gefunden."
    },

    CommaOrSemicolonOutsideOfMatrixAndVectorException: {
        englishMessage: "Commas or semicolons may only be used inside of matrices or vectors",
        germanMessage: "Kommas oder Semikola dürfen nur innerhalb von Matrizen und Vektoren genutzt werden."
    },

    InvalidNumberException: {
        englishMessage: "An invalid number for the selected field has been detected.",
        germanMessage: "Eine auf dem gewählten Körper ungültige Zahl wurde gefunden."
    },

    MethodNotImplementedException: {
        englishMessage: "A method used by this expression is not implemented. This is an unwanted behaviour. " +
            "Please contact the developer.",
        germanMessage: "Eine Methode, die bei der Berechnung benötigt wird, ist nicht implementiert. Dies ist ein " +
            "Fehler. Bitte kontaktiere den Entwickler."
    },

    AdditionOfMatrixToNumberException: {
        englishMessage: "Adding a matrix to a number is not allowed.",
        germanMessage: "Es ist nicht erlaubt, eine Matrix zu einer Zahl hinzuzuaddieren."
    },

    AdditionOfVectorToNumberException: {
        englishMessage: "Adding a vector to a number is not allowed.",
        germanMessage: "Es ist nicht erlaubt, einen Vektor zu einer Zahl hinzuzuaddieren."
    },

    SubtractionOfMatrixFromNumberException: {
        englishMessage: "Subtracting a matrix from a number is not allowed.",
        germanMessage: "Es ist nicht erlaubt, eine Matrix von einer Zahl zu subtrahieren."
    },

    SubtractionOfVectorFromNumberException: {
        englishMessage: "Subtracting a vector from a number is not allowed.",
        germanMessage: "Es ist nicht erlaubt, einen Vektor von einer Zahl zu subtrahieren."
    },

    DivisionByMatrixException: {
        englishMessage: "Dividing by a matrix is not allowed.",
        germanMessage: "Man darf nicht durch eine Matrix teilen."
    },

    DivisionByVectorException: {
        englishMessage: "Dividing by a vector is not allowed.",
        germanMessage: "Man darf nicht durch einen Vektor teilen."
    },

    InvalidExponentException: {
        englishMessage: "Invalid exponent detected. Exponents must always be a real number, even when another field " +
            "than R is used. Additionally, when calculating on finite fields, exponent may only be whole numbers >= 0.",
        germanMessage: "Ein ungültiger Exponent wurde erkannt. Exponenten müssen immer reelle Zahlen sein, egal in " +
            "welchem Körper man rechnet. Beim Rechnen auf endlichen Körpern darf der Exponent zudem nur eine" +
            " Ganzzahl >= 0 sein."
    },

    AdditionOfNumberToMatrixException: {
        englishMessage: "It is not allowed to add a number to a matrix.",
        germanMessage: "Man kann keine Zahl zu einer Matrix hinzuaddieren."
    },

    MultiplicationOfMatricesWithInvalidDimensionsException: {
        englishMessage: "Matrices can only be multiplied if the column count of the first matrix is equal to the row " +
            "count of the second matrix.",
        germanMessage: "Matrizen können nur miteinander multipliziert werden, wenn die Spaltenanzahl der ersten Matrix" +
            "gleich der Zeilenanzahl der zweiten Matrix ist."
    },

    MultiplicationOfMatrixWithVectorWithInvalidDimensionsException: {
        englishMessage: "A matrix can only be multiplied by a vector if the column count of the matrix is equal to the" +
            "row count of the vector.",
        germanMessage: "Eine Matrix kann nur mit einem Vektor multipliziert werden, wenn die Spaltenanzahl der Matrix" +
            "gleich der Zeilenanzahl des Vektors ist."
    },

    SubtractionOfNumberFromMatrixException: {
        englishMessage: "It is not allowed to subtract a number from a matrix.",
        germanMessage: "Man kann keine Zahl von einer Matrix subtrahieren."
    },

    AdditionOrSubtractionOfMatricesWithDifferentDimensionsException: {
        englishMessage: "Adding or subtracting two matrices with different amounts of rows or columns is not allowed.",
        germanMessage: "Man kann nicht zwei Matrizen mit unterschiedlichen Zeilen- oder Spaltenanzahlen addieren oder " +
            "subtrahieren."
    },

    AdditionOfVectorToMatrixException: {
        englishMessage: "Adding a vector to a matrix is not allowed.",
        germanMessage: "Man kann nicht einen Vektor zu einer Matrix hinzuaddieren."
    },

    UnequalAmountOfMatrixColumnsException: {
        englishMessage: "A matrix with an unequal amount of columns per row has been detected.",
        germanMessage: "Es wurde eine Matrix mit ungleichen Spaltenanzahlen pro Zeile gefunden."
    },

    DivisionByZeroException: {
        englishMessage: "Division by zero is not allowed.",
        germanMessage: "Man darf nicht durch Null teilen."
    },

    MultiplicationOfVectorByMatrixException: {
        englishMessage: "It is not allowed to multiply a vector by a matrix. Only the other way around " +
            "(matrix * vector) is allowed.",
        germanMessage: "Man kann nicht einen Vektor mit einer Matrix multiplizieren. Nur die umgekehrte Richtung " +
            "(Matrix * Vektor) ist erlaubt."
    },

    MultiplicationOfVectorsWrongDimensionsException: {
        englishMessage: "Vectors can only be multiplied if they have the same number of rows.",
        germanMessage: "Vektoren können nur miteinander multipliziert werden, wenn sie die gleiche Anzahl an Zeilen haben."
    },

    AdditionOfNumberToVectorException: {
        englishMessage: "It is not allowed to add a number to a vector.",
        germanMessage: "Man kann keine Zahl zu einem Vektor hinzuaddieren."
    },

    AdditionOfMatrixToVectorException: {
        englishMessage: "It is not allowed to add a matrix to a vector.",
        germanMessage: "Man kann keine Matrix zu einem Vektor hinzuaddieren."
    },

    AdditionOfVectorsWrongDimensionsException: {
        englishMessage: "Vectors can only be added if they have the same number of rows.",
        germanMessage: "Vektoren können nur addiert werden, wenn sie die gleiche Anzahl an Zeilen haben."
    },

    SubtractionOfNumberFromVectorException: {
        englishMessage: "It is not allowed to subtract a number from a vector.",
        germanMessage: "Man kann keine Zahl von einem Vektor subtrahieren."
    },

    SubtractionOfMatrixFromVectorException: {
        englishMessage: "It is not allowed to subtract a matrix from a vector.",
        germanMessage: "Man kann keine Matrix von einem Vektor subtrahieren."
    },

    InvalidOperatorException: {
        englishMessage: "An invalid operator has been detected.",
        germanMessage: "Ein ungültiger Operator wurde gefunden."
    },

    RowReduceNotAMatrixException: {
        englishMessage: "The rowreduce operator can only process matrices.",
        germanMessage: "Der rowreduce-Operator kann nur Matrizen verarbeiten."
    },

    TransposeNotAMatrixException: {
        englishMessage: "The transpose operator can only process matrices.",
        germanMessage: "Der transpose-Operator kann nur Matrizen verarbeiten."
    },

    InvertNotInvertable: {
        englishMessage: "The matrix does not have an inverse matrix.",
        germanMessage: "Die Matrix besitzt keine inverse Matrix."
    },

    DeterminantNotAMatrixException: {
        englishMessage: "The determinant operator (det) can only process matrices.",
        germanMessage: "Der Determinanten-Operator (det) kann nur Matrizen verarbeiten."
    },

    DeterminantNotASquareMatrixException: {
        englishMessage: "The matrix does not have a determinant since it's not a square matrix.",
        germanMessage: "Die Matrix hat keine Determinante, da sie keine quadratische Matrix ist."
    },

    EmptyInputException: {
        englishMessage: "No input has been entered. Please enter an expression in the text field.",
        germanMessage: "Es wurde nichts eingegeben. Bitte gib einen mathematischen Ausdruck in das Textfeld ein."
    },

    NoMatrixInHomogeneousEquationOperatorException: {
        englishMessage: "Only a matrix can be solved as an homogeneous equation system.",
        germanMessage: "Nur eine Matrix kann als homogenes Gleichungssystem gelöst werden."
    },

    NonMathElementOperatorUsedIncorrectlyException: {
        englishMessage: "An operator that does not directly return a math element (Number, Matrix, Vector) has been" +
            " used in a disallowed manner. Note that operators that do not return a math element, cannot be" +
            " nested inside other operators and cannot be combined with other operators since their return value" +
            " can't directly be used in calculations.",
        germanMessage: "Ein Operator, der kein mathematisches Element (Zahl, Matrix, Vektor) zurückliefert, wurde in" +
            " einer unerlaubten Weise verwendet. Beachte, dass man solche Operatoren nicht mit anderen Operatoren" +
            " kombinieren kann, da man mit ihrem Ergebnis nicht mehr direkt weiterrechnen kann."
    },

    MultiplicativeInverseNoNumberOrMatrixException: {
        englishMessage: "The multiplicative inverse element can only be calculated from a number or matrix, not a" +
            " vector.",
        germanMessage: "Das multiplikativ inverse Element kann nur von einer Zahl oder Matrix berechnet werden, nicht von" +
            "einem Vektor."
    },

    AdditiveInverseNoNumberException: {
        englishMessage: "The additive inverse element can only be calculated from a number, not a matrix or vector.",
        germanMessage: "Das additiv inverse Element kann nur von einer Zahl berechnet werden, nicht von einer Matrix" +
            " oder einem Vektor."
    },

    MultiplicativeInverseOfZeroException: {
        englishMessage: "A multiplicative inverse element of zero doesn't exist.",
        germanMessage: "Ein multiplikativ inverses Element zur Null existiert nicht."
    },



};
