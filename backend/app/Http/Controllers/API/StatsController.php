<?php

namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Salle;
use App\Models\Reservation;
use Illuminate\Http\Request;

class StatsController extends Controller
{
    public function getStatsAdmin()
    {
        return [
            'totalUsers' => User::count(),
            'totalRooms' => Salle::count(),
            'totalReservations' => Reservation::count(),
            'totalRevenue' => 0
        ];
    }
    public function getStatsResponsable()
    {
        return [
            'totalSallesdispo' => Salle::where('status', 'active')->count(),
            'totalReservations' => Reservation::count(),
            'totalSallesoccupe' => Salle::where('status', 'inactive')->count(),
            'totalCollaborateurs' => User::where('role', 'collaborateur')->count(),
        ];
    }
    // fonction pour les statistique conserné par collaborateur
    public function getStatsUser()
    {
        return [
            'totalReservations' => Reservation::where('collaborateur_id', Auth::user()->id)->count(),
            'totalSallesoccupe' => Salle::where('status', 'inactive')->count(),
            'totalCollaborateurs' => User::where('role', 'collaborateur')->count(),
            'totalsalledispo' => Salle::where('status', 'active')->count(),
        ];
    }
}