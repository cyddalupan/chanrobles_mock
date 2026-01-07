<?php
header('Content-Type: application/json');

// Load environment variables
require_once __DIR__ . '/../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

$openWeatherApiKey = $_ENV['OPENWEATHER_API_KEY'] ?? null;
$cacheDir = __DIR__ . '/cache/';
$cacheFile = $cacheDir . 'weather_cache.json';
$cacheDuration = 30 * 60; // 30 minutes in seconds

// Ensure cache directory exists
if (!is_dir($cacheDir)) {
    mkdir($cacheDir, 0777, true);
}

// Check for cached data
if (file_exists($cacheFile) && (time() - filemtime($cacheFile) < $cacheDuration)) {
    echo file_get_contents($cacheFile);
    exit;
}

if (!$openWeatherApiKey) {
    http_response_code(500);
    echo json_encode(['error' => 'OpenWeatherMap API key not configured.']);
    exit;
}

// Luzon coordinates (example: Manila)
$lat = '14.5995'; // Latitude for Manila
$lon = '120.9842'; // Longitude for Manila
$units = 'metric'; // or 'imperial'

$url = "http://api.openweathermap.org/data/2.5/weather?lat={$lat}&lon={$lon}&appid={$openWeatherApiKey}&units={$units}";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    file_put_contents($cacheFile, $response);
    echo $response;
} else {
    http_response_code($httpCode);
    echo json_encode(['error' => 'Failed to fetch weather data from OpenWeatherMap.', 'details' => json_decode($response, true)]);
}
