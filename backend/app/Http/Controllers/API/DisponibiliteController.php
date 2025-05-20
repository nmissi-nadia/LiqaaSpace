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
        $disponibilite = Disponibilite::create($request->all());
        return response()->json($disponibilite);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $disponibilite=Disponibilite::findOrFail($id);
        return response()->json($disponibilite);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
