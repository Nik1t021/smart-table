import { createComparison, defaultRules } from "../lib/filter.js";

export function initFiltering(elements, indexes) {

    Object.keys(indexes).forEach((key) => {
        elements[key].append(
            ...Object.values(indexes[key]).map(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                return option;
            })
        );
    });

    return (data, state, action) => {

        if (action && action.name === 'clear') {
            const input = action.parentElement.querySelector('input');

            if (input) {
                input.value = '';
                state[action.dataset.field] = '';
            }
        }

        const compare = createComparison(defaultRules);

        return data.filter(row => row && compare(row, state));
    };
}