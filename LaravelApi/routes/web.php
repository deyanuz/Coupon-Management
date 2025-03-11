<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CouponController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});
// Route to get all coupons
Route::get('/coupons', [CouponController::class, 'index']);
Route::post('/coupons', [CouponController::class, 'store']); // Create new coupon
Route::get('/coupons/{id}', [CouponController::class, 'show']); // Get single coupon
Route::put('/coupons/{id}', [CouponController::class, 'update']); // Update coupon
Route::delete('/coupons/{id}', [CouponController::class, 'destroy']); // Delete coupon