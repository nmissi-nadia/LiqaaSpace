<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\SalleController;
use App\Http\Controllers\API\ReservationController;
use App\Http\Controllers\API\DisponibiliteController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\StatsController;
use App\Http\Controllers\API\NotificationController;
use App\Http\Controllers\MessageController;
use Illuminate\Support\Facades\Broadcast;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| Toutes les routes sont préfixées par /api
*/

// Routes publiques
Route::middleware('web')->group(function () {
    Route::get('/sanctum/csrf-cookie', fn () => response()->noContent());
    
    // Authentification
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::post('/forgot-password', [AuthController::class, 'Mpsasseoubli'])->name('password.forgot');
    Route::post('/reset-password', [AuthController::class, 'resetMps'])->name('password.reset');
    
    // Test de connexion
    Route::get('/test', fn () => response()->json(['message' => 'Connexion OK']));
});

// Routes protégées par authentification
Route::middleware(['auth:sanctum'])->group(function () {
    // Utilisateur courant
    Route::get('/user', fn (Request $request) => $request->user());
    
    // Gestion du profil utilisateur
    Route::prefix('profile')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/change-password', [AuthController::class, 'changeMps']);
    });
    
    // Gestion des salles
    Route::prefix('salles')->group(function () {
        Route::get('/', [SalleController::class, 'index']);
        Route::get('/disponibles', [SalleController::class, 'getdispo']);
        Route::get('/top5', [SalleController::class, 'getTop5Salles']);
        Route::post('/', [SalleController::class, 'store']);
        Route::get('/{id}', [SalleController::class, 'show']);
        Route::put('/{id}', [SalleController::class, 'update']);
        Route::delete('/{id}', [SalleController::class, 'destroy']);
    });
    

    // Gestion des réservations
    Route::prefix('reservations')->group(function () {
        Route::get('/', [ReservationController::class, 'index']);
        Route::get('/recent', [ReservationController::class, 'recentes']);
        Route::get('/prochaines', [ReservationController::class, 'getReservationsProchaines']);
        Route::get('/avenir/{id}', [ReservationController::class, 'avenir']);
        Route::get('/stats', [ReservationController::class, 'getStats']);
        Route::get('/collaborateur', [ReservationController::class, 'getReservationsByUser']);
        Route::post('/', [ReservationController::class, 'store']);
        Route::get('/{id}', [ReservationController::class, 'show']);
        Route::put('/{id}', [ReservationController::class, 'update']);
        Route::delete('/{id}', [ReservationController::class, 'destroy']);
    });
    // Gestion des disponibilités
    Route::apiResource('disponibilites', DisponibiliteController::class);
    
    // Statistiques
    Route::prefix('stats')->group(function () {
        Route::get('/', [StatsController::class, 'getStatsAdmin']);
        Route::get('/responsable', [StatsController::class, 'getStatsResponsable']);
        Route::get('/collaborateur', [StatsController::class, 'getStatsUser']);
    });
    
    // Gestion des utilisateurs (admin)
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::get('/{id}', [UserController::class, 'show']);
    });
});

Route::middleware('auth:sanctum')->get('/notifications', function (Request $request) {
    return $request->user()->notifications()->orderBy('read_at')->get();
});

// Récupérer uniquement les notifications non lues
Route::middleware('auth:sanctum')->get('/notifications/unread', function (Request $request) {
    return $request->user()->unreadNotifications()->get();
});

// Marquer une notification comme lue
Route::middleware('auth:sanctum')->post('/notifications/{id}/read', function ($id, Request $request) {
    $notification = $request->user()->notifications()->findOrFail($id);
    $notification->markAsRead();
    return response()->json(['status' => 'ok']);
});

// Marquer toutes les notifications comme lues
Route::middleware('auth:sanctum')->post('/notifications/read-all', function (Request $request) {
    $request->user()->unreadNotifications->markAsRead();
    return response()->json(['status' => 'all_read']);
});

// Supprimer une notification
Route::middleware('auth:sanctum')->delete('/notifications/{id}', function ($id, Request $request) {
    $notification = $request->user()->notifications()->findOrFail($id);
    $notification->delete();
    return response()->json(['status' => 'deleted']);
});


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/send-notification', [NotificationController::class, 'sendNotification']);
});

Broadcast::routes(['middleware' => ['auth:sanctum']]);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/messages', [MessageController::class, 'index']);
    Route::post('/messages', [MessageController::class, 'store']);
});