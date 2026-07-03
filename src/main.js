import './fonts/ys-display/fonts.css';
import './style.css';

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";

// ---------------- DATA ----------------
const { data, ...indexes } = initData(sourceData);

// ---------------- STATE ----------------
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));

    return {
        ...state,
        rowsPerPage: parseInt(state.rowsPerPage ?? 10),
        page: parseInt(state.page ?? 1) || 1
    };
}

// ---------------- PIPELINE ----------------
function render(action) {
    const state = collectState();
    let result = [...data];

    result = applySearching(result, state, action);
    result = applyFiltering(result, state, action);
    result = applySorting(result, state, action);
    result = applyPagination(result, state, action);

    sampleTable.render(result);
}

// ---------------- TABLE ----------------
const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, render);

// ---------------- MODULES ----------------

// SEARCH
const applySearching = initSearching('search');

// SORT
const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

// FILTER
const applyFiltering = initFiltering(
    sampleTable.filter.elements,
    {
        searchBySeller: indexes.sellers
    }
);

// PAGINATION
const applyPagination = initPagination(
    sampleTable.pagination.elements,
    (el, page, isCurrent) => {
        const input = el.querySelector('input');
        const label = el.querySelector('span');

        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;

        return el;
    }
);

// ---------------- MOUNT ----------------
const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

// initial render
render();
