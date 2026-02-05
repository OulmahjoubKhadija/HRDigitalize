<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\ActivationCodeMail;
use Carbon\Carbon;

class ActivationController extends Controller
{
    public function activate(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'registration_code' => 'required|string',
            'password' => 'required|min:8|confirmed',
        ]);

        // First check in Users table
        $user = User::where('email', $request->email)
            ->where('registration_code', $request->registration_code)
            ->where('is_active', false)
            ->first();

        if (!$user) {
            return response()->json([
                'message' => 'Code invalide ou compte déjà activé'
            ], 422);
        }

        // Check if code expired
        if (!$user->activation_expires_at || Carbon::now()->greaterThan($user->activation_expires_at)) {
            return response()->json([
                'message' => 'Code d’activation expiré'
            ], 403);
        }

        // Activate account
        $user->password = Hash::make($request->password);
        $user->registration_code = null;
        $user->activation_expires_at = null;
        $user->is_active = true;
        $user->save();

        return response()->json([
            'message' => 'Compte activé avec succès, vous pouvez maintenant vous connecter.'
        ]);
    }

    public function resendActivationCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $user = User::where('email', $request->email)
            ->where('is_active', false)
            ->first();

        if (!$user) {
            return response()->json([
                'message' => 'Utilisateur déjà activé ou introuvable'
            ], 400);
        }

        $newCode = rand(100000, 999999);
        $user->registration_code = $newCode;
        $user->activation_expires_at = now()->addHours(72);
        $user->save();

        Mail::to($user->email)->send(new ActivationCodeMail($newCode, $user->email));

        return response()->json([
            'message' => 'Nouveau code d’activation envoyé avec succès'
        ]);
    }
}
