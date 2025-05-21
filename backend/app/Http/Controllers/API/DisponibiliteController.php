<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Disponibilite;

class DisponibiliteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $disponibilites = Disponibilite::all();
        return response()->json($disponibilites);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'salle_id' => 'required|exists:salles,id',
            'date' => 'required|date',
            'heure_debut' => 'required|date_format:H:i',
            'heure_fin' => 'required|date_format:H:i',
            'statut' => 'required|string|in:disponible,occupé',
        ]);
        $disponibilite = Disponibilite::create($request->all());
        return response()->json([
            'message' => 'Disponibilité créée avec succès',
            'data' => $disponibilite->load('salle')
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $disponibilite=Disponibilite::findOrFail($id);
        return response()->json([
            'message' => 'Disponibilité récupérée avec succès',
            'data' => $disponibilite->load('salle')
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'salle_id' => 'required|exists:salles,id',
            'date' => 'required|date',
            'heure_debut' => 'required|date_format:H:i',
            'heure_fin' => 'required|date_format:H:i',
            'statut' => 'required|string|in:disponible,occupé',
        ]);
        $disponibilite=Disponibilite::findOrFail($id);
        $disponibilite->update($request->all());
        return response()->json([
            'message' => 'Disponibilité mise à jour avec succès',
            'data' => $disponibilite->load('salle')
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $disponibilite=Disponibilite::findOrFail($id);
        $disponibilite->delete();
        return response()->json([
            'message' => 'Disponibilité supprimée avec succès',
            'data' => $disponibilite->load('salle')
        ]);
    }
}
