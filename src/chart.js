import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';


export class DateChart {

    constructor(element, type) {
        this.chart = am4core.create(element, type);

        this.xAxis = new am4charts.DateAxis();
        this.yAxis = new am4charts.ValueAxis();

        this.series = {};

        this.chart.xAxes.push(this.xAxis);
        this.chart.yAxes.push(this.yAxis);

        // this.chart.scrollbarX = new am4charts.XYChartScrollbar();
        // this.chart.scrollbarX.series.push(this.series);

        this.chart.cursor = new am4charts.XYCursor();
        this.chart.cursor.xAxis = this.xAxis;
    }

    applyOptions(options, target = this) {
        for (var index in options) {
            if (!options.hasOwnProperty(index)) {
                continue;
            }

            if (Object.getPrototypeOf(options[index]) === Object.prototype) {
                target[index] = this.applyOptions(options[index], target[index]);
            }
            else {
                target[index] = options[index];
            }
        }

        return target;
    }

    addRangesX(options) {
        let range = this.xAxis.axisRanges.create();

        range.grid.strokeWidth = 5;

        // Apply options to the range.
        return this.applyOptions(options, range);
    }

    initSeries(seriesId) {
        let series = this.series[seriesId] = new am4charts.LineSeries(),
            seriesList = Object.values(this.series);

        series.strokeWidth = 5;
        series.tooltipText = seriesId + ' {valueY}';

        this.chart.series.push(series);
        this.chart.cursor.snapToSeries = seriesList[0];

        return series;
    }

    assignData(seriesId, data, fields) {
        let series = this.series[seriesId] || this.initSeries(seriesId);

        series.data = data;
        series.dataFields = fields;

        return this;
    }

    addXAxis(axisType) {
        return this.chart.xAxes.push(axisType);
    }

    addYAxis(axisType) {
        return this.chart.yAxes.push(axisType);
    }

}
