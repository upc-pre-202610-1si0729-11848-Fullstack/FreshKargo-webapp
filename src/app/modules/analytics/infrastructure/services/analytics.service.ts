import { Injectable } from '@angular/core';

import {
  AnalyticsCharts,
  AnalyticsKpi,
  ShipmentCategory,
  SpoilageTrendItem,
  SupplierPerformance,
  WarehousePerformance
} from '../../domain/model/analytics.entity';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  getCharts(): AnalyticsCharts {
    return {
      performanceChartType: 'bar',

      performanceChartData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        datasets: [
          {
            label: 'On-Time Delivery',
            data: [84, 87, 89, 91, 93, 94, 95, 96],
            backgroundColor: '#4056b4',
            borderRadius: 6,
            barPercentage: 0.75,
            categoryPercentage: 0.7
          },
          {
            label: 'Inventory Accuracy',
            data: [88, 91, 94, 96, 98, 99, 100, 101],
            backgroundColor: '#31429d',
            borderRadius: 6,
            barPercentage: 0.75,
            categoryPercentage: 0.7
          },
          {
            label: 'Cold Chain Compliance',
            data: [78, 82, 87, 89, 91, 94, 96, 98],
            backgroundColor: '#c7cdec',
            borderRadius: 6,
            barPercentage: 0.75,
            categoryPercentage: 0.7
          }
        ]
      },

      performanceChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#737373'
            }
          },
          y: {
            beginAtZero: true,
            max: 110,
            grid: {
              color: '#eeeeee'
            },
            ticks: {
              color: '#737373'
            }
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 24,
              color: '#737373'
            }
          }
        }
      },

      temperatureChartType: 'doughnut',

      temperatureChartData: {
        labels: [
          'Within Range',
          'Minor Deviation',
          'Critical Deviation'
        ],
        datasets: [
          {
            data: [1420, 28, 4],
            backgroundColor: [
              '#4056b4',
              '#f59e0b',
              '#ef4444'
            ],
            borderWidth: 0
          }
        ]
      },

      temperatureChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: {
            display: false
          }
        }
      }
    };
  }

  getKpis(): AnalyticsKpi[] {
    return [
      {
        title: 'On-Time Delivery Rate',
        value: '94.2%',
        change: '+2.1% vs last month',
        icon: 'local_shipping'
      },
      {
        title: 'Inventory Accuracy',
        value: '96.8%',
        change: '+1.4% vs last month',
        icon: 'inventory_2'
      },
      {
        title: 'Cold Chain Compliance',
        value: '97.8%',
        change: '+0.8% vs last month',
        icon: 'device_thermostat'
      },
      {
        title: 'Waste Reduction',
        value: '28.5%',
        change: '↓ vs last quarter',
        icon: 'trending_up'
      }
    ];
  }

  getSpoilageTrend(): SpoilageTrendItem[] {
    return [
      {
        month: 'January',
        units: '45 units (2.4%)',
        width: 48
      },
      {
        month: 'February',
        units: '38 units (2%)',
        width: 40
      },
      {
        month: 'March',
        units: '32 units (1.7%)',
        width: 34
      },
      {
        month: 'April',
        units: '28 units (1.5%)',
        width: 30
      }
    ];
  }

  getShipmentCategories(): ShipmentCategory[] {
    return [
      {
        count: 342,
        name: 'Fruits',
        percent: '34.1%',
        tone: 'dark'
      },
      {
        count: 298,
        name: 'Vegetables',
        percent: '29.7%',
        tone: 'dark'
      },
      {
        count: 156,
        name: 'Dairy',
        percent: '15.6%',
        tone: 'light'
      },
      {
        count: 124,
        name: 'Frozen',
        percent: '12.4%',
        tone: 'gray'
      },
      {
        count: 82,
        name: 'Other',
        percent: '8.2%',
        tone: 'gray'
      }
    ];
  }

  getWarehousePerformance(): WarehousePerformance[] {
    return [
      {
        warehouse: 'Lima Central',
        onTime: '96%',
        accuracy: '98%',
        compliance: '99%',
        waste: '2.1%',
        type: 'good'
      },
      {
        warehouse: 'North Hub',
        onTime: '91%',
        accuracy: '94%',
        compliance: '96%',
        waste: '3.8%',
        type: 'warning'
      },
      {
        warehouse: 'South Hub',
        onTime: '94%',
        accuracy: '97%',
        compliance: '98%',
        waste: '2.4%',
        type: 'good'
      },
      {
        warehouse: 'Callao Hub',
        onTime: '89%',
        accuracy: '92%',
        compliance: '94%',
        waste: '4.2%',
        type: 'danger'
      }
    ];
  }

  getSuppliers(): SupplierPerformance[] {
    return [
      {
        name: 'Fresh Farms Co.',
        rating: '4.8',
        onTime: '96%',
        quality: '98%'
      },
      {
        name: 'Green Valley Produce',
        rating: '4.5',
        onTime: '91%',
        quality: '94%'
      },
      {
        name: 'Coastal Distributors',
        rating: '4.7',
        onTime: '94%',
        quality: '96%'
      },
      {
        name: 'Mountain Fresh',
        rating: '4.3',
        onTime: '88%',
        quality: '91%'
      }
    ];
  }

}
