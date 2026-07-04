import { cloneTemplate } from "../lib/utils.js";

export function initTable(settings, onAction) {
    const { tableTemplate, rowTemplate, before = [], after = [] } = settings;

    const root = cloneTemplate(tableTemplate);

    // attach templates before
    before.reverse().forEach(name => {
        root[name] = cloneTemplate(name);
        root.container.prepend(root[name].container);
    });

    // attach templates after
    after.forEach(name => {
        root[name] = cloneTemplate(name);
        root.container.append(root[name].container);
    });

    root.container.addEventListener('submit', e => {
        e.preventDefault();
        onAction(e.submitter);
    });

    root.container.addEventListener('change', () => onAction());
    root.container.addEventListener('reset', () => {
        setTimeout(() => onAction());
    });

    const render = (data) => {
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate);

            Object.keys(item).forEach(key => {
                if (row.elements[key]) {
                    row.elements[key].textContent = item[key];
                }
            });

            return row.container;
        });

        root.elements.rows.replaceChildren(...nextRows);
    };

    return { ...root, render };
}