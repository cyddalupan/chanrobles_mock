<?php
header('Content-Type: application/json');

// Load environment variables
require_once __DIR__ . '/../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

$unsplashApiKey = $_ENV['UNSPLASH_API_KEY'] ?? null;
$cacheDir = __DIR__ . '/cache/';
$cacheDuration = 30 * 60; // 30 minutes in seconds

// Ensure cache directory exists
if (!is_dir($cacheDir)) {
    mkdir($cacheDir, 0777, true);
}

if (!$unsplashApiKey) {
    http_response_code(500);
    echo json_encode(['error' => 'Unsplash API key not configured.']);
    exit;
}

$query = $_GET['query'] ?? 'weather'; // Default query if none provided

$cacheFile = $cacheDir . 'unsplash_cache_' . md5($query) . '.json';

// Check for cached data
if (file_exists($cacheFile) && (time() - filemtime($cacheFile) < $cacheDuration)) {
    echo file_get_contents($cacheFile);
    exit;
}

// Unsplash API endpoint for random photo based on query
// Using 'collections' and 'orientation' to get more relevant background images
$url = "https://api.unsplash.com/photos/random?query=" . urlencode($query) . "&orientation=landscape&client_id={$unsplashApiKey}";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// Unsplash requires a User-Agent header
curl_setopt($ch, CURLOPT_USERAGENT, 'MockBarApp/1.0 (https://topbarassist.com/chanrobles-bar/mock/bar/)');
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    $data = json_decode($response, true);
    $imageUrl = $data['urls']['regular'] ?? null;

    if ($imageUrl) {
        $result = ['imageUrl' => $imageUrl, 'query' => $query];
        $jsonResult = json_encode($result);
        file_put_contents($cacheFile, $jsonResult);
        echo $jsonResult;
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'No image found for the given query.']);
    }
} else {
    http_response_code($httpCode);
    echo json_encode(['error' => 'Failed to fetch image from Unsplash.', 'details' => json_decode($response, true)]);
}
