<?php

namespace App\Http\Controllers\API;

use App\Events\NewNotification;
use App\Models\User;
use App\Models\Notification as NotificationModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

class NotificationController extends Controller
{
    /**
     * Récupérer toutes les notifications de l'utilisateur
     */
    public function index()
    {
        $user = Auth::user();
        return response()->json([
            'notifications' => $user->notifications,
            'unread_count' => $user->unreadNotifications->count(),
        ]);
    }

    /**
     * Envoyer une notification
     */
    public function sendNotification(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
            'user_id' => 'required|exists:users,id'
        ]);

        $message = $request->input('message');
        $userId = $request->input('user_id');
        
        // Créer la notification dans la base de données
        $user = User::find($userId);
        $notification = $user->notifications()->create([
            'type' => 'App\\Notifications\\GeneralNotification',
            'data' => ['message' => $message],
            'read_at' => null
        ]);
        
        // Diffuser l'événement
        event(new NewNotification($message, $userId));
        
        return response()->json([
            'status' => 'success',
            'notification' => $notification
        ]);
    }

    /**
     * Marquer une notification comme lue
     */
    public function markAsRead(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:notifications,id'
        ]);

        $notification = Auth::user()->notifications()->findOrFail($request->id);
        $notification->markAsRead();

        return response()->json([
            'status' => 'success',
            'unread_count' => Auth::user()->unreadNotifications->count()
        ]);
    }

    /**
     * Supprimer une notification
     */
    public function destroy($id)
    {
        $notification = Auth::user()->notifications()->findOrFail($id);
        $notification->delete();

        return response()->json([
            'status' => 'deleted',
            'unread_count' => Auth::user()->unreadNotifications->count()
        ]);
    }
}