const axios = require('axios');

class ExchangeAPI {

    constructor() {
        this.endpoint = 'http://www.nbrb.by/API/ExRates';
    }

    query(modelClass, options = {}, ...params) {
        /**
         * @type ExchangeModel
         */
        let instance = new modelClass(this),
            requestURI;

        let _this = this;

        instance.setParameters(params);
        requestURI = instance.getURI();

        return new Promise((resolve, reject) => {
            axios.get(_this.endpoint + requestURI, {
                params: options
            }).then((result) => {
                instance.handle(result.data);

                resolve(instance);
            }).catch(reject);
        });
    }

}


class ExchangeModel {

    get resource() {
        return '';
    }

    constructor(api) {
        this.api = api;
    }

    setParameters(parameters) {
        this.parameters = parameters;
    }

    getURI() {
        let paramsString = this.parameters.join('/');

        return this.resource + '/' + paramsString;
    }

    handle(responseData) {
        this.data = responseData;
    }

}


class Currencies extends ExchangeModel {

    get resource() {
        return '/Currencies';
    }

}

class Rates extends ExchangeModel {

    get resource() {
        return '/Rates';
    }

}

module.exports = {
    ExchangeAPI: ExchangeAPI,
    Currencies: Currencies,
    Rates: Rates
};
