<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class StagiaireMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if ($user->role === 'STAGIAIRE') {
            return response()->json([
                'message' => 'Accès refusé pour les stagiaires'
            ], 403);
        }

        return $next($request);
    }
}
