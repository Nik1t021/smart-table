import { cloneTemplate } from "../lib/utils.js";

export function initTable(settings, onAction) {
    const { tableTemplate, rowTemplate, before = [], after = [] } = settings;

    const root = cloneTemplate(tableTemplate);

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

    // BEFORE templates
    before.forEach(name => {
        root[name] = cloneTemplate(name);
        root.container.prepend(root[name].container);
    });

    // AFTER templates
    after.forEach(name => {
        root[name] = cloneTemplate(name);
        root.container.append(root[name].container);
    });

    // EVENTS
    root.container.addEventListener('change', () => onAction());
    root.container.addEventListener('reset', () => {
        setTimeout(() => onAction(), 0);
    });

    root.container.addEventListener('submit', (e) => {
        e.preventDefault();
        onAction(e.submitter);
    });

    return { ...root, render };
}