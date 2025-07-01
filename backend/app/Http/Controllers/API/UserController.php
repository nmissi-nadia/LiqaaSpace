<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Controllers\Controller;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::all();
        // return users sou forme json
        return response()->json($users);
    }



    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user =User::findOrFail($id);
        return response()->json($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user =User::findOrFail($id);
        $user->update($request->all());
        return response()->json($user);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user =User::findOrFail($id);
        $user->delete();
        return response()->json($user);
    }

    /**
     * Démarrer ou récupérer une conversation avec un utilisateur
     */
    public function startConversation(Request $request, $userId)
    {
        $currentUser = Auth::user();
        $otherUser = User::findOrFail($userId);

        // Vérifier si une conversation existe déjà
        $conversation = Conversation::where(function($query) use ($currentUser, $otherUser) {
            $query->where('user1_id', $currentUser->id)
                  ->where('user2_id', $otherUser->id);
        })->orWhere(function($query) use ($currentUser, $otherUser) {
            $query->where('user1_id', $otherUser->id)
                  ->where('user2_id', $currentUser->id);
        })->first();

        // Si aucune conversation n'existe, en créer une nouvelle
        if (!$conversation) {
            $conversation = Conversation::create([
                'user1_id' => min($currentUser->id, $otherUser->id),
                'user2_id' => max($currentUser->id, $otherUser->id),
                'last_message_at' => now(),
            ]);
        }

        return response()->json($conversation->load(['user1', 'user2']));
    }

    /**
     * Envoyer un message à un utilisateur
     */
    public function sendMessageToUser(Request $request, $recipientId)
    {
        $request->validate([
            'content' => 'required|string|max:2000',
        ]);

        $currentUser = Auth::user();
        $recipient = User::findOrFail($recipientId);

        // Trouver ou créer une conversation
        $conversation = $this->findOrCreateConversation($currentUser, $recipient);

        // Créer le message
        $message = $conversation->messages()->create([
            'sender_id' => $currentUser->id,
            'content' => $request->content,
        ]);

        // Mettre à jour la date du dernier message
        $conversation->update(['last_message_at' => now()]);

        return response()->json($message->load('sender'));
    }

    /**
     * Méthode utilitaire pour trouver ou créer une conversation
     */
    private function findOrCreateConversation(User $user1, User $user2)
    {
        return Conversation::firstOrCreate(
            [
                'user1_id' => min($user1->id, $user2->id),
                'user2_id' => max($user1->id, $user2->id),
            ],
            ['last_message_at' => now()]
        );
    }
}
