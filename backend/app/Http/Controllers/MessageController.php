<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Events\MessageSent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class MessageController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
        try {
            return Message::with('user')
                ->orderBy('created_at', 'desc')
                ->take(50)
                ->get()
                ->reverse()
                ->values();
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des messages: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            return response()->json(['error' => 'Erreur serveur lors de la récupération des messages'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'message' => 'required_without:file|string|max:1000',
                'file' => 'nullable|file|max:10240', // 10MB max
            ]);

            $messageData = [
                'user_id' => Auth::id(),
                'message' => $request->input('message', ''),
            ];

            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $path = $file->store('uploads/chat', 'public');
                $messageData['file_path'] = $path;
                $messageData['file_name'] = $file->getClientOriginalName();
            }

            $message = Message::create($messageData);
            $message->load('user');

            broadcast(new MessageSent($message))->toOthers();

            return response()->json($message, 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'envoi du message: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            return response()->json(['error' => 'Erreur serveur lors de l\'envoi du message'], 500);
        }
    }
}