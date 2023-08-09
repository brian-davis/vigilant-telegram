// https://stimulus.hotwired.dev/handbook/working-with-external-resources#refreshing-automatically-with-a-timer
import { Controller } from "@hotwired/stimulus";
import ApexCharts from "apexcharts";

// Connects to data-controller="temperature-data"
export default class extends Controller {
  static targets = ["chart"];
  static values = { url: String, refreshInterval: Number };

  connect() {
    console.log("temperatures controller connect()");
    this.fetchData(); // initial load
    if (this.hasRefreshIntervalValue) {
      this.startRefreshing();
    }
  }

  disconnect() {
    console.log("temperatures controller disconnect()");
    this.stopRefreshing();
  }

  fetchData() {
    fetch(this.urlValue)
      .then((data) => {
        return data.json();
      })
      .then((dataArray) => {
        this.renderChart(dataArray);
      });
  }

  renderChart(dataArray) {
    // assume bar :name items (keys) don't change, only :temperature values
    const names = dataArray.map((e) => {
      return e.name;
    });

    // assume :temperature data (values) will match existing bars
    const temperatures = dataArray.map((e) => {
      return +e.temperature.toFixed(2);
    });

    if (this._renderedChart) {
      // update
      this._renderedChart.updateSeries([{ data: temperatures }]);
    } else {
      // create
      const element = this.chartTarget;
      element.innerHTML = ""; // clear "Loading..." text

      const colors = [
        "#008FFB",
        "#00E396",
        "#FEB019",
        "#FF4560",
        "#775DD0",
        "#546E7A",
        "#26a69a",
        "#D10CE8",
      ];

      // https://apexcharts.com/javascript-chart-demos/column-charts/distributed/
      const options = {
        series: [{ data: temperatures }],
        chart: {
          animations: {
            // enabled: false
          },
          height: 350,
          type: "bar",
          events: {
            click: function (chart, w, e) {
              // console.log(chart, w, e)
            },
          },
        },
        colors: colors,
        plotOptions: {
          bar: {
            columnWidth: "45%",
            distributed: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
        },
        xaxis: {
          categories: names,
          labels: {
            style: {
              colors: colors,
              fontSize: "12px",
            },
          },
        },
        title: {
          text: "Sensor Temperatures",
          align: "left",
          margin: 10,
          offsetX: 0,
          offsetY: 0,
          floating: false,
          style: {
            fontSize: "14px",
            fontWeight: "bold",
            fontFamily: "sans-serif",
            color: "#263238",
          },
        },
      };

      // memoize
      this._renderedChart = new ApexCharts(element, options);
      this._renderedChart.render();
    }
  }

  startRefreshing() {
    console.log("temperatures controller startRefreshing()");
    this.refreshTimer = setInterval(() => {
      this.fetchData();
    }, this.refreshIntervalValue);
  }

  stopRefreshing() {
    console.log("temperatures controller stopRefreshing()");
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
  }
}
