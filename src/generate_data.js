const fs = require('fs');
const moment = require('moment');
const Exchange = require('./nbrb_exchange_api');

let api = new Exchange.ExchangeAPI(),
    result = [],
    date = moment('1995-6');

async function fetchRates (date, resolution = 'year') {
    let rates, dateString;

    do {
        dateString = date.format();

        try {
            rates = await api.query(Exchange.Rates, {
                onDate: dateString,
                Periodicity: 1
            }, 145);
        } catch (e) {
            break;
        }

        result.push(rates.data);

        date.add(1, resolution);
    } while (rates && rates instanceof Exchange.Rates);
}

fetchRates(date, 'month').then(() => {
    fs.writeFile('./data.json', JSON.stringify(result));
});
