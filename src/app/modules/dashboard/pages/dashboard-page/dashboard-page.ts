import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { StatsCard } from '../../../../shared/components/stats-card/stats-card';
import { DashboardService } from '../../infrastructure/services/dashboard.service';

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
export class DashboardPage implements OnInit {

  public operationsChartType: 'line' = 'line';

  public operationsChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: []
  };

  public operationsChartOptions: ChartOptions<'line'> = {};

  constructor(
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    const chart = this.dashboardService.getOperationsChart();

    this.operationsChartType = chart.type;
    this.operationsChartData = chart.data;
    this.operationsChartOptions = chart.options;
  }

}
