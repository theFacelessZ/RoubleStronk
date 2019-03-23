const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

console.log('Requesting indicies data');

axios.get('http://www.belstat.gov.by/ofitsialnaya-statistika/realny-sector-ekonomiki/tseny/potrebitelskie-tseny/godovye-dannye/indeksy-tsen-i-tarifov-na-otdelnye-vidy-platnykh-uslug/').then((response) => {
    console.log('Processing...');

    let $ = cheerio.load(response.data),
        result = {};

    $('tbody > tr').each((i, element) => {
        let items = $(element).find('td');
        if (!items.length) {
            return;
        }

        let dataType = items.first().text().trim(),
            year = 2000,
            indicies = [];

        items.each((i, element) => {
            if (!i) {
                return;
            }

            indicies.push({
                Year: (year + (i - 1)) + '-1',
                Index: parseFloat($(element).text().trim().replace(',', '.'))
            })
        });

        result[dataType] = indicies;
    });

    fs.writeFileSync('./data_indicies.json', JSON.stringify(result));
});
