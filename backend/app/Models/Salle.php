<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Salle extends Model
{
    use HasFactory;
    protected $table = 'salles';
    protected $fillable = [
        'nom',
        'description',
        'images',
        'responsable_id',
        'location',
        'capacite',
        'status',
    ];
    public function responsable()
    {
        return $this->belongsTo(User::class, 'responsable_id');
    }
    public function disponibilites()
    {
        return $this->hasMany(Disponibilite::class);
    }
    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
    

}
