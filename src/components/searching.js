export function initSearching(fieldName) {

    return (data, state) => {

        const value = (state[fieldName] || '').toLowerCase();

        if (!value) return data;

        return data.filter(item =>
            Object.values(item).some(v =>
                String(v).toLowerCase().includes(value)
            )
        );
    };
}