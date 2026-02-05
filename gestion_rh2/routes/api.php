<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RH\SalarieController;
use App\Http\Controllers\Auth\ActivationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SocieteController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\StagiaireController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

// Public
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/activate-account', [ActivationController::class, 'activate']);
Route::post('/resend-activation-code', [ActivationController::class, 'resendActivationCode']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);

Route::post('/reset-password', function (Request $request) {

    $request->validate([
        'token' => 'required',
        'email' => 'required|email',
        'password' => 'required|min:8|confirmed',
    ]);

    $status = Password::reset(
        $request->only(
            'email',
            'password',
            'password_confirmation',
            'token'
        ),
        function ($user, $password) {
            $user->password = Hash::make($password);
            $user->save();
        }
    );

    if ($status !== Password::PASSWORD_RESET) {
        return response()->json([
            'message' => __($status)
        ], 400);
    }

    return response()->json([
        'message' => 'Mot de passe réinitialisé avec succès'
    ]);
});

//Protected
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/complete-profile', [SalarieController::class, 'completeProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/stagiaire/complete-profile', [StagiaireController::class, 'completeProfile']);
    Route::post('/stagiaire/logout', [AuthController::class, 'logout']);

    Route::middleware('is.profile.completed')->group(function () {

        Route::get('/me/employee', [SalarieController::class, 'me']);
        Route::put('/me/employee', [SalarieController::class, 'updateMe']);
        Route::post('/me/employee/delete', [SalarieController::class, 'deleteMe']);
        // Route::apiResource('salaries', SalarieController::class);
        
        
        Route::prefix('salaries')->group(function () {

            // List all salaries
            Route::get('/', [SalarieController::class, 'index']); // GET /api/salaries

            // Archives
            Route::get('archives', [SalarieController::class, 'archives']); // GET /api/salaries/archives

            // Restore & force delete
            Route::patch('{salarie}/restore', [SalarieController::class, 'restore']); // PATCH /api/salaries/{salarie}/restore
            Route::delete('{salarie}/force', [SalarieController::class, 'forceDelete']); // DELETE /api/salaries/{salarie}/force

            // Standard CRUD
            Route::get('{salarie}', [SalarieController::class, 'show']); // GET /api/salaries/{salarie}
            Route::put('{salarie}', [SalarieController::class, 'update']); // PUT /api/salaries/{salarie}
            Route::delete('{salarie}', [SalarieController::class, 'destroy']); // DELETE /api/salaries/{salarie}

        });

        Route::middleware('is.not.stagiaire')->group(function () {
            Route::get('/societe', [SocieteController::class, 'index']);
            Route::get('/societe/{id}', [SocieteController::class, 'show']);

            Route::get('/service', [ServiceController::class, 'index']);
            Route::get('/service/{id}', [ServiceController::class, 'show']);
        });

        Route::get('/service/societe/{societe_id}', [ServiceController::class, 'getBySociete']);

        Route::get('stagiaires/archives', [StagiaireController::class, 'archives']);
        Route::patch('stagiaires/{stagiaire}/restore', [StagiaireController::class, 'restore']);
        Route::delete('stagiaires/{stagiaire}/force', [StagiaireController::class, 'forceDelete']);
        Route::apiResource('stagiaires', StagiaireController::class);

        Route::get('/me/stagiaire', [StagiaireController::class, 'showMe']);
        Route::put('/me/stagiaire', [StagiaireController::class, 'updateMe']);
        Route::post('/me/stagiaire/delete', [StagiaireController::class, 'deleteMe']);

    });
});

Route::middleware(['auth:sanctum', 'role:RH'])->group(function () {

    // Societe CRUD
    Route::post('/societe', [SocieteController::class, 'store']);
    Route::put('/societe/{societe}', [SocieteController::class, 'update']);
    Route::delete('/societe/{id}', [SocieteController::class, 'destroy']);
    Route::patch('/societes/{societe}/archive', [SocieteController::class, 'archive']);


    // Service CRUD
    Route::post('/service', [ServiceController::class, 'store']);
    Route::put('/service/{id}', [ServiceController::class, 'update']);
    Route::delete('/service/{id}', [ServiceController::class, 'destroy']);
    Route::get('/service/archives', [ServiceController::class, 'archives'])
        ->name('services.archives');
});
