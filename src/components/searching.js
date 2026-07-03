import {
    createComparison,
    rules,
    skipEmptyTargetValues
} from "../lib/filter.js";

export function initSearching(searchField) {

    const compare = createComparison(
        [skipEmptyTargetValues],
        [
            rules.searchMultipleFields(
                searchField,
                ['date', 'customer', 'seller'],
                false
            )
        ]
    );

    return (data, state) => {
        if (!state?.[searchField]) return data;
        return data.filter(row => compare(row, state));
    };
}