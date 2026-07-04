import { createComparison, defaultRules } from "../lib/utils.js";

export function initFiltering(elements, indexes) {

    return (data, state, action) => {

        const compare = createComparison(defaultRules);

        if (action && action.name === 'clear') {
            const parent = action.closest('label');
            const input = parent.querySelector('input');

            input.value = '';
            state[action.dataset.field] = '';
        }

        Object.keys(elements).forEach(key => {
            if (elements[key].tagName === 'SELECT') {
                elements[key].value = state[key] || '';
            }
        });

        return data.filter(row => compare(row, state));
    };
}