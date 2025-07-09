<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Reservation;
use App\Notifications\ReservationCreee;
use Illuminate\Support\Facades\Notification;

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
        $reservations = Reservation::with('salle', 'collaborateur')->get();
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
     *             required={"salle_id","user_id","heure_debut","heure_fin","statut"},
     *             @OA\Property(property="salle_id", type="integer", example=1),
     *             @OA\Property(property="user_id", type="integer", example=1),
     *             @OA\Property(property="heure_debut", type="string", format="date-time", example="2025-05-22 10:00:00"),
     *             @OA\Property(property="heure_fin", type="string", format="date-time", example="2025-05-22 12:00:00"),
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
        $validated = $request->validate([
            'salle_id' => 'required|exists:salles,id',
            'date' => 'required|date',
            'heure_debut' => 'required|date_format:H:i',
            'heure_fin' => 'required|date_format:H:i|after:heure_debut',
            'motif' => 'required|string|max:255',
        ]);

        $reservation = new Reservation();
        $reservation->salle_id = $validated['salle_id'];
        $reservation->date = $validated['date'];
        $reservation->heure_debut = $validated['heure_debut'];
        $reservation->heure_fin = $validated['heure_fin'];
        $reservation->motif = $validated['motif'];
        $reservation->collaborateur_id = auth()->id();
        $reservation->statut = 'en attente'; // Valeur par défaut
        $reservation->save();
        $user = User::find($reservation->collaborateur_id);
        $user->notify(new ReservationCreee($reservation));
        return response()->json($reservation, 201);
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
     *             required={"salle_id","user_id","heure_debut","heure_fin","statut"},
     *             @OA\Property(property="salle_id", type="integer", example=1),
     *             @OA\Property(property="user_id", type="integer", example=1),
     *             @OA\Property(property="heure_debut", type="string", format="date-time", example="2025-05-22 10:00:00"),
     *             @OA\Property(property="heure_fin", type="string", format="date-time", example="2025-05-22 12:00:00"),
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
            'heure_debut' => 'required|date',
            'heure_fin' => 'required|date',
            'motif' => 'required|string',
            'statut' => 'required|string|in:confirmé,annulé',
        ]);
        $request->merge(['collaborateur_id' => auth()->user()->id]);
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
    public function getReservationsByUser()
    {
        $id = auth()->user()->id;
        $reservations = Reservation::where('collaborateur_id', $id)->with('salle', 'collaborateur')->get();
        return response()->json([
            'status' => 'success',
            'data' => $reservations
        ]);
    }
    /**
     * @OA\Get(
     *     path="/api/reservations/upcoming",
     *     summary="Obtenir les réservations futures",
     *     tags={"Réservations"},
     *     @OA\Response(
     *         response=200,
     *         description="Réservations futures récupérées avec succès"
     *     )
     * )
     */
    public function getReservationsProchaines()
    {
        $reservations = Reservation::with('salle', 'collaborateur')
            ->where('statut', 'accepté')
            ->where('date', '>=', now())
            ->orderBy('heure_debut')
            ->take(4)
            ->get();

        return response()->json($reservations);
    }
    // les 3 prochaines réservations pour le collaborateur
    /**
     * @OA\Get(
     *     path="/api/reservations/upcoming/{id}",
     *     summary="Obtenir les réservations futures pour un collaborateur",
     *     tags={"Réservations"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID du collaborateur",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Réservations futures récupérées avec succès"
     *     )
     * )
     */
    public function avenir(string $id)
    {
        $reservations = Reservation::where('collaborateur_id', $id)
            ->where('statut', 'accepté')
            ->where('date', '>=', now())
            ->orderBy('date')
            ->take(5)
            ->get();
        return response()->json($reservations);
    }

    // les réservations récentes
    public function recentes()
    {
        $reservations = Reservation::with('salle', 'collaborateur')
            ->where('statut', 'accepté')
            ->where('date', '>=', now())
            ->orderBy('date')
            ->take(4)
            ->get();

        return response()->json($reservations);
    }
}