class DataProcessor {

    constructor() {
        /**
         * @type {Array<Filter>}
         */
        this.filters = [];
    }

    addFilter(filter) {
        if (!(filter instanceof Filter)) {
            throw new Error('Unknown filter.');
        }

        this.filters.push(filter);
    }

    applyFilters(data) {
        this.filters.forEach(function (filter) {
            filter.process(data);
        });

        return this;
    }

    process(data) {
        if (typeof data === 'object' && !Array.isArray(data)) {
            this.applyFilters(data);

            return data;
        }

        for (var index in data) {
            if (!data.hasOwnProperty(index)) {
                continue;
            }

            this.applyFilters(data[index]);
        }

        return data;
    }

}

class Filter {

    /**
     * Performs data filtering.
     *
     * @abstract
     * @param input
     * @return {*}
     */
    process(input) {
        throw 'Not implemented';
    }

}

module.exports = {
    DataProcessor: DataProcessor,
    Filter: Filter
};
