const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

console.info('Requesting payment data');

axios.get('http://www.belstat.gov.by/ofitsialnaya-statistika/realny-sector-ekonomiki/stoimost-rabochey-sily/operativnye-dannye/nominalnaya-nachislennaya-srednyaya-zarabotnaya-plata-rabotnikov-respubliki-belarus-s-1991-po-2018-g/').then((response) => {

    console.info('Processing...');

    let $ = cheerio.load(response.data),
        data = $('.table td'),
        result = [];

    data.each((i, element) => {
        if (element.children.length > 1) {
            element = $('p', element).get(0);
        }

        if (typeof element === 'undefined') {
            return;
        }

        let dataRaw = element.children[0].data,
            month = i % 12,
            year = 1991 + Math.floor(i / 12);

        result.push({
            'Date': year + '-' + (month + 1),
            'Payment': parseFloat(dataRaw.replace(',', '.'))
        });

        console.log(result.length + '/' + data.length);
    });

    fs.writeFileSync('./data_payment.json', JSON.stringify(result));
});
