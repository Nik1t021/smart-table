export function initSearching(searchField) {
    return (query, state) => {
        const value = String(
            state[searchField] || ""
        ).trim();

        return value
            ? Object.assign({}, query, {
                search: value
            })
            : query;
    };
}