<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'coupons'], // Allow your routes
    'allowed_methods' => ['*'],
    'allowed_origins' => ['*'], // Allow all origins (For development)
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];

