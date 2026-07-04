export function cloneTemplate(id) {
    const template = document.getElementById(id);
    const node = template.content.cloneNode(true);

    return {
        container: node.firstElementChild,
        elements: getElements(node.firstElementChild)
    };
}

function getElements(root) {
    const elements = {};

    root.querySelectorAll('[data-name]').forEach(el => {
        elements[el.dataset.name] = el;
    });

    return elements;
}

export function makeIndex(data, key, mapFn) {
    return data.reduce((acc, item) => {
        acc[item[key]] = mapFn(item);
        return acc;
    }, {});
}

export function processFormData(formData) {
    return Object.fromEntries(formData.entries());
}

export function getPages(current, total, delta) {
    const start = Math.max(1, current - delta);
    const end = Math.min(total, current + delta);

    return Array.from(
        { length: end - start + 1 },
        (_, i) => start + i
    );
}

export const sortMap = {
    none: 'asc',
    asc: 'desc',
    desc: 'none'
};

export const defaultRules = [];


export function createComparison(rules) {
    return (row, state) => {
        return rules.every(rule => rule(row, state));
    };
}