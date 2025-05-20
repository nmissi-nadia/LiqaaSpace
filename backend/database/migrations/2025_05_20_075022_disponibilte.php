<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('salle_disponibilites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('salle_id')->constrained('salles')->onDelete('cascade');
            $table->date('date');
            $table->time('heure_debut');
            $table->time('heure_fin');
            $table->enum('statut', ['disponible', 'reservee'])->default('disponible');
            $table->timestamps();

            // Index pour optimiser les requêtes
            $table->index(['salle_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('salle_disponibilites');
    }
};