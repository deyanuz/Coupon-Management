<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CouponController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Coupon Routes
Route::get('/coupons', [CouponController::class, 'index']); // Get all coupons
Route::post('/coupons', [CouponController::class, 'store']); // Create new coupon
Route::get('/coupons/{id}', [CouponController::class, 'show']); // Get single coupon
Route::put('/coupons/{id}', [CouponController::class, 'update']); // Update coupon
Route::delete('/coupons/{id}', [CouponController::class, 'destroy']); // Delete coupon
