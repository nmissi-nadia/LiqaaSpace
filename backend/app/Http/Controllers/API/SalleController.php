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
        $salle = Salle::create($request->all());
        return response()->json($salle);
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
