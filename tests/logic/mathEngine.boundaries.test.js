/**
 * @file Verifies math-engine boundary conditions, algorithm branches, and user-facing validation errors.
 */

import { describe, expect, it } from "vitest";
import { Exceptions } from "../../source/mathEngine/Exceptions";
import UserIoHandler from "../../source/mathEngine/stringInterpretation/UserIoHandler";
import HomogeneousEquationSystemResult from "../../source/mathEngine/stringInterpretation/result/HomogeneousEquationSystemResult";
import MathElementResult from "../../source/mathEngine/stringInterpretation/result/MathElementResult";

/**
 * Processes an expression through the public math-engine façade.
 *
 * @param {number} field Field identifier accepted by the math engine.
 * @param {string} expression User-input expression to calculate.
 * @returns {import("../../source/mathEngine/stringInterpretation/result/Result").default} Calculation result.
 */
function calculate(field, expression) {
    return new UserIoHandler().processCalculation(field, expression);
}

/**
 * Calculates an expression and verifies its reusable result code.
 *
 * @param {number} field Field identifier accepted by the math engine.
 * @param {string} expression User-input expression to calculate.
 * @param {string} expectedCode Expected reusable result code.
 * @returns {MathElementResult} Successful math-element result.
 */
function expectCodeResult(field, expression, expectedCode) {
    const result = calculate(field, expression);

    expect(result.isSuccessful, result.exception?.englishMessage).toBe(true);
    expect(result).toBeInstanceOf(MathElementResult);
    expect(result.codeResult).toBe(expectedCode);
    return result;
}

describe("operator boundaries and precedence", () => {
    it.each([
        [100, "(2+3)*4", "20"],
        [100, "20/5/2", "2"],
        [100, "10-3-2", "5"],
        [100, "2^(3+1)", "16"],
        [100, "2^(-2)", "0.25"],
        [5, "2^0", "1"],
        [100, "3*(3+6)*{1,2,3;4,5,6}*[9,8,7]", "[1242, 3186]"]
    ])("field %i: %s = %s", (field, expression, expectedCode) => {
        expectCodeResult(field, expression, expectedCode);
    });

    it.each([
        [100, "{1,2;3,4}^0", "{1, 0; 0, 1}"],
        [4, "{a,1;0,a+1}^0", "{1, 0; 0, 1}"],
        [100, "{1,2;3,4}^1", "{1, 2; 3, 4}"],
        [100, "[1,2]^0", "1"],
        [100, "[1,2]^1", "[1, 2]"],
        [100, "[1,2]^2", "5"]
    ])("field %i applies exponent boundary semantics for %s", (field, expression, expectedCode) => {
        expectCodeResult(field, expression, expectedCode);
    });
});

describe("linear-algebra boundary cases", () => {
    it.each([
        [100, "rowreduce({0,1;1,0})", "{1, 0; 0, 1}"],
        [100, "rowreduce({1,2;2,4})", "{1, 2; 0, 0}"],
        [5, "rowreduce({0,0;0,0})", "{0, 0; 0, 0}"],
        [5, "rowreduce({1,2,3;2,4,1})", "{1, 2, 3; 0, 0, 0}"],
        [5, "rowreduce({1,2;2,4;0,1})", "{1, 0; 0, 1; 0, 0}"]
    ])("field %i row-reduces %s", (field, expression, expectedCode) => {
        expectCodeResult(field, expression, expectedCode);
    });

    it.each([
        [100, "det({0,1;1,0})", "-1"],
        [100, "det({1,2;2,4})", "0"],
        [100, "det({7})", "7"],
        [100, "det({1,0,0;0,1,0;0,0,1})", "1"],
        [5, "det({0,1;1,0})", "4"]
    ])("field %i calculates the determinant of %s", (field, expression, expectedCode) => {
        expectCodeResult(field, expression, expectedCode);
    });

    it.each([
        [100, "multinverse({0,1;1,0})", "{0, 1; 1, 0}"],
        [100, "multinverse({2})", "{0.5}"],
        [5, "multinverse({1,0;0,1})", "{1, 0; 0, 1}"],
        [7, "{0,1;1,1}*multinverse({0,1;1,1})", "{1, 0; 0, 1}"]
    ])("field %i inverts %s", (field, expression, expectedCode) => {
        expectCodeResult(field, expression, expectedCode);
    });

    it("returns one basis vector for every free variable", () => {
        const result = calculate(5, "solvehom({1,0,0;0,0,0})");

        expect(result.isSuccessful, result.exception?.englishMessage).toBe(true);
        expect(result).toBeInstanceOf(HomogeneousEquationSystemResult);
        expect(result.hasNonTrivialSolution).toBe(true);
        expect(result.nonTrivialSolutionLatex).toBe(
            "\\langle\\begin{pmatrix}0\\\\1\\\\0\\\\\\end{pmatrix},"
            + "\\begin{pmatrix}0\\\\0\\\\1\\\\\\end{pmatrix}\\rangle"
        );
        expect(result.rowReducedMatrixLatex).toBe(
            "\\begin{pmatrix}1 & 0 & 0\\\\0 & 0 & 0\\\\\\end{pmatrix}"
        );
    });

    it("returns every coordinate vector for a zero system", () => {
        const result = calculate(5, "solvehom({0,0;0,0})");

        expect(result.isSuccessful, result.exception?.englishMessage).toBe(true);
        expect(result).toBeInstanceOf(HomogeneousEquationSystemResult);
        expect(result.hasNonTrivialSolution).toBe(true);
        expect(result.nonTrivialSolutionLatex).toBe(
            "\\langle\\begin{pmatrix}1\\\\0\\\\\\end{pmatrix},"
            + "\\begin{pmatrix}0\\\\1\\\\\\end{pmatrix}\\rangle"
        );
    });
});

describe("additional invalid expressions", () => {
    it.each([
        [100, "()", Exceptions.EmptyBracketsException],
        [100, "1++2", Exceptions.OperatorsAtInvalidPositionException],
        [100, "rowreduce{1}", Exceptions.FunctionOperatorNotFollowedByBracketException],
        [100, "{1,,2}", Exceptions.InvalidMatrixException],
        [100, "1,2", Exceptions.CommaOrSemicolonOutsideOfMatrixAndVectorException],
        [100, "1+{1}", Exceptions.AdditionOfMatrixToNumberException],
        [100, "1+[1]", Exceptions.AdditionOfVectorToNumberException],
        [100, "1-{1}", Exceptions.SubtractionOfMatrixFromNumberException],
        [100, "1-[1]", Exceptions.SubtractionOfVectorFromNumberException],
        [100, "1/{1}", Exceptions.DivisionByMatrixException],
        [100, "1/[1]", Exceptions.DivisionByVectorException],
        [100, "{1,2}*[1]", Exceptions.MultiplicationOfMatrixWithVectorWithInvalidDimensionsException],
        [100, "{1}-1", Exceptions.SubtractionOfNumberFromMatrixException],
        [100, "{1,2}+{1;2}", Exceptions.AdditionOrSubtractionOfMatricesWithDifferentDimensionsException],
        [100, "{1}+[1]", Exceptions.AdditionOfVectorToMatrixException],
        [100, "[1]*{1}", Exceptions.MultiplicationOfVectorByMatrixException],
        [100, "[1,2]*[1]", Exceptions.MultiplicationOfVectorsWrongDimensionsException],
        [100, "[1]+1", Exceptions.AdditionOfNumberToVectorException],
        [100, "[1]+{1}", Exceptions.AdditionOfMatrixToVectorException],
        [100, "[1]-1", Exceptions.SubtractionOfNumberFromVectorException],
        [100, "[1]-{1}", Exceptions.SubtractionOfMatrixFromVectorException],
        [100, "rowreduce(1)", Exceptions.RowReduceNotAMatrixException],
        [100, "transpose(1)", Exceptions.TransposeNotAMatrixException],
        [100, "det(1)", Exceptions.DeterminantNotAMatrixException],
        [100, "multinverse([1])", Exceptions.MultiplicativeInverseNoNumberOrMatrixException],
        [100, "additiveinverse({1})", Exceptions.AdditiveInverseNoNumberException],
        [100, "{1,2,3;4,5,6}^0", Exceptions.MultiplicationOfMatricesWithInvalidDimensionsException],
        [100, "{1,2;3,4}^0.5", Exceptions.InvalidExponentException]
    ])("field %i rejects %j", (field, expression, expectedException) => {
        const result = calculate(field, expression);

        expect(result.isSuccessful).toBe(false);
        expect(result.exception).toBe(expectedException);
    });
});
