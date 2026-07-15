import { getPages } from "../lib/utils.js";

export function initPagination(
    {
        pages,
        fromRow,
        toRow,
        totalRows
    },
    createPage
) {
    const firstPageElement =
        pages.firstElementChild;

    if (!firstPageElement) {
        throw new Error(
            "В шаблоне pagination отсутствует шаблон номера страницы"
        );
    }

    const pageTemplate =
        firstPageElement.cloneNode(true);

    firstPageElement.remove();

    // Количество страниц последнего ответа сервера
    let pageCount = 1;

    const applyPagination = (
        query,
        state,
        action
    ) => {
        const limit = state.rowsPerPage;
        let page = state.page;

        if (action) {
            switch (action.name) {
                case "prev":
                    page = Math.max(
                        1,
                        page - 1
                    );
                    break;

                case "next":
                    page = Math.min(
                        pageCount,
                        page + 1
                    );
                    break;

                case "first":
                    page = 1;
                    break;

                case "last":
                    page = pageCount;
                    break;
            }
        }

        return Object.assign({}, query, {
            limit,
            page
        });
    };

    const updatePagination = (
        total,
        { page, limit }
    ) => {
        pageCount = Math.max(
            1,
            Math.ceil(total / limit)
        );

        // Защита на случай, если текущая страница
        // стала больше доступного количества страниц
        const currentPage = Math.min(
            Math.max(1, page),
            pageCount
        );

        const skip =
            (currentPage - 1) * limit;

        const visiblePages = getPages(
            currentPage,
            pageCount,
            5
        );

        pages.replaceChildren(
            ...visiblePages.map(
                (pageNumber) => {
                    const element =
                        pageTemplate.cloneNode(
                            true
                        );

                    return createPage(
                        element,
                        pageNumber,
                        pageNumber ===
                            currentPage
                    );
                }
            )
        );

        fromRow.textContent =
            total > 0
                ? skip + 1
                : 0;

        toRow.textContent =
            Math.min(
                currentPage * limit,
                total
            );

        totalRows.textContent = total;
    };

    return {
        applyPagination,
        updatePagination
    };
}