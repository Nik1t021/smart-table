import './style.css';

import { data as sourceData } from './data/dataset_1.js';
import { initData } from './data.js';

import { initTable } from './components/table.js';
import { initSorting } from './components/sorting.js';
import { initFiltering } from './components/filtering.js';
import { initPagination } from './components/pagination.js';
import { initSearching } from './components/searching.js';

const { data, ...indexes } = initData(sourceData);

const sampleTable = initTable(
    {
        tableTemplate: 'table',
        rowTemplate: 'row',
        before: ['search', 'header', 'filter'],
        after: ['pagination']
    },
    render
);

// ---------- STATE ----------
function collectState() {
    const formData = new FormData(sampleTable.container);

    return {
        ...Object.fromEntries(formData.entries()),
        rowsPerPage: parseInt(formData.get('rowsPerPage')) || 10,
        page: parseInt(formData.get('page')) || 1
    };
}

// ---------- RENDER ----------
function render(action) {
    let state = collectState();
    let result = [...data];

    result = applySearching(result, state, action);
    result = applyFiltering(result, state, action);
    result = applySorting(result, state, action);
    result = applyPagination(result, state, action);

    sampleTable.render(result);
}

// ---------- MODULES ----------
const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

const applyFiltering = initFiltering(
    sampleTable.filter.elements,
    {
        searchBySeller: indexes.sellers
    }
);

const applyPagination = initPagination(
    sampleTable.pagination.elements,
    (el, page, isCurrent) => {
        el.querySelector('input').value = page;
        el.querySelector('span').textContent = page;
        el.querySelector('input').checked = isCurrent;
        return el;
    }
);

const applySearching = initSearching('search');

// ---------- INIT ----------
document.querySelector('#app').appendChild(sampleTable.container);

render();
