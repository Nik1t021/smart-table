import { sortMap } from "../lib/sort.js";

export function initSorting(columns) {
    return (query, state, action) => {
        let field = null;
        let order = null;

        if (
            action &&
            action.name === "sort"
        ) {
            const currentOrder =
                action.dataset.value ||
                "none";

            action.dataset.value =
                sortMap[currentOrder];

            field =
                action.dataset.field;

            order =
                action.dataset.value;

            // Разрешаем сортировку только
            // по одному столбцу одновременно
            columns.forEach((column) => {
                if (column !== action) {
                    column.dataset.value =
                        "none";
                }
            });
        } else {
            // Восстанавливаем активную сортировку
            columns.forEach((column) => {
                if (
                    column.dataset.value !==
                    "none"
                ) {
                    field =
                        column.dataset.field;

                    order =
                        column.dataset.value;
                }
            });
        }

        const sort =
            field && order !== "none"
                ? `${field}:${order}`
                : null;

        return sort
            ? Object.assign({}, query, {
                sort
            })
            : query;
    };
}