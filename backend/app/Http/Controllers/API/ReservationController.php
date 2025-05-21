<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reservations = Reservation::all();
        return response()->json($reservations);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'salle_id' => 'required|exists:salles,id',
            'user_id' => 'required|exists:users,id',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date',
            'statut' => 'required|string|in:confirmé,annulé',
        ]);
        $reservation = Reservation::create($request->all());
        return response()->json([
            'message' => 'Reservation créée avec succès',
            'data' => $reservation->load('salle', 'user')
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $reservation = Reservation::findOrFail($id);
        return response()->json([
            'message' => 'Reservation récupérée avec succès',
            'data' => $reservation->load('salle', 'user')
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'salle_id' => 'required|exists:salles,id',
            'user_id' => 'required|exists:users,id',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date',
            'statut' => 'required|string|in:confirmé,annulé',
        ]);
        $reservation = Reservation::findOrFail($id);
        $reservation->update($request->all());
        return response()->json([
            'message' => 'Reservation mise à jour avec succès',
            'data' => $reservation->load('salle', 'user')
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $reservation = Reservation::findOrFail($id);
        $reservation->delete();
        return response()->json([
            'message' => 'Reservation supprimée avec succès',
            'data' => $reservation->load('salle', 'user')
        ]);
    }
}
