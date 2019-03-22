import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as DataProcessor from './data_processor';
import * as Chart from './chart';


class DenominationFilter extends DataProcessor.Filter {
    process(input) {
        let date = new Date(input.Date),
            year = date.getFullYear(),
            month = date.getMonth(),
            multiplier = 10;

        // The first denomination of 2000s.
        if (year >= 2000) {
            multiplier *= 1000;
        }

        // The second denomination of 2016th.
        if (year > 2016 || (year === 2016 && month >= 6)) {
            multiplier *= 10000;
        }

        input.Cur_OfficialRate *= multiplier;
    }
}

// Process data input.
let data = require('../data'),
    processor = new DataProcessor.DataProcessor(),
    chart = new Chart.DateChart('chart', am4charts.XYChart);

// Compensate denomination difference.
processor.addFilter(new DenominationFilter());

// Assign processed data to the chart.
chart.assignData('course', processor.process(data), {
    dateX: 'Date',
    valueY: 'Cur_OfficialRate'
});

chart.addRangesX({
    date: new Date(2000, 1, 1),
    label: {
        text: '2000 denomination',
        inside: true
    }
});

chart.addRangesX({
    date: new Date(2016, 7, 1),
    label: {
        text: '2016 denomination',
        inside: true
    }
});
