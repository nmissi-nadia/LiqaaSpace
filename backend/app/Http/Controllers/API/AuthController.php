<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password as PasswordRule;

class AuthController extends Controller
{
    // fonction concerné par le register
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|string|in:admin,collaborateur,responsable',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;
        // return avec ceci une message de succues aussi
        return response()->json([
            'message' => 'inscription reussie',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }
    // fonction pour le login 
    public function login(Request $request)
    {
        if(!Auth::attempt($request->only('email','password'))){
            return response()->json(['message'=> 'Invalid login details'], 401);
        }
        $user = User::where('email',$request['email'])->firstOrFail();
        $token=$user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'message' => 'Connexion Reussi',
            'user' => $user
        ]);
    }

    // fonction logout
    public function logout(Request $request){
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Deconnexion Reussi']);
    }
    // fonction pour le mot de passe oublié
    public function Mpsasseoubli(Request $request){
        $request->validate([
            'email'=>'required|email'
        ]);
        $status = Password::sendResetLink($request->only('email'));
        return $status == Password::RESET_LINK_SENT
        ? back()->with('status', __($status))
        : back()->withInput()->withErrors(['email' => __($status)]);
    }
     
    

}
