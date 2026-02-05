<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckProfileCompleted
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        // If profile already completed → redirect or abort
        if ($user && !$user->is_profile_completed) {
            return response()->json([
                'message' => "Veuillez d'abord compléter votre profil"
            ], 403);
        }

        return $next($request);
    }
}
