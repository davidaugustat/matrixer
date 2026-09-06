/**
 * @file Synchronizes committed calculator input with Vue Router query parameters.
 */

import Helper from "@mathEngine/Helper";

const FIELD_PARAM_NAME = "field";
const EXPRESSION_PARAM_NAME = "exp";

/**
 * Selects one value from a Vue Router query parameter.
 *
 * @param {string|string[]|null|undefined} value Query parameter value.
 * @returns {string|null|undefined} A single query parameter value.
 */
function getSingleQueryValue(value) {
    return Array.isArray(value) ? value[0] : value;
}

/**
 * Creates calculator query synchronization for the current route.
 *
 * @param {function(object|null): void} onQueryChange Handles valid or cleared calculator queries.
 * @returns {{setCalculatorQuery: function(number, string): Promise<void>}} Query update action.
 */
export function useCalculatorQuery(onQueryChange) {
    const route = useRoute();
    const router = useRouter();
    let isReady = false;

    /**
     * Applies supported calculator parameters from a route query.
     *
     * @param {[string|string[]|null|undefined, string|string[]|null|undefined]} queryValues Query values to inspect.
     * @returns {void}
     */
    function applyRouteQuery(queryValues) {
        if (!isReady) {
            return;
        }

        const fieldValue = getSingleQueryValue(queryValues[0]);
        const expressionValue = getSingleQueryValue(queryValues[1]);

        if (fieldValue == null && expressionValue == null) {
            onQueryChange(null);
            return;
        }

        const fieldNumber = Number.parseInt(fieldValue, 10);
        if (!Number.isNaN(fieldNumber) && Helper.isField(fieldNumber) && expressionValue != null) {
            onQueryChange({
                fieldNumber,
                expressionString: expressionValue
            });
        }
    }

    watch(
        () => [route.query[FIELD_PARAM_NAME], route.query[EXPRESSION_PARAM_NAME]],
        applyRouteQuery
    );

    onNuxtReady(() => {
        isReady = true;
        applyRouteQuery([route.query[FIELD_PARAM_NAME], route.query[EXPRESSION_PARAM_NAME]]);
    });

    /**
     * Pushes shareable calculator parameters through Vue Router.
     *
     * @param {number} fieldNumber Selected field number.
     * @param {string} expressionString Expression entered by the user.
     * @returns {Promise<void>} Resolves after Vue Router finishes navigation.
     */
    async function setCalculatorQuery(fieldNumber, expressionString) {
        await router.push({
            path: route.path,
            query: {
                [FIELD_PARAM_NAME]: String(fieldNumber),
                [EXPRESSION_PARAM_NAME]: expressionString
            }
        });
    }

    return {
        setCalculatorQuery
    };
}
