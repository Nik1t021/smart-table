import { cloneTemplate } from "../lib/utils.js";

export function initTable(settings, onAction) {
    const {
        tableTemplate,
        rowTemplate,
        before = [],
        after = []
    } = settings;

    const root = cloneTemplate(tableTemplate);

    // Шаблоны перед строками таблицы
    [...before].reverse().forEach((name) => {
        root[name] = cloneTemplate(name);
        root.container.prepend(
            root[name].container
        );
    });

    // Шаблоны после строк таблицы
    after.forEach((name) => {
        root[name] = cloneTemplate(name);
        root.container.append(
            root[name].container
        );
    });

    // Сортировка, пагинация, очистка фильтров
    root.container.addEventListener(
        "submit",
        (event) => {
            event.preventDefault();
            onAction(event.submitter);
        }
    );

    // Select, radio, rowsPerPage
    root.container.addEventListener(
        "change",
        () => {
            onAction();
        }
    );

    // Reset all filters
    root.container.addEventListener(
        "reset",
        () => {
            // Ждем, пока браузер сбросит значения формы
            setTimeout(() => {
                onAction();
            });
        }
    );

    const render = (items) => {
        const nextRows = items.map((item) => {
            const row =
                cloneTemplate(rowTemplate);

            Object.keys(item).forEach((key) => {
                const element =
                    row.elements[key];

                if (element) {
                    element.textContent =
                        item[key];
                }
            });

            return row.container;
        });

        root.elements.rows.replaceChildren(
            ...nextRows
        );
    };

    return {
        ...root,
        render
    };
}