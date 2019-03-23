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

    applyFilters(item, dataset) {
        let result;

        this.filters.find(function (filter) {
            result = filter.process(item, dataset);

            return result === false;
        });

        return result;
    }

    process(data) {
        if (typeof data === 'object' && !Array.isArray(data)) {
            this.applyFilters(data);

            return data;
        }

        let result = [],
            iterator = new FilterIterator(data),
            iteratorResult = new FilterIterator(result),
            dataset = new FilterData(data, result, iterator, iteratorResult);


        while (!iterator.isComplete()) {
            let index = iterator.next(),
                item = Object.assign({}, data[index]),
                shouldProcess;

            shouldProcess = this.applyFilters(item, dataset);

            // Ignore the record if false flag has been returned.
            if (shouldProcess === false) {
                continue;
            }

            // Include the resulting item in the dataset.
            result.push(item);

            // Shift the result iterator.
            iteratorResult.next();
        }

        return result;
    }

}

class FilterIterator {

    get max() {
        if (Array.isArray(this.source[0])) {
            return this.source[0].length;
        }

        return this.source.length;
    }

    constructor(source) {
        this.source = source;

        this.pointer = 0;
        this.min = 0;
    }

    current() {
        return this.pointer;
    }

    next() {
        return this.pointer++;
    }

    previous() {
        return this.pointer--;
    }

    isComplete() {
        return this.pointer === this.max;
    }

}

class FilterData {

    /**
     * Filter data constructor.
     *
     * @param {*} source
     * @param {*} processed
     * @param {FilterIterator} sourceIterator
     * @param {FilterIterator} processedIterator
     */
    constructor(source, processed, sourceIterator, processedIterator) {
        this.source = source;
        this.processed = processed;

        this.sourceIterator = sourceIterator;
        this.processedIterator = processedIterator;
    }

}

class Filter {

    /**
     * Performs data filtering.
     *
     * @abstract
     * @param {Object} input
     * @param {FilterData} dataset
     * @return {*}
     */
    process(input, dataset) {
        throw 'Not implemented';
    }

}

module.exports = {
    DataProcessor: DataProcessor,
    Filter: Filter
};
