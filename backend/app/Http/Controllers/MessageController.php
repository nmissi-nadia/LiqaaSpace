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
            return response()->json([
                    'messages' => Message::with('user')
                        ->orderBy('created_at', 'desc')
                        ->take(50)
                        ->get()
                        ->reverse()
                        ->values()
                ]);
            } catch (\Exception $e) {
                \Log::error('Erreur MessageController@index: ' . $e->getMessage());
                return response()->json(['error' => 'Erreur serveur'], 500);
            }
        }

        public function store(Request $request)
        {
            try {
                $request->validate([
                    'message' => 'nullable|string',
                    'file' => 'nullable|file|max:10240', // 10MB max
                ]);
        
                $message = new Message();
                $message->user_id = auth()->id();
                
                if ($request->has('message')) {
                    $message->message = $request->input('message');
                }
        
                if ($request->hasFile('file')) {
                    $file = $request->file('file');
                    $path = $file->store('uploads/messages', 'public');
                    $message->file_path = $path;
                    $message->file_name = $file->getClientOriginalName();
                }
        
                $message->save();
                $message->load('user');
        
                // Diffusion du message via WebSocket
                broadcast(new MessageSent($message))->toOthers();
        
                return response()->json([
                    'message' => $message
                ], 201);
        
            } catch (\Exception $e) {
                \Log::error('Erreur dans MessageController@store: ' . $e->getMessage());
                \Log::error($e->getTraceAsString());
                return response()->json([
                    'error' => 'Erreur lors de l\'envoi du message',
                    'details' => config('app.debug') ? $e->getMessage() : null
                ], 500);
            }
        }
}