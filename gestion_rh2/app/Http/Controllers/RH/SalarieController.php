<?php

namespace App\Http\Controllers\RH;

use App\Http\Controllers\Controller;
use App\Models\Salarie;
use App\Models\User;
use App\Http\Resources\SalarieResource;
use App\Mail\ActivationCodeMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\Stagiaire;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;


class SalarieController extends Controller
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;
    
    /* =======================
       CREATE SALARIE (RH ONLY)
    ======================== */
    public function store(Request $request)
    {
        $this->authorize('create', Salarie::class);

        if (!auth()->user()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        Log::info('AUTH CHECK',[
            'user_id' => auth()->id(),
            'role' => auth()->user()->role,
            'salarie_id' => auth()->user()->salarie_id,
        ]);


        // Validation: RH phase (minimal required data)
        $validated = $request->validate([
            'nom'        => 'required|string|max:255',
            'prenom'     => 'required|string|max:255',
            'email'      => 'required|email|unique:salarie,email',
            'role'       => 'required|in:RH,SALARIE,CHEF_SERVICE',
            'societe_id' => 'required|exists:societe,id',
            'service_id' => 'required|exists:service,id',

            // Optional at creation (RH may or may not fill)
            'poste'         => 'nullable|string|max:255',
            'date_embauche' => 'nullable|date',
        ]);

        // Default & deferred fields (filled later by the user)
        $validated = array_merge($validated, [
            'cin'       => null,
            'sexe'      => null,
            'cv'        => null,
            'photo'     => null,
            'adresse'   => null,
            'telephone' => null,
            'linkedin'  => null,
            'github'    => null,
            'status'    => 'actif',
        ]);

        DB::beginTransaction();

        try {
            // Create salarié
            $salarie = Salarie::create($validated);

            // Generate activation code
            $activationCode = Str::upper(Str::random(8));

            // Create user
            User::create([
                'salarie_id' => $salarie->id,
                'name'       => $salarie->nom. ' ' . $salarie->prenom,
                'email'      => $salarie->email,
                'password'   => null,
                'registration_code' => $activationCode,
                'activation_expires_at' => now()->addHours(72),
                'is_active'  => false,
                'role'       => $salarie->role,
            ]);

            DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Error creating salarié', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'Erreur lors de la création du salarié'
            ], 500);
        }

        // Send email (NON-BLOCKING)
        try {
            Mail::to($salarie->email)
                ->send(new ActivationCodeMail($activationCode, $salarie->email));
        } catch (\Exception $e) {
            Log::warning('Activation email not sent', [
                'email' => $salarie->email,
                'error' => $e->getMessage(),
            ]);
        }

        return response()->json([
            'message' => 'Salarié créé avec succès (email envoyé si possible)',
            'salarie' => new SalarieResource(
                $salarie->load(['societe', 'service'])
            )
        ], 201);

    }

    /* =======================
       LIST SALARIES
    ======================== */
    public function index(Request $request)
    {
        $search = $request->query('search');
        $perPage = $request->query('per_page', 10);

        $salaries = Salarie::with(['societe', 'service', 'user'])
            // Only active users
            ->whereHas('user', function ($q) {
                $q->where('is_active', true)
                  ->where('is_profile_completed', true);
            })
            // Search
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nom', 'like', "%$search%")
                    ->orWhere('prenom', 'like', "%$search%")
                    ->orWhere('cin', 'like', "%$search%")
                    ->orWhereHas('societe', function($q2) use ($search) {
                        $q2->where('nom', 'like', "%$search%");
                    })
                    ->orWhereHas('service', function($q3) use ($search) {
                        $q3->where('nom', 'like', "%$search%");
                    });
                });
            })
            ->paginate($perPage);

        return SalarieResource::collection($salaries);
    }

    /* =======================
       SHOW SALARIE
    ======================== */
    public function show(Salarie $salarie, $id)
    {
        $user = auth()->user();

        if ($user->role !== 'RH' && $salarie->user_id !== $user->id) {
            abort(403);
        }

        $salarie = Salarie::with(['societe', 'service'])->find($id);

        if (!$salarie) {
            return response()->json([
                'message' => 'Salarié not found'
            ], 404);
        }

        return new SalarieResource($salarie);
    }

    /* =======================
       UPDATE SALARIE
    ======================== */
    public function update(Request $request, $id)
    {
        $salarie = Salarie::find($id);

        if (!$salarie) {
            return response()->json([
                'message' => 'Salarié introuvable'
            ], 404);
        }

        $this->authorize('update', $salarie);

        $user = $request->user();

        if ($user->role !== 'RH') {
            return response()->json([
                'message' => 'Action non autorisée'
            ], 403);
        }

        $validated = $request->validate([
            'poste'         => 'sometimes|string|max:255',
            'role'          => 'sometimes|in:RH,SALARIE,CHEF_SERVICE',
            'societe_id'    => 'sometimes|exists:societe,id',
            'service_id'    => 'sometimes|exists:service,id',
            'date_embauche' => 'sometimes|date',
            'cin'           => 'sometimes|nullable|string|max:20',
            'status'        => 'sometimes|in:actif,en_conge,suspendu,demissionne,archive',
        ]);

        if (empty($validated)) {
            return response()->json([
                'message' => 'Aucune donnée à mettre à jour'
            ], 422);
        }

        $salarie->update($validated);

        $salarie->refresh()->load(['societe', 'service']);

        
        Log::info('UPDATED SALARIE', [
            'id' => $salarie->id,
            'updated_fields' => $validated
        ]);


        return new SalarieResource($salarie);
    }

    /* ===========================================================
       SOFT DELETE (deactivate the SALARIE account BY THE RH ONLY)
    ============================================================== */
    public function destroy(Salarie $salarie)
{
    $this->authorize('delete', $salarie);

    $user = $salarie->user;

    if (!$user) {
        return response()->json([
            'message' => 'Aucun compte utilisateur associé à ce salarié.'
        ], 404);
    }

    if ($user->is_archived) {
        return response()->json([
            'message' => 'Ce salarié est déjà archivé.'
        ], 400);
    }

    //prevent archiving active encadrant
    $isActiveEncadrant = Stagiaire::where('encadrant_id', $salarie->id)
        ->whereIn('user_id', function ($query) {
            $query->select('id')
                ->from('users')
                ->where('is_active', true);
        })
        ->exists();

    if ($isActiveEncadrant) {
        return response()->json([
            'message' => 'Impossible d’archiver ce salarié : il est encore encadrant d’un ou plusieurs stagiaires actifs.'
        ], 409); 
    }

    //Archive instead of delete
    $user->update([
        'is_archived' => true,
        'is_active' => false
    ]);

    return response()->json([
        'message' => 'Salarié archivé avec succès.'
    ]);
}

    /* ============================
       ARCHIVE THE DELETED SALARIE
    =============================== */
    public function archives(Request $request)
    {
        $search = $request->query('search');
        $perPage = $request->query('per_page', 10);

        $query = Salarie::with(['societe', 'service', 'user'])
            ->whereHas('user', fn($q) => 
            $q  ->where('is_archived', true)
                ->where('is_active', false)
                ->where('is_profile_completed', true)
            );

        if ($search) {
            $query->where(fn($q) =>
                $q->where('nom', 'like', "%{$search}%")
                ->orWhere('prenom', 'like', "%{$search}%")
                ->orWhere('cin', 'like', "%{$search}%")
            );
        }

        $salaries = $query->orderByDesc('id')->paginate($perPage);

        return SalarieResource::collection($salaries);
    }

    /* ===============================
       RESTORE THE ARCHIVED SALARIE
    ================================== */
    public function restore(Salarie $salarie)
    {
        $this->authorize('update', $salarie);

        $user = $salarie->user;

        if (!$user) {
            return response()->json(['message' => 'Utilisateur introuvable.'], 404);
        }

        if (!$user->is_archived) {
            return response()->json(['message' => 'Le salarié est déjà actif.'], 400);
        }

        $user->update([
                'is_archived' => false,
                'is_active' => true
            ]);

        return response()->json([
            'message' => 'Le salarié a été restauré avec succès.',
            'salarie_id' => $salarie->id
        ]);
    }

    /* ===============================
       PREMANENTLY DELETE THE SALARIE
    ================================== */
    public function forceDelete(Salarie $salarie)
{
    $this->authorize('delete', $salarie);

    $user = $salarie->user;

    if ($user && !$user->is_archived) {
        return response()->json([
            'message' => 'Vous devez d’abord archiver le salarié avant de le supprimer définitivement.'
        ], 400);
    }

    if ($user) $user->delete();

    $salarie->delete();

    return response()->json([
        'message' => 'Le salarié a été supprimé définitivement.'
    ]);
}



    /* ==========================
       COMPLETE PROFILE (BY USER)
    ========================== */
   public function completeProfile(Request $request)
    {
        $user = $request->user(); 

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $salarie = $user->salarie;

        if (!$salarie) {
            return response()->json(['message' => 'Aucun profil salarié associé'], 404);
        }

        $this->authorize('update', $salarie);

        // Validation
        $validator = Validator::make($request->all(), [
            'cin'       => 'required|string|max:20',
            'sexe'      => 'required|in:homme,femme',
            'adresse'   => 'required|string|max:255',
            'cv'        => 'nullable|file|mimes:pdf,doc,docx|max:2048',
            'photo'     => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'telephone' => 'required|string|max:20',
            'linkedin'  => 'nullable|string',
            'github'    => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validated = $validator->validated();

        // Handle files
        if ($request->hasFile('cv')) {
            $validated['cv'] = $request->file('cv')->store('cvs', 'public');
        }

        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('photos', 'public');
        }

        // 1. Create or update salarie profile
        $salarie->update($validated);

        // Mark profile as completed for the user
        $user->update(['is_profile_completed' => true]);

        return response()->json([
            'message' => 'Profil complété avec succès',
            'salarie' => $salarie,
            'user' => $user,
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();

        if (!$user || !$user->salarie_id) {
            return response()->json([
                'message' => 'Profil introuvable'
            ], 404);
        }

        $salarie = Salarie::with(['societe', 'service'])
            ->findOrFail($user->salarie_id);

        $this->authorize('view', $salarie);

        return new SalarieResource($salarie);
    }

    public function updateMe(Request $request)
    {
        $user = $request->user();

        if (!$user || !$user->salarie_id) {
            return response()->json(['message' => 'Profil introuvable'], 404);
        }

        $salarie = Salarie::find($user->salarie_id);

        $this->authorize('update', $salarie);

        if (!$salarie) {
            return response()->json(['message' => 'Salarié introuvable'], 404);
        }

        $rules = [
            'nom'       => 'sometimes|nullable|string|max:100',
            'prenom'    => 'sometimes|nullable|string|max:100',
            'sexe' => 'sometimes|nullable|in:homme,femme',
            'email'     => 'sometimes|nullable|email|max:255|unique:users,email,' . $user->id,
            'telephone' => 'sometimes|nullable|string|max:20',
            'adresse'   => 'sometimes|nullable|string|max:255',
            'linkedin'  => 'sometimes|nullable|url|max:255',
            'github'    => 'sometimes|nullable|url|max:255',
            'photo'     => 'sometimes|nullable|file|image|max:2048',
            'cv'        => 'sometimes|nullable|file|mimes:pdf,doc,docx|max:2048',
            'cin'       => 'sometimes|nullable|string|max:20',
        ];

        if ($user->role === 'RH') {
            $rules += [
                'date_embauche' => 'sometimes|nullable|date',
                'status'        => 'sometimes|in:actif,en_conge,suspendu,demissionne,archive',
                'societe_id'    => 'sometimes|nullable|exists:societe,id',
                'service_id'    => 'sometimes|nullable|exists:service,id',
                'poste'         => 'sometimes|nullable|string|max:100',
            ];
        }

        $validated = $request->validate($rules);

        // Handle files
        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('photos', 'public');
        }

        if ($request->hasFile('cv')) {
            $validated['cv'] = $request->file('cv')->store('cvs', 'public');
        }

        // Email sync
        if (isset($validated['email'])) {
            $user->update(['email' => $validated['email']]);
            $salarie->update(['email' => $validated['email']]);
            unset($validated['email']);
        }


        if (count($validated)) {
            $salarie->update($validated);
        }

        // resync users.name if nom OR prenom changed
        if (
            array_key_exists('nom', $validated) ||
            array_key_exists('prenom', $validated)
        ) {
            $salarie->refresh(); // get latest values

            $user->update([
                'name' => trim($salarie->nom . ' ' . $salarie->prenom),
            ]);
        }

        return response()->json([
            'message' => 'Profil mis à jour avec succès',
            'data' => new SalarieResource($salarie->fresh(['societe', 'service']))
        ]);

    }

    public function deleteMe(Request $request)
    {
        $user = $request->user();

        if (!$user || !$user->salarie_id) {
            return response()->json(['message' => 'Profil introuvable'], 404);
        }

        $salarie = Salarie::find($user->salarie_id);

        $this->authorize('update', $salarie);

        if (!$salarie) {
            return response()->json(['message' => 'Salarié introuvable'], 404);
        }

        // Handle deletions
        if ($request->has('delete_photo') && $request->delete_photo) {
            if ($salarie->photo) {
                Storage::disk('public')->delete($salarie->photo);
                $salarie->photo = null;
            }
        }

        if ($request->has('delete_cv') && $request->delete_cv) {
            if ($salarie->cv) {
                Storage::disk('public')->delete($salarie->cv);
                $salarie->cv = null;
            }
        }

        if ($request->has('delete_linkedin') && $request->delete_linkedin) {
            $salarie->linkedin = null;
        }

        if ($request->has('delete_github') && $request->delete_github) {
            $salarie->github = null;
        }

        $salarie->save();

        return response()->json([
            'message' => 'Les informations ont été supprimées avec succès',
            'data' => new SalarieResource($salarie->fresh(['societe', 'service'])),
        ]);
    }
}
