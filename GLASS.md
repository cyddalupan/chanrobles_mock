# Liquid Glass Notification Styles

This document contains the styles for the "liquid glass" notification component, preserving the design for future use. Two versions are provided: a floating (fixed position) version and an inline (non-floating) version.

## HTML Structure

The HTML structure is the same for both versions.

```html
<div class="liquid-glass-notification">
  <div class="notification-content">
    <img src="https://topbarassist.com/chanrobles-bar/mock/img/civillaw.jpg" alt="Notification Image" class="notification-image">
    <div class="notification-text">
      <h3>New Feature Alert!</h3>
      <p>Explore our new interactive study guides and master civil law concepts with ease.</p>
    </div>
  </div>
</div>
```

---

## Liquid Glass Search Bar Styles

This section documents the liquid glass styling applied to the search bar in `home.component.css`.

```css
/* --- Search Bar Styling (Liquid Glass) --- */

/* Main container for centering the liquid glass search bar */
.search-bar-container {
  display: flex;
  justify-content: center;
  padding: 20px 10px;
  margin-bottom: 20px;
}

/* Liquid Glass Search Bar Styles - Inline Version */
.search-liquid-glass {
  width: 100%;
  max-width: 600px;
  background-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px) saturate(200%);
  -webkit-backdrop-filter: blur(20px) saturate(200%);
  border-radius: 13px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  padding: 0 15px; /* Adjust padding as needed for the input */
  display: flex;
  align-items: center; /* Vertically center content */
  font-family: 'SF Pro Text', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
  min-height: 56px; /* Match typical mat-form-field height */
}

/* Overrides for mat-form-field to blend with the liquid glass container */
:host ::ng-deep .search-liquid-glass .mat-mdc-form-field {
  width: 100%;
  padding-top: 17px;
}
:host ::ng-deep .search-liquid-glass .search-input .mat-form-field-wrapper {
  padding: 0;
}
:host ::ng-deep .search-liquid-glass .search-input .mat-form-field-infix {
  border-top: none;
  padding: 0; /* Let the parent .search-liquid-glass handle vertical padding */
}
:host ::ng-deep .search-liquid-glass .search-input .mat-form-field-underline,
:host ::ng-deep .search-liquid-glass .search-input .mat-form-field-outline {
  display: none !important;
}

/* Text, placeholder and icon colors */
:host ::ng-deep .search-liquid-glass .search-input .mat-input-element,
:host ::ng-deep .search-liquid-glass .search-input .mat-form-field-label {
  color: white !important;
}
:host ::ng-deep .search-liquid-glass .search-input .mat-input-element::placeholder {
  color: rgba(255, 255, 255, 0.7) !important;
}
:host ::ng-deep .search-liquid-glass .search-input mat-icon {
  color: rgba(255,255,255,0.7) !important;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .search-liquid-glass {
    width: 95%;
    padding: 0 10px;
  }
}
```

---

## 1. Floating (Fixed Position) Styles

This version floats at the bottom of the viewport and does not affect the layout of other page elements. This is the version currently implemented in `app.component.ts`.

```css
/* Liquid Glass Notification Styles - Floating Version */
.liquid-glass-notification {
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

.notification-content {
  display: flex;
  align-items: center;
  width: 100%;
}

.notification-image {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  object-fit: cover;
  margin-right: 12px;
  flex-shrink: 0;
}

.notification-text h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: white;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

.notification-text p {
  margin: 5px 0 0;
  font-size: 13px;
  line-height: 1.3;
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

/* Responsive adjustments for Floating Version */
@media (max-width: 600px) {
  .liquid-glass-notification {
    width: 95%;
    padding: 12px;
    bottom: 15px;
  }
  .notification-image {
    width: 40px;
    height: 40px;
    margin-right: 10px;
  }
  .notification-text h3 {
    font-size: 14px;
  }
  .notification-text p {
    font-size: 12px;
  }
}

```

---

## 2. Inline (Non-Floating) Styles

This version sits in the normal document flow. **Warning**: This version might interact with the layout of surrounding elements.

```css
/* Liquid Glass Notification Styles - Inline Version */
.liquid-glass-notification {
  margin: 20px auto; /* Center horizontally and provide vertical spacing */
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
  color: white;
  font-family: 'SF Pro Text', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
}
/* Note: The rest of the styles (.notification-content, .notification-image, .notification-text, etc.) are the same as the floating version. */

/* Responsive adjustments for Inline Version */
@media (max-width: 600px) {
  .liquid-glass-notification {
    width: 95%;
    padding: 12px;
    margin-top: 15px;
    margin-bottom: 15px;
  }
  .notification-image {
    width: 40px;
    height: 40px;
    margin-right: 10px;
  }
  .notification-text h3 {
    font-size: 14px;
  }
  .notification-text p {
    font-size: 12px;
  }
}
```