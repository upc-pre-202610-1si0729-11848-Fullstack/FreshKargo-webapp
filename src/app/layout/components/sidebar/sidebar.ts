import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { TranslatePipe } from '../../../shared/i18n/translate.pipe';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  isCollapsed = false;
  goToLanding(): void {
    window.open('https://freshkargo-website.web.app', '_self');
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
