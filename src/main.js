import "./style.css";

import { data as sourceData } from "./data/dataset_1.js";
import { initData } from "./data.js";

import { initTable } from "./components/table.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initPagination } from "./components/pagination.js";
import { initSearching } from "./components/searching.js";

// ---------- API ----------

// sourceData сохраняем в вызове, как в последовательности задания.
// Серверная версия initData() его больше не использует.
const api = initData(sourceData);

// ---------- TABLE ----------

const sampleTable = initTable(
    {
        tableTemplate: "table",
        rowTemplate: "row",
        before: ["search", "header", "filter"],
        after: ["pagination"]
    },
    render
);

// ---------- STATE ----------

function collectState() {
    const formData = new FormData(sampleTable.container);

    return {
        ...Object.fromEntries(formData.entries()),

        rowsPerPage:
            Number.parseInt(
                formData.get("rowsPerPage"),
                10
            ) || 10,

        page:
            Number.parseInt(
                formData.get("page"),
                10
            ) || 1
    };
}

// ---------- MODULES ----------

const applySearching = initSearching("search");

const {
    applyFiltering,
    updateIndexes
} = initFiltering(sampleTable.filter.elements);

const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

const {
    applyPagination,
    updatePagination
} = initPagination(
    sampleTable.pagination.elements,

    (element, page, isCurrent) => {
        const input =
            element.querySelector("input");

        const label =
            element.querySelector("span");

        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;

        return element;
    }
);

// ---------- RENDER ----------

async function render(action) {
    const state = collectState();

    let query = {};

    // Шаг 4 — поиск
    query = applySearching(
        query,
        state,
        action
    );

    // Шаг 3 — фильтрация
    query = applyFiltering(
        query,
        state,
        action
    );

    // Шаг 5 — сортировка
    query = applySorting(
        query,
        state,
        action
    );

    // Шаг 2 — пагинация
    query = applyPagination(
        query,
        state,
        action
    );

    try {
        const {
            total,
            items
        } = await api.getRecords(query);

        updatePagination(total, query);

        sampleTable.render(items);
    } catch (error) {
        console.error(
            "Ошибка загрузки таблицы:",
            error
        );

        sampleTable.render([]);
    }
}

// ---------- INIT ----------

async function init() {
    const indexes = await api.getIndexes();

    updateIndexes(
        sampleTable.filter.elements,
        {
            searchBySeller: indexes.sellers
        }
    );

    document
        .querySelector("#app")
        .appendChild(sampleTable.container);
}

init()
    .then(() => render())
    .catch((error) => {
        console.error(
            "Ошибка инициализации:",
            error
        );
    });