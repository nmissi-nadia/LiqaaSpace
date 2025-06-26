<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;
    protected $table = 'reservations';
    protected $fillable = [
        'salle_id',
        'collaborateur_id',
        'date',
        'heure_debut',
        'heure_fin',
        'statut',
        'motif',
    ];

    public function salle()
    {
        return $this->belongsTo(Salle::class);
    }
    public function collaborateur()
    {
        return $this->belongsTo(User::class, 'collaborateur_id');
    }
}
