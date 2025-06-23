<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\SalleController;
use App\Http\Controllers\API\ReservationController;
use App\Http\Controllers\API\DisponibiliteController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\StatsController;

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
Route::get('/sanctum/csrf-cookie', function () {
    return response()->noContent();
});

// route vers register
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/forgot-password', [AuthController::class, 'Mpsasseoubli'])->name('password.forgot');
Route::post('/reset-password', [AuthController::class, 'resetMps'])->name('password.reset');
Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{id}', [UserController::class, 'show']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class,'logout']);
    Route::post('/change-password', [AuthController::class,'changeMps']);
    Route::apiResource('salles', SalleController::class);
    Route::apiResource('reservations', ReservationController::class);
    Route::apiResource('disponibilites', DisponibiliteController::class);
    Route::get('/stats/responsable', [StatsController::class, 'getStatsResponsable']);
    Route::get('/stats/collaborateur', [StatsController::class, 'getStatsUser']);

   
    
});
Route::get('/test', function () {
    return response()->json(['message' => 'Connexion OK']);
});
// les reservations recentes
Route::get('/reservations/recent', [ReservationController::class, 'recentes']);
// api/reservations/stats
Route::get('/reservations/stats', [ReservationController::class, 'getStats']);
// api/reservations/stats/user/{id}
Route::get('/reservations/collaborateur/{id}', [ReservationController::class, 'getReservationsByUser']);
// route vers stats
Route::get('/stats', [StatsController::class, 'getStatsAdmin']);
// stats de collaborateur
Route::get('/stats/collaborateur', [StatsController::class, 'getStatsUser']);

// Routes pour les salles
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('salles')->group(function () {
        Route::get('/', [SalleController::class, 'index']);
        Route::get('/disponibles', [SalleController::class, 'getSallesDisponibles']);
        Route::get('/top5', [SalleController::class, 'getTop5Salles']);
        Route::post('/', [SalleController::class, 'store']);
        Route::get('/{id}', [SalleController::class, 'show']);
        Route::put('/{id}', [SalleController::class, 'update']);
        Route::delete('/{id}', [SalleController::class, 'destroy']);
    });
});
// Réservations
Route::get('/reservations/prochaine', [ReservationController::class, 'getReservationsProchaines']);
    Route::get('/salles/top5', [SalleController::class, 'getTop5Salles']);
    Route::get('/reservations/avenir/{id}', [ReservationController::class, 'avenir']);
    Route::get('/salles/disponibles', [SalleController::class, 'getdispo']);



