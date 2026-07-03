export function initSearching(searchField) {
    return (data, state) => {
        const query = state[searchField]?.toLowerCase() || '';

        if (!query) return data;

        return data.filter(item =>
            Object.values(item).some(value =>
                String(value).toLowerCase().includes(query)
            )
        );
    };
}