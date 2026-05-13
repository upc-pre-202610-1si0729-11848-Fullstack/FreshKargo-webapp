import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { StatsCard } from '../../../../shared/components/stats-card/stats-card';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective,
    StatsCard
  ],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css'
})
export class DashboardPage {

  public operationsChartType: 'line' = 'line';

  public operationsChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [12, 19, 14, 22, 28, 35],
        label: 'Shipment Growth',
        fill: true,
        tension: 0.4,
        borderColor: '#3f51b5',
        backgroundColor: 'rgba(63, 81, 181, 0.18)',
        pointBackgroundColor: '#3f51b5',
        pointBorderColor: '#3f51b5',
        pointRadius: 5,
        pointHoverRadius: 6,
        borderWidth: 4
      }
    ]
  };

  public operationsChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false
      }
    },

    scales: {
      x: {
        grid: {
          color: 'rgba(148, 163, 184, 0.18)'
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 13
          }
        }
      },

      y: {
        min: 10,
        max: 35,
        ticks: {
          stepSize: 5,
          color: '#64748b',
          font: {
            size: 13
          }
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.18)'
        }
      }
    }
  };

}
