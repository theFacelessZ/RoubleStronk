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

        filter.processor = this;
    }

    applyFilters(data, index, dataset) {
        let result;

        this.filters.find(function (filter) {
            result = filter.process(data, index, dataset);

            return result === false;
        });

        return result;
    }

    process(data) {
        if (typeof data === 'object' && !Array.isArray(data)) {
            this.applyFilters(data);

            return data;
        }

        let result = [];

        this.data = data;

        for (var index in data) {
            if (!data.hasOwnProperty(index)) {
                continue;
            }

            let item = Object.assign({}, data[index]),
                shouldProcess = this.applyFilters(item, result.length, result);

            // Ignore the record if false flag has been returned.
            if (shouldProcess === false) {
                continue;
            }

            result.push(item);
        }

        return result;
    }

}

class Filter {

    /**
     * Performs data filtering.
     *
     * @abstract
     * @param input
     * @param index
     * @param dataset
     * @return {*}
     */
    process(input, index, dataset) {
        throw 'Not implemented';
    }

}

module.exports = {
    DataProcessor: DataProcessor,
    Filter: Filter
};
