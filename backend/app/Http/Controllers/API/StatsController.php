<?php

namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
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
}