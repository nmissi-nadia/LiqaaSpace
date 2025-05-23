<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Disponibilite;

/**
 * @OA\Tag(
 *     name="Disponibilités",
 *     description="API Endpoints de gestion des disponibilités des salles"
 * )
 */
class DisponibiliteController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/disponibilites",
     *     summary="Liste toutes les disponibilités",
     *     tags={"Disponibilités"},
     *     @OA\Response(
     *         response=200,
     *         description="Liste des disponibilités récupérée avec succès"
     *     )
     * )
     */
    public function index()
    {
        $disponibilites = Disponibilite::all();
        return response()->json($disponibilites);
    }

    /**
     * @OA\Post(
     *     path="/api/disponibilites",
     *     summary="Créer une nouvelle disponibilité",
     *     tags={"Disponibilités"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"salle_id","date","heure_debut","heure_fin","statut"},
     *             @OA\Property(property="salle_id", type="integer", example=1),
     *             @OA\Property(property="date", type="string", format="date", example="2025-05-22"),
     *             @OA\Property(property="heure_debut", type="string", format="time", example="09:00"),
     *             @OA\Property(property="heure_fin", type="string", format="time", example="17:00"),
     *             @OA\Property(property="statut", type="string", enum={"disponible","occupé"}, example="disponible")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Disponibilité créée avec succès"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Erreur de validation"
     *     )
     * )
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
     * @OA\Get(
     *     path="/api/disponibilites/{id}",
     *     summary="Afficher une disponibilité spécifique",
     *     tags={"Disponibilités"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID de la disponibilité",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Disponibilité récupérée avec succès"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Disponibilité non trouvée"
     *     )
     * )
     */
    public function show(string $id)
    {
        $disponibilite = Disponibilite::findOrFail($id);
        return response()->json([
            'message' => 'Disponibilité récupérée avec succès',
            'data' => $disponibilite->load('salle')
        ]);
    }

    /**
     * @OA\Put(
     *     path="/api/disponibilites/{id}",
     *     summary="Mettre à jour une disponibilité",
     *     tags={"Disponibilités"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID de la disponibilité à mettre à jour",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"salle_id","date","heure_debut","heure_fin","statut"},
     *             @OA\Property(property="salle_id", type="integer", example=1),
     *             @OA\Property(property="date", type="string", format="date", example="2025-05-22"),
     *             @OA\Property(property="heure_debut", type="string", format="time", example="09:00"),
     *             @OA\Property(property="heure_fin", type="string", format="time", example="17:00"),
     *             @OA\Property(property="statut", type="string", enum={"disponible","occupé"}, example="occupé")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Disponibilité mise à jour avec succès"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Disponibilité non trouvée"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Erreur de validation"
     *     )
     * )
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
        $disponibilite = Disponibilite::findOrFail($id);
        $disponibilite->update($request->all());
        return response()->json([
            'message' => 'Disponibilité mise à jour avec succès',
            'data' => $disponibilite->load('salle')
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/api/disponibilites/{id}",
     *     summary="Supprimer une disponibilité",
     *     tags={"Disponibilités"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID de la disponibilité à supprimer",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Disponibilité supprimée avec succès"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Disponibilité non trouvée"
     *     )
     * )
     */
    public function destroy(string $id)
    {
        $disponibilite = Disponibilite::findOrFail($id);
        $disponibilite->delete();
        return response()->json([
            'message' => 'Disponibilité supprimée avec succès',
            'data' => $disponibilite->load('salle')
        ]);
    }
}