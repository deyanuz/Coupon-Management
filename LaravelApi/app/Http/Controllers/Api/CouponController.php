<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Exception;

class CouponController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $coupons = Coupon::latest()->get();
            
            return response()->json([
                'status' => true,
                'data' => $coupons
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error retrieving coupons',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'code' => 'required|unique:coupons,code|string|max:50',
                'type' => 'required|in:percentage,free_shipping,fixed_amount',
                'value' => 'required_unless:type,free_shipping|numeric|nullable',
                'status' => 'required|in:active,inactive,expired',
                'expiry_date' => 'required|date|after:today',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $coupon = Coupon::create([
                'code' => $request->code,
                'type' => $request->type,
                'value' => $request->value,
                'status' => $request->status,
                'expiry_date' => $request->expiry_date
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Coupon created successfully',
                'data' => $coupon
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error creating coupon',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $coupon = Coupon::find($id);
            
            if (!$coupon) {
                return response()->json([
                    'status' => false,
                    'message' => 'Coupon not found'
                ], 404);
            }

            return response()->json([
                'status' => true,
                'data' => $coupon
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error retrieving coupon',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $coupon = Coupon::find($id);
            
            if (!$coupon) {
                return response()->json([
                    'status' => false,
                    'message' => 'Coupon not found'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'code' => 'sometimes|required|unique:coupons,code,' . $id . '|string|max:50',
                'type' => 'sometimes|required|in:percentage,free_shipping,fixed_amount',
                'value' => 'required_unless:type,free_shipping|numeric|nullable',
                'status' => 'sometimes|required|in:active,inactive,expired',
                'expiry_date' => 'sometimes|required|date|after:today',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $coupon->update([
                'code' => $request->code ?? $coupon->code,
                'type' => $request->type ?? $coupon->type,
                'value' => $request->value ?? $coupon->value,
                'status' => $request->status ?? $coupon->status,
                'expiry_date' => $request->expiry_date ?? $coupon->expiry_date
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Coupon updated successfully',
                'data' => $coupon
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error updating coupon',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $coupon = Coupon::find($id);
            
            if (!$coupon) {
                return response()->json([
                    'status' => false,
                    'message' => 'Coupon not found'
                ], 404);
            }

            $coupon->delete();

            return response()->json([
                'status' => true,
                'message' => 'Coupon deleted successfully'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error deleting coupon',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
