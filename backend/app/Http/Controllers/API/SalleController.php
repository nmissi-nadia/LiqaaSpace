<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Salle;
use Illuminate\Support\Facades\Auth;

/**
 * @OA\Tag(
 *     name="Salles",
 *     description="API Endpoints de gestion des salles"
 * )
 */
    /**
 * @OA\Schema(
 *     schema="Salle",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="nom", type="string", example="Salle de conférence A"),
 *     @OA\Property(property="description", type="string", example="Description de la salle"),
 *     @OA\Property(property="images", type="array", @OA\Items(type="string")),
 *     @OA\Property(property="responsable_id", type="integer", example=1),
 *     @OA\Property(property="location", type="string", example="Bâtiment A, 1er étage"),
 *     @OA\Property(property="capacite", type="integer", example=50),
 *     @OA\Property(property="status", type="string", enum={"active","inactive"}, example="active"),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 */
class SalleController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/salles",
     *     summary="Liste toutes les salles",
     *     tags={"Salles"},
     *     @OA\Response(
     *         response=200,
     *         description="Liste des salles récupérée avec succès"
     *     )
     * )
     */
    public function index()
    {
        $salles = Salle::all();
        return response()->json($salles);
    }

    /**
     * @OA\Post(
     *     path="/api/salles",
     *     summary="Créer une nouvelle salle",
     *     tags={"Salles"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"nom","description","location","capacite","status"},
     *                 @OA\Property(property="nom", type="string", example="Salle de conférence A"),
     *                 @OA\Property(property="description", type="string", example="Grande salle équipée d'un vidéoprojecteur"),
     *                 @OA\Property(property="images[]", type="array", @OA\Items(type="string", format="binary")),
     *                 @OA\Property(property="location", type="string", example="Bâtiment A, 1er étage"),
     *                 @OA\Property(property="capacite", type="integer", example=50),
     *                 @OA\Property(property="status", type="string", enum={"active","inactive"}, example="active")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Salle créée avec succès"
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
            'nom' => 'required|string|max:255',
            'description' => 'required|string',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'location' => 'required|string',
            'capacite' => 'required|integer',
            'status' => 'required|string|in:active,inactive',
        ]);

        // on capte le id de responsable_id par le id de user connecté
        $data = $request->except('images');
        $data['responsable_id'] = Auth::user()->id;
        $images = [];

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('salles', 'public');
                $images[] = $path;
            }
            $data['images'] = json_encode($images);
        }
        $salle = Salle::create($data);
        return response()->json([
            'success' => true,
            'message' => 'Salle créée avec succès',
            'data' => $salle->load('responsable')
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/api/salles/{id}",
     *     summary="Afficher une salle spécifique",
     *     tags={"Salles"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID de la salle",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Salle récupérée avec succès"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Salle non trouvée"
     *     )
     * )
     */
    public function show(string $id)
    {
        $salle = Salle::findOrFail($id);
        return response()->json($salle);
    }

    /**
     * @OA\Put(
     *     path="/api/salles/{id}",
     *     summary="Mettre à jour une salle",
     *     tags={"Salles"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID de la salle à mettre à jour",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"nom","description","responsable_id","location","capacite","status"},
     *             @OA\Property(property="nom", type="string", example="Salle de conférence A"),
     *             @OA\Property(property="description", type="string", example="Grande salle équipée d'un vidéoprojecteur"),
     *             @OA\Property(
     *                 property="images",
     *                 type="array",
     *                 @OA\Items(type="string", example="salles/image.jpg")
     *             ),
     *             @OA\Property(property="location", type="string", example="Bâtiment A, 1er étage"),
     *             @OA\Property(property="capacite", type="integer", example=50),
     *             @OA\Property(property="status", type="string", enum={"active","inactive"}, example="active")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Salle mise à jour avec succès",
     *         @OA\JsonContent(ref="#/components/schemas/Salle")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Salle non trouvée"
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
            'nom' => 'required|string|max:255',
            'description' => 'required|string',
            'images' => 'required|array',
            'location' => 'required|string',
            'capacite' => 'required|integer',
            'status' => 'required|string|in:active,inactive',
        ]);
        $salle = Salle::findOrFail($id);
        $salle->responsable_id = Auth::user()->id;
        $salle->update($request->all());
        
        return response()->json($salle);
    }
    /**
     * @OA\Delete(
     *     path="/api/salles/{id}",
     *     summary="Supprimer une salle",
     *     tags={"Salles"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID de la salle à supprimer",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Salle supprimée avec succès"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Salle non trouvée"
     *     )
     * )
     */
    public function destroy(string $id)
    {
        $salle = Salle::findOrFail($id);
        $salle->delete();
        return response()->json($salle);
    }
}