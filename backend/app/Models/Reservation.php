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
        'user_id',
        'date_debut',
        'date_fin',
        'statut',
    ];
        public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function salle()
    {
        return $this->belongsTo(Salle::class);
    }
}
