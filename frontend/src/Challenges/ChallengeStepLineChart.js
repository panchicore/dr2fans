import { Paper } from "@material-ui/core";
import React from "react";
import Chart from "react-apexcharts";
import _ from "lodash";

export default function ChallengeStepLineChart({ challenge }) {
  const ranks = challenge.charts.map((r) => r.y);
  const min = _.min(ranks);
  const max = _.max(ranks);
  let discreteMarkers = [];
  ranks.reduce((prev, curr, index) => {
    if (prev < curr) {
      discreteMarkers = [
        ...discreteMarkers,
        {
          seriesIndex: 0,
          dataPointIndex: index,
          fillColor: "red",
          strokeColor: "red",
          size: 1,
        },
      ];
    }
    return curr;
  });
  const state = {
    series: [
      {
        name: "Rank",
        type: "area",
        data: challenge.charts,
      },
    ],
    xaxis: {
      type: "category",
    },
    options: {
      chart: {
        toolbar: {
          show: true,
          tools: {
            download: false,
            selection: false,
            zoom: true,
            zoomin: false,
            zoomout: true,
            pan: false,
          },
        },
      },
      plotOptions: {
        area: {
          fillTo: "end",
        },
      },
      stroke: {
        show: true,
        curve: "smooth",
        colors: undefined,
        width: 2,
      },
      markers: {
        size: 1,
        fillColor: "#66ff00",
        strokeColor: "#66ff00",
        discrete: discreteMarkers,
      },
      grid: {
        show: false,
      },
      legend: {
        show: false,
      },
      xaxis: {
        labels: {
          show: false,
          maxHeight: 10,
        },
        tooltip: {
          enabled: false,
        },
      },
      yaxis: {
        min,
        max,
        reversed: true,
        logarithmic: false,
        labels: {
          show: true,
          align: "right",
          minWidth: 0,
          maxWidth: 160,
          style: {
            colors: ["#fff"],
            fontSize: "12px",
          },
        },
      },
      tooltip: {
        enabled: true,
        theme: "dark",
      },
    },
  };

  return (
    <Paper>
      <Chart
        options={state.options}
        series={state.series}
        type="line"
        height={350}
      />
    </Paper>
  );
}
