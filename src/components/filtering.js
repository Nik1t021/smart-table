export function initFiltering(elements) {
    // Заполнение select после асинхронного
    // получения справочников с сервера
    const updateIndexes = (
        targetElements,
        indexes
    ) => {
        Object.keys(indexes).forEach(
            (elementName) => {
                const element =
                    targetElements[elementName];

                const values =
                    indexes[elementName];

                if (!element || !values) {
                    return;
                }

                // Сохраняем первую пустую option,
                // удаляем старые динамические варианты
                while (
                    element.options.length > 1
                ) {
                    element.remove(1);
                }

                const options =
                    Object.values(values).map(
                        (name) => {
                            const option =
                                document.createElement(
                                    "option"
                                );

                            option.textContent =
                                name;

                            option.value =
                                name;

                            return option;
                        }
                    );

                element.append(...options);
            }
        );
    };

    const applyFiltering = (
        query,
        state,
        action
    ) => {
        // Очистка отдельного текстового фильтра
        if (
            action &&
            action.name === "clear"
        ) {
            const parent =
                action.closest("label");

            const input =
                parent?.querySelector(
                    "input, select"
                );

            if (input) {
                input.value = "";

                // В state ключи соответствуют name,
                // а не data-name
                state[input.name] = "";
            }
        }

        const filter = {};

        Object.keys(elements).forEach(
            (key) => {
                const element =
                    elements[key];

                if (!element) {
                    return;
                }

                const isFormControl =
                    ["INPUT", "SELECT"].includes(
                        element.tagName
                    );

                if (
                    isFormControl &&
                    element.name &&
                    element.value
                ) {
                    filter[
                        `filter[${element.name}]`
                    ] = element.value;
                }
            }
        );

        return Object.keys(filter).length
            ? Object.assign(
                {},
                query,
                filter
            )
            : query;
    };

    return {
        updateIndexes,
        applyFiltering
    };
}