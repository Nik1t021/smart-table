const BASE_URL =
    "https://webinars.webdev.education-services.ru/sp7-api";

export function initData() {
    // Кеш справочников
    let sellers;
    let customers;

    // Кеш последнего запроса
    let lastResult;
    let lastQuery;

    // Приведение записей API к формату таблицы
    const mapRecords = (data) =>
        data.map((item) => ({
            id: item.receipt_id,
            date: item.date,
            seller: sellers[item.seller_id],
            customer: customers[item.customer_id],
            total: item.total_amount
        }));

    // Получение продавцов и покупателей
    const getIndexes = async () => {
        if (!sellers || !customers) {
            const [sellersResponse, customersResponse] =
                await Promise.all([
                    fetch(`${BASE_URL}/sellers`),
                    fetch(`${BASE_URL}/customers`)
                ]);

            if (!sellersResponse.ok) {
                throw new Error(
                    `Ошибка загрузки продавцов: ${sellersResponse.status}`
                );
            }

            if (!customersResponse.ok) {
                throw new Error(
                    `Ошибка загрузки покупателей: ${customersResponse.status}`
                );
            }

            [sellers, customers] = await Promise.all([
                sellersResponse.json(),
                customersResponse.json()
            ]);
        }

        return {
            sellers,
            customers
        };
    };

    // Получение записей с учетом query
    const getRecords = async (
        query = {},
        isUpdated = false
    ) => {
        const searchParams = new URLSearchParams(query);
        const nextQuery = searchParams.toString();

        if (
            lastQuery === nextQuery &&
            lastResult &&
            !isUpdated
        ) {
            return lastResult;
        }

        // Гарантируем наличие справочников перед mapRecords()
        await getIndexes();

        const response = await fetch(
            `${BASE_URL}/records?${nextQuery}`
        );

        if (!response.ok) {
            throw new Error(
                `Ошибка загрузки записей: ${response.status}`
            );
        }

        const records = await response.json();

        lastQuery = nextQuery;
        lastResult = {
            total: records.total,
            items: mapRecords(records.items)
        };

        return lastResult;
    };

    return {
        getIndexes,
        getRecords
    };
}