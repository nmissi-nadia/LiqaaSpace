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
    public function Mpsasseoubli(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        // En développement, simuler l'envoi
        if (app()->environment('local')) {
            return response()->json([
                'status' => 'success',
                'message' => 'Lien de réinitialisation envoyé (simulé en développement)'
            ]);
        }

        // Code de production
        $status = Password::sendResetLink($request->only('email'));
        return $status === Password::RESET_LINK_SENT
            ? response()->json(['status' => __($status)])
            : response()->json(['email' => __($status)], 422);
    }
    // fonction pour reset mot de passe 
    public function resetMps(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user) use ($request) {
                $user->forceFill([
                    'password' => Hash::make($request->password),
                    'remember_token' => Str::random(60),
                ])->save();
                
                event(new PasswordReset($user));
            }
        );

        // Retourne une réponse JSON claire
        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'status' => 'success',
                'message' => 'Le mot de passe a été réinitialisé avec succès.'
            ]);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Impossible de réinitialiser le mot de passe. Veuillez vérifier vos informations.'
        ], 422);
    }
    // fonction pour changer le mot de passe
    public function changeMps(Request $request){
        $request->validate([
            'password'=>'required|string|min:8|confirmed',
        ]);
        $user = Auth::user();
        $user->forceFill([
            'password'=>Hash::make($request->password),
            'remember_token'=>Str::random(60),
        ])->setRememberToken(Str::random(60));
        $user->save();
        event(new PasswordReset($user));
        return response()->json([
            'status' => 'Mot de passe reinitialise avec succes'
        ]);
    }
    

}
