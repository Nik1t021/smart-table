import { getPages } from "../lib/utils.js";

export const initPagination = ({ pages, fromRow, toRow, totalRows }, createPage) => {
    return (data, state, action) => {

        const rowsPerPage = state.rowsPerPage;
        const pageCount = Math.ceil(data.length / rowsPerPage);
        let page = state.page;

        if (action) {
            switch (action.name) {
                case 'prev': page = Math.max(1, page - 1); break;
                case 'next': page = Math.min(pageCount, page + 1); break;
                case 'first': page = 1; break;
                case 'last': page = pageCount; break;
            }
        }

        const skip = (page - 1) * rowsPerPage;

        const visiblePages = getPages(page, pageCount, 5);

        const template = pages.firstElementChild.cloneNode(true);
        pages.firstElementChild.remove();

        pages.replaceChildren(...visiblePages.map(num => {
            const el = template.cloneNode(true);
            return createPage(el, num, num === page);
        }));

        fromRow.textContent = skip + 1;
        toRow.textContent = Math.min(page * rowsPerPage, data.length);
        totalRows.textContent = data.length;

        return data.slice(skip, skip + rowsPerPage);
    };
};