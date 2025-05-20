<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Disponibilite extends Model
{
    use HasFactory;
    protected $table = 'disponibilites';
    protected $fillable = [
        'salle_id',
        'date',
        'heure_debut',
        'heure_fin',
        'statut',
    ];
    public function salle()
    {
        return $this->belongsTo(Salle::class);
    }
}
