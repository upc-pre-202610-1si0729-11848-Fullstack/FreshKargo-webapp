import { Injectable } from '@angular/core';
import { DashboardOperationsChart } from '../../domain/model/dashboard-chart.entity';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  getOperationsChart(): DashboardOperationsChart {
    return {
      type: 'line',

      data: {
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
      },

      options: {
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
      }
    };
  }

}
