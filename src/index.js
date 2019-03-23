import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as DataProcessor from './data_processor';
import * as Chart from './chart';


class YearFilter extends DataProcessor.Filter {
    constructor(field, year, month = 1) {
        super();

        this.field = field;
        this.year = year;
        this.month = month;
    }

    process(input, dataset) {
        let date = input[this.field];

        if (!(date instanceof Date)) {
            date = new Date(date);
        }

        return date.getFullYear() > this.year ||
            (date.getFullYear() === this.year && date.getMonth() >= this.month - 1);
    }
}

class DenominationFilter extends DataProcessor.Filter {

    constructor(field, monthShift = 0) {
        super();

        this.field = field;
        this.monthShift = monthShift;
    }

    process(input, dataset) {
        let date = new Date(input.Date),
            year = date.getFullYear(),
            month = date.getMonth(),
            multiplier = 1;

        // The first denomination of 2000s.
        if (year >= 2000) {
            multiplier *= 1000;
        }

        // The second denomination of 2016th.
        if (year > 2016 || (year === 2016 && month >= 6 + this.monthShift)) {
            multiplier *= 10000;
        }

        input[this.field] *= multiplier;
    }
}

class DifferenceFilter extends DataProcessor.Filter {

    constructor(field, resultField = 'Diff') {
        super();

        this.field = field;
        this.resultField = resultField;
    }

    process(input, dataset) {
        if (!dataset.processedIterator.current()) {
            this.startValue = input[this.field];
        }

        input[this.resultField] = Math.log(input[this.field]) / Math.log(this.startValue);
    }

}

// Process data input.
let data = require('../data'),
    dataPayment = require('../data_payment'),
    processor = new DataProcessor.DataProcessor(),
    processorPayment = new DataProcessor.DataProcessor(),
    chart_diff = new Chart.DateChart('chart_diff', am4charts.XYChart),
    chart_course = new Chart.DateChart('chart_course', am4charts.XYChart),
    chart_payment = new Chart.DateChart('chart_payment', am4charts.XYChart),
    chart_payment_d = new Chart.DateChart('chart_payment_d', am4charts.XYChart),
    chart_diff_accum = new Chart.DateChart('chart_diff_accum', am4charts.XYChart);

// Compensate denomination difference.
processor.addFilter(new DenominationFilter('Cur_OfficialRate'));
processorPayment.addFilter(new DenominationFilter('Payment', -6));
processorPayment.addFilter(new YearFilter('Date', 1995, 6));

processor.addFilter(new DifferenceFilter('Cur_OfficialRate'));
processorPayment.addFilter(new DifferenceFilter('Payment'));

// Process the data.
data = processor.process(data);
dataPayment = processorPayment.process(dataPayment);

let dollarMonth = processor.process(require('../data_month'));
for (let i = 0; i < dataPayment.length; i++) {
    dataPayment[i]['DollarValue'] = dataPayment[i]['Payment'] / dollarMonth[i]['Cur_OfficialRate'];
}

for (let i = 0; i < dollarMonth.length; i++) {
    if (typeof dataPayment[i] === 'undefined') {
        break;
    }

    dollarMonth[i]['Accum'] = dollarMonth[i]['Diff'] - dataPayment[i]['Diff'];
}

// Assign processed data to the chart.
chart_diff.assignData('course', data, {
    dateX: 'Date',
    valueY: 'Diff'
});

chart_diff.assignData('payment', dataPayment, {
    dateX: 'Date',
    valueY: 'Diff'
});

chart_course.assignData('course', data, {
    dateX: 'Date',
    valueY: 'Cur_OfficialRate'
});

chart_payment.assignData('payment', dataPayment, {
    dateX: 'Date',
    valueY: 'Payment'
});

chart_payment_d.assignData('payment_d', dataPayment, {
    dateX: 'Date',
    valueY: 'DollarValue'
});

chart_diff_accum.assignData('diff', dollarMonth, {
    dateX: 'Date',
    valueY: 'Accum'
});

[chart_diff, chart_payment, chart_course, chart_payment_d, chart_diff_accum].forEach((chart) => {
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
});

