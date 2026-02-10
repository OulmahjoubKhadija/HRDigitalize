<?php

namespace App\Http\Controllers;

use App\Models\Societe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\SocieteResource;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;


class SocieteController extends Controller
{
    // GET /societe
    public function index(Request $request)
    {
        $this->authorize('viewAny', Societe::class);

        $search = $request->query('search');
        $perPage = $request->query('per_page', 10);

        $societes = Societe::where('is_archived', false)
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nom', 'like', "%$search%")
                    ->orWhere('activite', 'like', "%$search%")
                    ->orWhere('telephone', 'like', "%$search%")
                    ->orWhere('fax', 'like', "%$search%");
                });
            })
            ->paginate($perPage);

        return SocieteResource::collection($societes);
    }




    // GET /societe/{id}
    public function show(Societe $societe , $id)
    {
        $this->authorize('view', $societe);

        $societe = Societe::find($id);
        if (!$societe) {
            return response()->json(['message' => 'Société non trouvée'], 404);
        }

        return new SocieteResource($societe);
    }

    // POST /societe
    public function store(Request $request)
    {
        $this->authorize('create', Societe::class);

        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'adresse' => 'required|string|max:255',
            'email'      => 'required|email|unique:societe,email',
            'logo' => 'required|file|mimes:png,svg|max:2048',
            'telephone' => 'required|string|max:50',
            'fax' => 'nullable|string|max:50',
            'activite' => 'nullable|string|max:255',
            'if' => 'nullable|string|max:100',
            'cnss' => 'nullable|string|max:100',
            'rc' => 'nullable|string|max:100',
            'ice' => 'nullable|string|max:100',
            'patente' => 'nullable|string|max:100',
        ]);

        // Handle logo upload
        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('logos', 'public');
            $validated['logo'] = $path;
        }

        $societe = Societe::create($validated);

        return response()->json([
                'message' => 'Société créée avec succès',
                'societe' => new SocieteResource($societe)
            ], 201);
    }

    // PUT/PATCH /societe/{id}
    public function update(Request $request, Societe $societe)
    {
        $this->authorize('update', $societe);

        $validated = $request->validate([
            'nom' => 'sometimes|required|string|max:255',
            'email'      => 'required|email|unique:societe,email',
            'adresse' => 'sometimes|required|string|max:255',
            'logo' => 'sometimes|nullable|image|max:2048',
            'telephone' => 'sometimes|required|string|max:50',
            'fax' => 'nullable|string|max:50',
            'activite' => 'nullable|string|max:255',
            'if' => 'nullable|string|max:100',
            'cnss' => 'nullable|string|max:100',
            'rc' => 'nullable|string|max:100',
            'ice' => 'nullable|string|max:100',
            'patente' => 'nullable|string|max:100',
        ]);

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('logos', 'public');
        }

        $societe->update($validated);

        Log::info('UPDATED SOCIETE', [
            'id' => $societe->id,
            'updated_fields' => $validated
        ]);

        return response()->json([
            'societe' => new SocieteResource($societe),
        ]);
    }



    // SOFT DELETE /societe/{id}
    public function destroy(Societe $societe)
    {
        $this->authorize('delete', $societe);

        // Check active users
        $hasActiveUsers =
            $societe->salaries()
                ->whereHas('user', fn ($q) =>
                    $q->withoutGlobalScopes()->where('is_active', 1)
                )
                ->exists()
            ||
            $societe->stagiaires()
                ->whereHas('stagiaireUser', fn ($q) =>
                    $q->withoutGlobalScopes()->where('is_active', 1)
                )
                ->exists();

        if ($hasActiveUsers) {
            return response()->json([
                'message' => 'Impossible d’archiver la société : utilisateurs actifs liés.'
            ], 403);
        }

        DB::transaction(function () use ($societe) {

            // Archive services FIRST
            foreach ($societe->services as $service) {

                $hasActiveServiceUsers =
                    $service->salaries()
                        ->whereHas('user', fn ($q) =>
                            $q->withoutGlobalScopes()->where('is_active', 1)
                        )
                        ->exists()
                    ||
                    $service->stagiaires()
                        ->whereHas('stagiaireUser', fn ($q) =>
                            $q->withoutGlobalScopes()->where('is_active', 1)
                        )
                        ->exists();

                if ($hasActiveServiceUsers) {
                    throw new \Exception(
                        "Impossible d’archiver le service {$service->nom} : utilisateurs actifs liés."
                    );
                }

                $service->update([
                    'is_archived' => true,
                    'archived_at' => now(),
                ]);
            }

            // Archive societe LAST
            $societe->update([
                'is_archived' => true,
                'archived_at' => now(),
            ]);
        });

        return response()->json([
            'message' => 'Société et services archivés avec succès.'
        ]);
    }


    // ARCHIVE THE DELETED SOCIETES
    public function archives(Societe $societe)
    {
        $this->authorize('viewArchived', Societe::class);

        $archivedSociete = Societe::where('is_archived', true)->get();

        return SocieteResource::collection($archivedSociete);
    }

    // RESTORE THE SOCIETES
    public function restore(Societe $societe)
    {
      $this->authorize('restore', Societe::class); 
      
      if (!$societe) {
        return response()->json(['message' => 'Société introuvable.'], 404);
      }

      if (!$societe->is_archived) {
        return response()->json(['message' => 'La société est déjà non archivé.'], 400);
      }

      $societe->update([
                'is_archived' => false,
            ]);

        return response()->json([
            'message' => 'La société a été restauré avec succès.',
            'societe_id' => $societe->id
        ]);

    }
}

