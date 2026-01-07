import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, timer } from 'rxjs';

interface WeatherData {
  weather: Array<{ main: string; description: string }>;
  main: { temp: number; humidity: number };
  name: string;
}

interface UnsplashImage {
  imageUrl: string;
  query: string;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherBackgroundService {
  private weatherProxyUrl = '/chanrobles-bar/mock/api/weather_proxy.php';
  private imageProxyUrl = '/chanrobles-bar/mock/api/image_proxy.php';
  private currentBackgroundUrlSubject = new BehaviorSubject<string | null>(null);
  public currentBackgroundUrl$ = this.currentBackgroundUrlSubject.asObservable();

  constructor(private http: HttpClient) {
    // Update background initially and then every 30 minutes
    timer(0, 30 * 60 * 1000).pipe(
      switchMap(() => this.updateBackground())
    ).subscribe();
  }

  private getWeatherCondition(): Observable<string> {
    return this.http.get<WeatherData>(this.weatherProxyUrl).pipe(
      map(data => {
        if (data && data.weather && data.weather.length > 0) {
          // Standardize weather conditions for better Unsplash queries
          const mainCondition = data.weather[0].main;
          switch (mainCondition) {
            case 'Clear': return 'sunny';
            case 'Clouds': return 'cloudy';
            case 'Rain':
            case 'Drizzle': return 'rainy';
            case 'Thunderstorm': return 'stormy';
            case 'Snow': return 'snowy';
            case 'Mist':
            case 'Smoke':
            case 'Haze':
            case 'Fog': return 'foggy';
            default: return 'weather'; // Fallback
          }
        }
        return 'weather'; // Default if no weather data
      }),
      catchError(error => {
        console.error('Error fetching weather condition:', error);
        return of('weather'); // Fallback on error
      })
    );
  }

  private getBackgroundImageUrl(query: string): Observable<string | null> {
    return this.http.get<UnsplashImage>(`${this.imageProxyUrl}?query=${query}`).pipe(
      map(data => data.imageUrl || null),
      catchError(error => {
        console.error('Error fetching background image:', error);
        return of(null); // Fallback on error
      })
    );
  }

  public updateBackground(): Observable<void> {
    return this.getWeatherCondition().pipe(
      switchMap(condition => this.getBackgroundImageUrl(condition)),
      map(imageUrl => {
        if (imageUrl) {
          this.currentBackgroundUrlSubject.next(imageUrl);
        } else {
          this.currentBackgroundUrlSubject.next(null); // Clear if no image found
        }
      }),
      catchError(() => {
        this.currentBackgroundUrlSubject.next(null); // Clear on any error
        return of(undefined); // Return an observable of void
      })
    );
  }
}
