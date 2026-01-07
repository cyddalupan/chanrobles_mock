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
    <div class="app-background" [style.background-image]="backgroundStyle">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
    .app-background {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center center;
      background-repeat: no-repeat;
      transition: background-image 1s ease-in-out; /* Smooth transition for background change */
      z-index: -1; /* Ensure it stays behind other content */
    }
  `]
})
export class App implements OnInit, OnDestroy { // Implement OnInit and OnDestroy
  protected readonly title = signal('Mock Bar App');
  backgroundStyle: string = 'url(https://via.placeholder.com/1920x1080?text=Loading...)'; // Default/placeholder background

  private destroy$ = new Subject<void>(); // Subject to handle unsubscription

  constructor(private weatherBackgroundService: WeatherBackgroundService) {}

  ngOnInit(): void {
    this.weatherBackgroundService.currentBackgroundUrl$
      .pipe(takeUntil(this.destroy$))
      .subscribe(url => {
        if (url) {
          this.backgroundStyle = `url(${url})`;
        } else {
          // Fallback to a default image or no image if fetching fails
          this.backgroundStyle = 'none'; // Or a default local image
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}