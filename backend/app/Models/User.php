<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'profil',
        'status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // relation avec les salles
    public function salles()
    {
        return $this->hasMany(Salle::class);
    }

    // relation avec les reservations
    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    /**
     * Conversations où l'utilisateur est user1
     */
    public function conversationsAsUser1()
    {
        return $this->hasMany(Conversation::class, 'user1_id');
    }

    /**
     * Conversations où l'utilisateur est user2
     */
    public function conversationsAsUser2()
    {
        return $this->hasMany(Conversation::class, 'user2_id');
    }

    /**
     * Toutes les conversations de l'utilisateur
     */
    public function conversations()
    {
        return $this->conversationsAsUser1->merge($this->conversationsAsUser2);
    }

    /**
     * Messages envoyés par l'utilisateur
     */
    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

   
    
}
