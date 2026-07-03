import './fonts/ys-display/fonts.css';
import './style.css';

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";
import { initPagination } from "./components/pagination.js";

const { data, ...indexes } = initData(sourceData);

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['header', 'search', 'filter'],
    after: ['pagination']
}, render);

const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

const applyFiltering = initFiltering(sampleTable.filter.elements, indexes);

const applySearching = initSearching('search');

const applyPagination = initPagination(
    sampleTable.pagination.elements,
    (el, page, isCurrent) => {
        el.querySelector('input').value = page;
        el.querySelector('input').checked = isCurrent;
        el.querySelector('span').textContent = page;
        return el;
    }
);

function collectState() {
    const state = processFormData(new FormData(sampleTable.container));

    const rowsPerPage = parseInt(state.rowsPerPage);
    const page = parseInt(state.page ?? 1);

    return {
        ...state,
        rowsPerPage,
        page
    };
}

function render(action) {
    let state = collectState();
    let result = [...data];

    result = applySearching(result, state);
    result = applyFiltering(result, state, action);
    result = applySorting(result, state, action);
    result = applyPagination(result, state, action);

    sampleTable.render(result);
}

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

render();