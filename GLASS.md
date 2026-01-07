# Liquid Glass Notification Styles

## HTML Structure

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

## CSS Styles

These styles are for a non-floating notification that sits in the normal document flow.

```css
/* Liquid Glass Notification Styles */
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

/* Responsive adjustments */
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
