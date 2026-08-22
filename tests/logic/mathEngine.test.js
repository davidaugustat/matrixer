/**
 * @file Verifies Matrixer's public math-engine behavior across supported fields and operations.
 */

import { describe, expect, it } from "vitest";
import { Exceptions } from "../../source/mathEngine/Exceptions";
import UserIoHandler from "../../source/mathEngine/stringInterpretation/UserIoHandler";
import HomogeneousEquationSystemResult from "../../source/mathEngine/stringInterpretation/result/HomogeneousEquationSystemResult";
import MathElementResult from "../../source/mathEngine/stringInterpretation/result/MathElementResult";

const REAL_FIELD = 100;
const REAL_RESULT_TOLERANCE = 1e-10;

/**
 * Processes one expression through the same façade used by the web interface.
 *
 * @param {number} field Field identifier accepted by the math engine.
 * @param {string} expression User-input expression to calculate.
 * @returns {import("../../source/mathEngine/stringInterpretation/result/Result").default} Calculation result.
 */
function calculate(field, expression) {
    return new UserIoHandler().processCalculation(field, expression);
}

/**
 * Separates a real-number result's structure from its numeric values.
 *
 * @param {string} code Reusable scalar, vector, or matrix result code.
 * @returns {{structure: string, numbers: number[]}} Structural template and parsed numeric values.
 */
function parseRealCodeResult(code) {
    const numberPattern = /-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?/gi;
    const numbers = Array.from(code.matchAll(numberPattern), (match) => Number(match[0]));
    return {
        structure: code.replace(numberPattern, "#"),
        numbers
    };
}

/**
 * Compares real-number result code with a relative and absolute floating-point tolerance.
 *
 * @param {string} actualCode Actual reusable result code.
 * @param {string} expectedCode Expected reusable result code.
 * @returns {void}
 */
function expectRealCodeResult(actualCode, expectedCode) {
    const actual = parseRealCodeResult(actualCode);
    const expected = parseRealCodeResult(expectedCode);

    expect(actual.structure).toBe(expected.structure);
    expect(actual.numbers).toHaveLength(expected.numbers.length);
    actual.numbers.forEach((actualNumber, index) => {
        const expectedNumber = expected.numbers[index];
        const allowedDifference = REAL_RESULT_TOLERANCE * Math.max(1, Math.abs(expectedNumber));
        expect(Math.abs(actualNumber - expectedNumber)).toBeLessThanOrEqual(allowedDifference);
    });
}

/**
 * Calculates an expression and verifies its reusable result representation.
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
    if (field === REAL_FIELD) {
        expectRealCodeResult(result.codeResult, expectedCode);
    } else {
        expect(result.codeResult).toBe(expectedCode);
    }
    return result;
}

describe("supported fields", () => {
    it.each([
        [100, "2+3*4", "14"],
        [2, "1+1", "0"],
        [3, "2+2", "1"],
        [4, "a*a", "a+1"],
        [5, "4+3", "2"],
        [7, "3*5", "1"],
        [8, "bs*(1+b+bs)-b", "1+b"],
        [9, "j*j", "-1"],
        [11, "7+8", "4"],
        [13, "5*3", "2"],
        [17, "16+2", "1"],
        [19, "10*2", "1"]
    ])("calculates on field %i", (field, expression, expectedCode) => {
        expectCodeResult(field, expression, expectedCode);
    });
});

describe("scalar expressions", () => {
    it.each([
        [100, "-5*(3+4.5)/6-5^3", "-131.25"],
        [5, "3/2", "4"],
        [100, "4^0.5", "2"],
        [5, "2^4", "1"],
        [4, "multinverse(a)", "a+1"],
        [5, "additiveinverse(2)", "3"]
    ])("supports scalar operation %#", (field, expression, expectedCode) => {
        expectCodeResult(field, expression, expectedCode);
    });

    it("normalizes spaces and capitalization", () => {
        expectCodeResult(8, " BS * (1 + B + BS) - B ", "1+b");
    });

    it("returns exact scalar LaTeX and input feedback", () => {
        const result = expectCodeResult(100, "2+3*4", "14");

        expect(result.latexUserInput).toBe("2+3*4");
        expect(result.latexResult).toBe("14");
    });
});

describe("matrix expressions", () => {
    it.each([
        [5, "{0,4,3;1,2,4}*{1,3;0,2;4,2}", "{2, 4; 2, 0}"],
        [4, "{a,a+1;0,1}+{0,1;a,a}", "{a, a; a, a+1}"],
        [100, "{5,4;3,2}-{1,1;1,1}", "{4, 3; 2, 1}"],
        [4, "a*{1,1;1,1}", "{a, a; a, a}"],
        [5, "{1,1;0,1}^2", "{1, 2; 0, 1}"],
        [100, "transpose({1,2,3;4,5,6})", "{1, 4; 2, 5; 3, 6}"],
        [100, "rowreduce({1,2,3,4;5,6,7,8;9,0,1,2})", "{1, 0, 0, 0; 0, 1, 0, -1; 0, 0, 1, 2}"],
        [7, "multinverse({1,5,3;3,4,1;6,2,5})", "{6, 3, 0; 4, 5, 5; 1, 0, 1}"],
        [100, "det({1,2,3;4,5,7;8,9,10})", "7"]
    ])("supports matrix operation %#", (field, expression, expectedCode) => {
        expectCodeResult(field, expression, expectedCode);
    });

    it("returns exact matrix LaTeX", () => {
        const result = expectCodeResult(5, "{1,2;3,4}", "{1, 2; 3, 4}");

        expect(result.latexResult).toBe("\\begin{pmatrix}1 & 2\\\\3 & 4\\\\\\end{pmatrix}");
    });
});

describe("vector expressions", () => {
    it.each([
        [3, "[2,1,2]*[2,2,0]", "0"],
        [100, "[1,2,3]-[4,5,6]", "[-3, -3, -3]"],
        [5, "[4,3]+[3,4]", "[2, 2]"],
        [100, "2*[1,2,3]", "[2, 4, 6]"],
        [5, "{0,4,3;1,2,4}*[1,0,4]", "[2, 2]"]
    ])("supports vector operation %#", (field, expression, expectedCode) => {
        expectCodeResult(field, expression, expectedCode);
    });

    it("returns exact vector LaTeX", () => {
        const result = expectCodeResult(5, "[1,2]", "[1, 2]");

        expect(result.latexResult).toBe("\\begin{pmatrix}1\\\\2\\\\\\end{pmatrix}");
    });
});

describe("homogeneous equation systems", () => {
    it("returns the documented non-trivial F9 solution", () => {
        const result = calculate(9, "solvehom({1,j,-j;1-j,0,-1})");

        expect(result.isSuccessful, result.exception?.englishMessage).toBe(true);
        expect(result).toBeInstanceOf(HomogeneousEquationSystemResult);
        expect(result.hasNonTrivialSolution).toBe(true);
        expect(result.nonTrivialSolutionLatex).toBe(
            "\\langle\\begin{pmatrix}-\\iota-1 \\\\-\\iota-1 \\\\1\\\\\\end{pmatrix}\\rangle"
        );
        expect(result.trivialSolutionLatex).toBe("\\begin{pmatrix}0\\\\0\\\\0\\\\\\end{pmatrix}");
        expect(result.rowReducedMatrixLatex).toBe(
            "\\begin{pmatrix}1 & 0 & \\iota+1 \\\\0 & 1 & \\iota+1 \\\\\\end{pmatrix}"
        );
    });

    it("reports when only the trivial solution exists", () => {
        const result = calculate(5, "solvehom({1,0;0,1})");

        expect(result.isSuccessful, result.exception?.englishMessage).toBe(true);
        expect(result).toBeInstanceOf(HomogeneousEquationSystemResult);
        expect(result.hasNonTrivialSolution).toBe(false);
        expect(result.nonTrivialSolutionLatex).toBeNull();
        expect(result.trivialSolutionLatex).toBe("\\begin{pmatrix}0\\\\0\\\\\\end{pmatrix}");
    });
});

describe("invalid expressions", () => {
    it.each([
        [100, "", Exceptions.EmptyInputException],
        [100, "1+x", Exceptions.InvalidNumbersOrCharactersException],
        [4, "2", Exceptions.InvalidNumberException],
        [100, "(1+2", Exceptions.InvalidBracketsException],
        [100, "{1,2;3}", Exceptions.UnequalAmountOfMatrixColumnsException],
        [100, "[1;2]", Exceptions.InvalidVectorException],
        [5, "1/0", Exceptions.DivisionByZeroException],
        [5, "multinverse(0)", Exceptions.MultiplicativeInverseOfZeroException],
        [4, "a^0.5", Exceptions.InvalidExponentException],
        [5, "{1,2}*{1,2}", Exceptions.MultiplicationOfMatricesWithInvalidDimensionsException],
        [5, "[1,2]+[1]", Exceptions.AdditionOfVectorsWrongDimensionsException],
        [5, "{1,2}+1", Exceptions.AdditionOfNumberToMatrixException],
        [100, "multinverse({1,2;2,4})", Exceptions.InvertNotInvertable],
        [100, "det({1,2,3;4,5,6})", Exceptions.DeterminantNotASquareMatrixException],
        [5, "solvehom(1)", Exceptions.NoMatrixInHomogeneousEquationOperatorException],
        [5, "1+solvehom({1})", Exceptions.NonMathElementOperatorUsedIncorrectlyException]
    ])("classifies invalid expression %#", (field, expression, expectedException) => {
        const result = calculate(field, expression);

        expect(result.isSuccessful).toBe(false);
        expect(result.exception).toBe(expectedException);
        expect(result.exception.englishMessage).toBeTypeOf("string");
        expect(result.exception.germanMessage).toBeTypeOf("string");
    });
});
