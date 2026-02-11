<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Log;
use App\Models\Salarie;

class AuthController extends Controller
{
    // LOGIN
    public function login(Request $request) 
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            Log::info('User salarie_id', ['salarie_id' => $user->salarie_id]);
            Log::info('Salarie exists?', ['salarie' => $user->salarie]);
            return response()->json(['message' => 'Email ou mot de passe incorrect'], 401);
        }

        // Check if archived BEFORE password
        if ($user->is_archived) {
            return response()->json([
                'message' => 'Votre compte est archivé. Veuillez contacter les ressources humaines.'
            ], 403);
        }

        // Now check password
        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Email ou mot de passe incorrect'], 401);
        }

        if (!$user->is_active) {
            return response()->json(['message' => 'Compte non activé. Veuillez activer votre compte.'], 403);
        }

        $token = $user->createToken('user-token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'role' => $user->role,
                'salarie_id' => $user->salarie_id,
                'is_profile_completed' => (bool) $user->is_profile_completed,
                'salarie_id' => $user->salarie_id,
            ],
        ]);
    }

    // LOGOUT
    public function logout(Request $request)
    {
        $user = $request->user();
        if ($user && $user->currentAccessToken()) {
            $user->currentAccessToken()->delete();
        }

        return response()->json(['message' => 'Déconnexion réussie']);
    }

    // REGISTER
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|confirmed|min:6',
            'role' => 'required|string|in:USER,STAGIAIRE',
        ]);

        $activationCode = rand(100000, 999999);

        $salarie = Salarie::create([
            'email' => $validated['email'],
            'nom' => $validated['name'],
            'user_id' => null,
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role' => $validated['role'],
            'activation_code' => $activationCode,
            'activation_expires_at' => now()->addHours(72),
            'is_active' => false,
            'salarie_id' => $salarie->id,
        ]);
        $salarie->user_id = $user->id;
        $salarie->save();

        return response()->json([
            'message' => 'Compte créé. Veuillez activer votre compte.',
            'user_id' => $user->id
        ], 201);
    }
    
    // Forgot Password
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        Password::sendResetLink(
            $request->only('email') 
        );

        return response()-> json([
            'message' => 'Siceteamilexiste, un lien de réinilisation a été envoyé'
        ]);
    }

}
