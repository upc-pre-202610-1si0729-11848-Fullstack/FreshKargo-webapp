import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { LanguageService } from '../../../shared/i18n/language.service';
import { TranslatePipe } from '../../../shared/i18n/translate.pipe';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, TranslatePipe],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.css',
})
export class Toolbar {
  constructor(private languageService: LanguageService) {}

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }
}
