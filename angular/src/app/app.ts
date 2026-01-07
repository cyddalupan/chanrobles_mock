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
    <div class="liquid-glass-notification">
      <div class="notification-content">
        <img src="https://topbarassist.com/chanrobles-bar/mock/img/civillaw.jpg" alt="Notification Image" class="notification-image">
        <div class="notification-text">
          <h3>New Feature Alert!</h3>
          <p>Explore our new interactive study guides and master civil law concepts with ease.</p>
        </div>
      </div>
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
    /* Existing styles for liquid-glass-notification */
    :host .liquid-glass-notification {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      width: 90%;
      max-width: 400px;
      background-color: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(20px) saturate(200%);
      -webkit-backdrop-filter: blur(20px) saturate(200%);
      border-radius: 13px;
      border: 1px solid rgba(255, 255, 255, 0.8);
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
      padding: 12px 18px;
      display: flex;
      align-items: center;
      z-index: 1000;
      color: white;
      font-family: 'SF Pro Text', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
    }

    :host .notification-content {
      display: flex;
      align-items: center;
      width: 100%;
    }

    :host .notification-image {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      object-fit: cover;
      margin-right: 12px;
      flex-shrink: 0;
    }

    :host .notification-text h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: white;
      text-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    }

    :host .notification-text p {
      margin: 5px 0 0;
      font-size: 13px;
      line-height: 1.3;
      color: rgba(255, 255, 255, 0.8);
      text-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    }

    @media (max-width: 600px) {
      :host .liquid-glass-notification {
        width: 95%;
        padding: 12px;
        bottom: 15px;
      }
      :host .notification-image {
        width: 40px;
        height: 40px;
        margin-right: 10px;
      }
      :host .notification-text h3 {
        font-size: 14px;
      }
      :host .notification-text p {
        font-size: 12px;
      }
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