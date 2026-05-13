import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ChartConfiguration,
  ChartOptions,
} from 'chart.js';

import {
  BaseChartDirective
} from 'ng2-charts';

@Component({
  selector: 'app-chart-card',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective
  ],
  templateUrl: './chart-card.html',
  styleUrl: './chart-card.css',
})
export class ChartCard {

  lineChartType: 'line' = 'line';

  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun'
    ],

    datasets: [
      {
        data: [12, 19, 14, 22, 28, 35],

        label: 'Revenue',

        fill: true,

        tension: 0.4,
      },
    ],
  };

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },
    },
  };

}
