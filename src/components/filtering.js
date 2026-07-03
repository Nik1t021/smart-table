import { createComparison, defaultRules } from "../lib/filter.js";

export function initFiltering(elements, indexes) {

    // Заполняем select
    Object.keys(indexes).forEach((elementName) => {
        elements[elementName].append(
            ...Object.values(indexes[elementName]).map(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                return option;
            })
        );
    });

    return (data, state, action) => {

        // Очистка поля
        if (action && action.name === 'clear') {
            const input = action.parentElement.querySelector('input');

            if (input) {
                input.value = '';
                state[action.dataset.field] = '';
            }
        }

        // Создаем функцию сравнения
        const compare = createComparison(defaultRules);

        // Фильтрация данных
        return data.filter(row => compare(row, state));
    };
}