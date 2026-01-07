import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { WeatherBackgroundService } from './services/weather-background.service'; // Import the service
import { Subject, takeUntil } from 'rxjs'; // Import Subject and takeUntil

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule, RouterOutlet, HeaderComponent],
  template: `
    <router-outlet></router-outlet>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class App implements OnInit, OnDestroy { // Implement OnInit and OnDestroy
  protected readonly title = signal('Mock Bar App');

  private destroy$ = new Subject<void>(); // Subject to handle unsubscription

  constructor(private weatherBackgroundService: WeatherBackgroundService) {}

  ngOnInit(): void {
    this.weatherBackgroundService.currentBackgroundUrl$
      .pipe(takeUntil(this.destroy$))
      .subscribe(url => {
        if (url) {
          document.body.style.setProperty('--dynamic-background-image', `url(${url})`);
        } else {
          // Fallback to a default image or no image if fetching fails
          document.body.style.setProperty('--dynamic-background-image', 'none');
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}