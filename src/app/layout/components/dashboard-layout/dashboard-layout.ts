import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';

import { Sidebar } from '../sidebar/sidebar';

import { Toolbar } from '../toolbar/toolbar';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    Sidebar,
    Toolbar
  ],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {}
