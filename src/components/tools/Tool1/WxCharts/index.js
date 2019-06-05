///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { toJS } from 'mobx';
import { inject, observer} from 'mobx-react';
import moment from 'moment';
//import { ResponsiveContainer, ComposedChart, AreaChart, LineChart, BarChart, Bar, Line, Area, XAxis, YAxis, Surface, Symbols, CartesianGrid, Tooltip, Legend, Brush } from 'recharts';
//import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, } from 'recharts';
//import Grid from '@material-ui/core/Grid';
import Highcharts from 'highcharts/highstock';
//import HC_exporting from 'highcharts/modules/exporting'
import HighchartsReact from 'highcharts-react-official';

//Components

// Styles
import '../../../../styles/WxCharts.css';

var HighchartsMore = require('highcharts-more');
HighchartsMore(Highcharts);

//require("highcharts/modules/exporting")(Highcharts);

var app;

@inject('store') @observer
class WxCharts extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
        this.chart;
        this.exportChart = () => {
          this.chart.exportChart();
        };
    }

    //componentDidMount() {
    //  this.chart = this.refs.chart.chart;
    //}

    render() {

        let varName = app.wxgraph_getVar
        let varLabel = app.wxgraph_getVarLabels[app.wxgraph_getVar]
        let station = (app.getPastData) ? app.getPastData['stn'][0] : ''
        let today = new Date()

        var odata = app.getPastData
        var cdata = app.getPresentData
        var pdata = app.getProjectionData


        let createPastSeries = (y,a) => {
            let i
            let oseries = [];
            if (a) {
                for (i=0; i<y.length; i++) {
                    oseries.push([y[i],a[i]])
                };
            }
            return oseries;
        }

        let createProjectionSeries = (y,a,syear) => {
            let i
            let series = [];
            if (a) {
                for (i=0; i<y.length; i++) {
                    if (y[i]>=syear) {series.push([y[i],a[i]])};
                };
            }
            return series;
        }

        let createProjectionRanges = (y,a,b,syear) => {
            let i;
            let ranges = [];
            if (a && b) {
                for (i=0; i<y.length; i++) {
                    if (y[i]>=syear) {ranges.push([y[i],a[i],b[i]])};
                };
            }
            return ranges;
        }

        if (!app.isPresentLoading && app.getPresentData['date']!=[]) {

        const options = {
                 plotOptions: {
                     line: {
                         animation: true,
                         //animation: !this.props.store.app.isProjectionLoading && this.props.store.app.getProjectionView,
                     },
                     series: {
                         type: 'line',
                         showCheckbox: false,
                         //pointStart: parseInt(pdata['rcp85']['mean'].years[0],10),
                         //pointInterval: 1,
                         pointStart: Date.UTC(1850,1,1),
                         //pointStart: pdata['rcp85']['mean'].years[0],
                         //pointInterval: 24*3600*1000,
                         animation: true,
                         lineWidth: 4,
                         marker: {
                             symbol: 'circle',
                             states: {
                                 hover: {
                                     enabled: false
                                 }
                             }
                         },
                         states: {
                             hover: {
                                 enabled: false,
                                 halo: {
                                     size: 0
                                 }
                             }
                         },
                         events: {
                             checkboxClick: function(event) {
                                 if (event.checked) {
                                     this.show();
                                     //this.legendSymbol.show();
                                 } else {
                                     this.hide();
                                     //this.legendSymbol.hide();
                                 }
                             }
                         }
                     }
                 },
          title: {
            text: varLabel+' @ '+station
          },
          exporting: {
            //showTable: true,
            chartOptions: {
              chart: {
                backgroundColor: '#ffffff'
              }
            },
          },
          credits: { text:"Powered by ACIS", href:"http://www.rcc-acis.org/", color:"#000000" },
          legend: { align: 'left', floating: true, verticalAlign: 'top', layout: 'vertical', x: 65, y: 50 },
          xAxis: { type: 'datetime', startOnTick: true, endOnTick: false, labels: { align: 'center', x: 0, y: 20 },
                     dateTimeLabelFormats:{ day:'%d %b', week:'%d %b', month:'%b<br/>%Y', year:'%Y' },
                 },
          series: [{
              name: app.wxgraph_getVarLabels[app.wxgraph_getVar],
              data: (app.getPastData['date']!=[]) ? createPastSeries(odata['date'],odata[varName]) : [],
              color: '#000000',
              step: false,
              lineWidth: 0,
              marker: { enabled: true },
              visible: app.chartViewIsPast,
              showInLegend: app.chartViewIsPast,
          },{
              name: app.wxgraph_getVarLabels[app.wxgraph_getVar],
              data: (app.getPastData['date']!=[]) ? createPastSeries(odata['date'].slice(-3),odata[varName].slice(-3)) : [],
              color: '#0000FF',
              step: false,
              lineWidth: 0,
              marker: { enabled: true },
              visible: app.chartViewIsPresent,
              showInLegend: app.chartViewIsPresent,
          },{
              name: 'Climate model average',
              //data: pdata['rcp85']['mean'][varName],
              data: (!app.isProjectionLoading) ? createProjectionSeries(pdata['rcp85']['mean']['years'],pdata['rcp85']['mean'][varName],today): [],
              type: "line",
              zIndex: 24,
              lineWidth: 1,
              color: "#000000",
              shadow: false,
              marker: { enabled: false, fillColor: "#00dd00", lineWidth: 2, lineColor: "#00dd00", radius:2, symbol:"circle" },
              visible: app.chartViewIsFuture,
              showInLegend: app.chartViewIsFuture,
          },{
              name: 'Climate model range',
              data: (!app.isProjectionLoading) ? createProjectionRanges(toJS(pdata)['rcp85']['min']['years'],toJS(pdata)['rcp85']['min'][varName],toJS(pdata)['rcp85']['max'][varName],today): [],
              marker : {symbol: 'square', radius: 12 },
              type: "arearange",
              linkedTo: ':previous',
              lineWidth:0,
              color: 'rgba(0,0,0,0.4)',
              fillColor: 'rgba(0,0,0,0.4)',
              fillOpacity: 0.1,
              zIndex: 0,
              visible: app.chartViewIsFuture,
              showInLegend: app.chartViewIsFuture,
          }]
        };

        return (
          <div id="wx-chart">
            <HighchartsReact
              highcharts={Highcharts}
              constructorType={"chart"}
              options={options}
            />
          </div>
        );

        } else {

        return(false);

        };

    }
}

export default WxCharts;

