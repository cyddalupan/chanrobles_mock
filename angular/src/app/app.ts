import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { MatButtonModule } from '@angular/material/button'; // Import MatButtonModule
import { MatIconModule } from '@angular/material/icon';     // Import MatIconModule
import { MatCardModule } from '@angular/material/card'; // Import MatCardModule
import { RouterOutlet } from '@angular/router'; // Import RouterOutlet
import { HeaderComponent } from './header/header.component'; // Import HeaderComponent

@Component({
  selector: 'app-root',
  standalone: true, // Mark as standalone
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule, RouterOutlet, HeaderComponent], // Add RouterOutlet and HeaderComponent here
  template: `
    <div>
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
export class App {
  protected readonly title = signal('Mock Bar App');
}