import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { Subscription } from 'rxjs';

import { LanguageService } from './language.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  private subscription: Subscription;

  constructor(
    private languageService: LanguageService,
    private cdr: ChangeDetectorRef,
  ) {
    this.subscription = this.languageService.language$.subscribe(() => {
      this.cdr.markForCheck();
    });
  }

  transform(key: string): string {
    return this.languageService.translate(key);
  }
}
