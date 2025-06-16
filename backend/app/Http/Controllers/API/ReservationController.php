<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Reservation;

/**
 * @OA\Tag(
 *     name="Réservations",
 *     description="API Endpoints de gestion des réservations"
 * )
 */
class ReservationController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/reservations",
     *     summary="Liste toutes les réservations",
     *     tags={"Réservations"},
     *     @OA\Response(
     *         response=200,
     *         description="Liste des réservations récupérée avec succès"
     *     )
     * )
     */
    public function index()
    {
        $reservations = Reservation::all()->with('salle', 'collaborateur');
        return response()->json($reservations);
    }

    /**
     * @OA\Post(
     *     path="/api/reservations",
     *     summary="Créer une nouvelle réservation",
     *     tags={"Réservations"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"salle_id","user_id","date_debut","date_fin","statut"},
     *             @OA\Property(property="salle_id", type="integer", example=1),
     *             @OA\Property(property="user_id", type="integer", example=1),
     *             @OA\Property(property="date_debut", type="string", format="date-time", example="2025-05-22 10:00:00"),
     *             @OA\Property(property="date_fin", type="string", format="date-time", example="2025-05-22 12:00:00"),
     *             @OA\Property(property="statut", type="string", enum={"confirmé","annulé"}, example="confirmé")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Réservation créée avec succès"
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
            'user_id' => 'required|exists:users,id',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date',
            'statut' => 'required|string|in:confirmé,annulé',
        ]);
        $reservation = Reservation::create($request->all());
        return response()->json([
            'message' => 'Reservation créée avec succès',
            'data' => $reservation->with('salle', 'collaborateur')
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/api/reservations/{id}",
     *     summary="Afficher une réservation spécifique",
     *     tags={"Réservations"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID de la réservation",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Réservation récupérée avec succès"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Réservation non trouvée"
     *     )
     * )
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
     * @OA\Put(
     *     path="/api/reservations/{id}",
     *     summary="Mettre à jour une réservation",
     *     tags={"Réservations"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID de la réservation à mettre à jour",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"salle_id","user_id","date_debut","date_fin","statut"},
     *             @OA\Property(property="salle_id", type="integer", example=1),
     *             @OA\Property(property="user_id", type="integer", example=1),
     *             @OA\Property(property="date_debut", type="string", format="date-time", example="2025-05-22 10:00:00"),
     *             @OA\Property(property="date_fin", type="string", format="date-time", example="2025-05-22 12:00:00"),
     *             @OA\Property(property="statut", type="string", enum={"confirmé","annulé"}, example="confirmé")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Réservation mise à jour avec succès"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Réservation non trouvée"
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
     * @OA\Delete(
     *     path="/api/reservations/{id}",
     *     summary="Supprimer une réservation",
     *     tags={"Réservations"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID de la réservation à supprimer",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Réservation supprimée avec succès"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Réservation non trouvée"
     *     )
     * )
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
// route vers stats et documentation swagger


    /**
     * @OA\Get(
     *     path="/api/reservations/stats",
     *     summary="Obtenir les statistiques des réservations",
     *     tags={"Réservations"},
     *     @OA\Response(
     *         response=200,
     *         description="Statistiques des réservations récupérées avec succès"
     *     )
     * )
     */
    public function getStats()
    {
        $stats = [];
        $currentMonth = now()->startOfMonth();
        
        for ($i = 0; $i < 6; $i++) {
            $month = $currentMonth->copy()->subMonths($i);
            $monthNumber = $month->month;
            $year = $month->year;
            
            $stats[] = [
                'date' => $month->format('M Y'),
                'count' => Reservation::whereYear('date', $year)
                    ->whereMonth('date', $monthNumber)
                    ->count()
            ];
        }
        
        return response()->json([
            'status' => 'success',
            'data' => array_reverse($stats)
        ]);
    }
    // reservation par utilisateur
    public function getReservationsByUser(string $id)
    {
        $reservations = Reservation::where('collaborateur_id', $id)->get();
        return response()->json([
            'status' => 'success',
            'data' => $reservations
        ]);
    }
}