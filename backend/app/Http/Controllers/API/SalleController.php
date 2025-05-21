<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SalleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $salles = Salle::all();
        return response()->json($salles);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'required|string',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'responsable_id' => 'required|exists:users,id',
            'location' => 'required|string',
            'capacite' => 'required|integer',
            'status' => 'required|string|in:active,inactive',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $data = $request->except('images');
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
            'message' => 'Salle créée avec succès',
            'data' => $salle->load('responsable')
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $salle = Salle::findOrFail($id);
        return response()->json($salle);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'required|string',
            'images' => 'required|array',
            'responsable_id' => 'required|exists:users,id',
            'location' => 'required|string',
            'capacite' => 'required|integer',
            'status' => 'required|string|in:active,inactive',
        ]);
        $salle = Salle::findOrFail($id);
        $salle->update($request->all());
        return response()->json($salle);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $salle = Salle::findOrFail($id);
        $salle->delete();
        return response()->json($salle);
    }
}
