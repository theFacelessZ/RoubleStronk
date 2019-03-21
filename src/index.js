import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as themes from '@amcharts/amcharts4/themes/dataviz.js';


let chart = am4core.create('chart', am4charts.XYChart);
chart.data = require('../data');

chart.data.forEach(function (item) {
    let date = new Date(item.Date),
        year = date.getFullYear(),
        month = date.getMonth(),
        m = 1;

    // The first denomination of 2000s.
    if (year >= 2000) {
        m = 1000;
    }

    // The second denomination of 2016th.
    if (year > 2016 || (year === 2016 && month >= 6)) {
        m *= 10000;
    }

    item.Cur_OfficialRate *= m;
});

let dateAxis = chart.xAxes.push(
    new am4charts.DateAxis()
);

chart.yAxes.push(
    new am4charts.ValueAxis()
);

let series = chart.series.push(
    new am4charts.LineSeries()
);


series.dataFields.valueY = 'Cur_OfficialRate';
series.dataFields.dateX = 'Date';
series.strokeWidth = 3;
series.minBulletDistance = 5;
series.tooltipText = '{valueY}';

chart.scrollbarX = new am4charts.XYChartScrollbar();
chart.scrollbarX.series.push(series);

chart.cursor = new am4charts.XYCursor();
chart.cursor.xAxis = dateAxis;
chart.cursor.snapToSeries = series;

// Denomination markers.
let denomination_a = dateAxis.axisRanges.create();
denomination_a.date = new Date(2000, 1, 1);
denomination_a.label.text = '2000 denimination';
denomination_a.label.inside = true;
denomination_a.grid.strokeWidth = 5;

let denomination_b = dateAxis.axisRanges.create();
denomination_b.date = new Date(2016, 7, 1);
denomination_b.label.text = '2016 denomination';
denomination_b.label.inside = true;
denomination_b.grid.strokeWidth = 5;

