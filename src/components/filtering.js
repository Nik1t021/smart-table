import { defaultRules } from "../lib/utils.js";

export function initFiltering(elements, indexes) {
    return (data, state) => {

        return data.filter(row => {
            return Object.keys(state).every(key => {
                if (!state[key]) return true;
                return String(row[key])
                    .toLowerCase()
                    .includes(String(state[key]).toLowerCase());
            });
        });

    };
}