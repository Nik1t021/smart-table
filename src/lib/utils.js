export function cloneTemplate(id) {
    const template =
        document.getElementById(id);

    if (!template) {
        throw new Error(
            `Шаблон #${id} не найден`
        );
    }

    const node =
        template.content.cloneNode(true);

    const container =
        node.firstElementChild;

    if (!container) {
        throw new Error(
            `Шаблон #${id} не содержит корневого элемента`
        );
    }

    return {
        container,
        elements: getElements(container)
    };
}

function getElements(root) {
    const elements = {};

    root
        .querySelectorAll("[data-name]")
        .forEach((element) => {
            elements[
                element.dataset.name
            ] = element;
        });

    return elements;
}

export function makeIndex(
    data,
    key,
    mapFn
) {
    return data.reduce(
        (result, item) => {
            result[item[key]] =
                mapFn(item);

            return result;
        },
        {}
    );
}

export function processFormData(
    formData
) {
    return Object.fromEntries(
        formData.entries()
    );
}

export function getPages(
    current,
    total,
    delta
) {
    const start = Math.max(
        1,
        current - delta
    );

    const end = Math.min(
        total,
        current + delta
    );

    return Array.from(
        {
            length:
                Math.max(
                    0,
                    end - start + 1
                )
        },
        (_, index) =>
            start + index
    );
}