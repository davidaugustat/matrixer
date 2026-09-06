/**
 * @file Exhaustively checks algebraic invariants for Matrixer's small extension fields.
 */

import { describe, expect, it } from "vitest";
import UserIoHandler from "../../source/mathEngine/stringInterpretation/UserIoHandler";
import MathElementResult from "../../source/mathEngine/stringInterpretation/result/MathElementResult";

const EXTENSION_FIELDS = [
    {
        field: 4,
        characteristic: 2,
        elements: ["0", "1", "a", "a+1"]
    },
    {
        field: 8,
        characteristic: 2,
        elements: ["0", "1", "b", "1+b", "bs", "1+bs", "b+bs", "1+b+bs"]
    },
    {
        field: 9,
        characteristic: 3,
        elements: ["0", "1", "-1", "j", "j+1", "j-1", "-j", "-j+1", "-j-1"]
    }
];

/**
 * Wraps one field-element expression so it behaves as an atomic operand.
 *
 * @param {string} element Field element in user-input notation.
 * @returns {string} Parenthesized field element.
 */
function operand(element) {
    return `(${element})`;
}

/**
 * Calculates an expression and returns its canonical reusable code.
 *
 * @param {number} field Field identifier accepted by the math engine.
 * @param {string} expression User-input expression to calculate.
 * @returns {string} Canonical reusable result code.
 */
function calculateCode(field, expression) {
    const result = new UserIoHandler().processCalculation(field, expression);

    expect(result.isSuccessful, `${expression}: ${result.exception?.englishMessage}`).toBe(true);
    expect(result).toBeInstanceOf(MathElementResult);
    return result.codeResult;
}

describe.each(EXTENSION_FIELDS)("F$field algebraic invariants", ({ field, characteristic, elements }) => {
    it("recognizes every documented element and the additive and multiplicative identities", () => {
        for (const element of elements) {
            const canonicalElement = calculateCode(field, operand(element));

            expect(calculateCode(field, `${operand(element)}+0`)).toBe(canonicalElement);
            expect(calculateCode(field, `${operand(element)}*1`)).toBe(canonicalElement);
        }
    });

    it("provides additive inverses and multiplicative inverses for every eligible element", () => {
        for (const element of elements) {
            expect(calculateCode(field, `${operand(element)}+additiveinverse${operand(element)}`)).toBe("0");
            if (element !== "0") {
                expect(calculateCode(field, `${operand(element)}*multinverse${operand(element)}`)).toBe("1");
            }
        }
    });

    it("obeys commutativity for every pair of elements", () => {
        for (const left of elements) {
            for (const right of elements) {
                expect(calculateCode(field, `${operand(left)}+${operand(right)}`)).toBe(
                    calculateCode(field, `${operand(right)}+${operand(left)}`)
                );
                expect(calculateCode(field, `${operand(left)}*${operand(right)}`)).toBe(
                    calculateCode(field, `${operand(right)}*${operand(left)}`)
                );
            }
        }
    });

    it("obeys distributivity for every triple of elements", () => {
        for (const factor of elements) {
            for (const left of elements) {
                for (const right of elements) {
                    const leftExpression = `${operand(factor)}*(${operand(left)}+${operand(right)})`;
                    const rightExpression = `${operand(factor)}*${operand(left)}+${operand(factor)}*${operand(right)}`;
                    expect(calculateCode(field, leftExpression), `${leftExpression} = ${rightExpression}`).toBe(
                        calculateCode(field, rightExpression)
                    );
                }
            }
        }
    });

    it("obeys associativity for every triple of elements", () => {
        for (const first of elements) {
            for (const second of elements) {
                for (const third of elements) {
                    const additionLeft = `(${operand(first)}+${operand(second)})+${operand(third)}`;
                    const additionRight = `${operand(first)}+(${operand(second)}+${operand(third)})`;
                    expect(calculateCode(field, additionLeft), `${additionLeft} = ${additionRight}`).toBe(
                        calculateCode(field, additionRight)
                    );

                    const multiplicationLeft = `(${operand(first)}*${operand(second)})*${operand(third)}`;
                    const multiplicationRight = `${operand(first)}*(${operand(second)}*${operand(third)})`;
                    expect(
                        calculateCode(field, multiplicationLeft),
                        `${multiplicationLeft} = ${multiplicationRight}`
                    ).toBe(calculateCode(field, multiplicationRight));
                }
            }
        }
    });

    it("has the documented field characteristic", () => {
        for (const element of elements) {
            const repeatedElement = new Array(characteristic).fill(operand(element)).join("+");
            expect(calculateCode(field, repeatedElement)).toBe("0");
        }
    });
});
