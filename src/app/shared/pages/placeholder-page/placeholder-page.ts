import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-placeholder-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './placeholder-page.html',
  styleUrl: './placeholder-page.css'
})
export class PlaceholderPage {

  sectionName = '';

  constructor(
    private route: ActivatedRoute
  ) {
    this.sectionName =
      this.route.snapshot.data['title'] || 'Section';
  }
}
