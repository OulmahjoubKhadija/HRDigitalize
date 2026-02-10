<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ServiceController extends Controller
{
    // GET /service
    public function index(Request $request)
    {
        $search = $request->query('search');
        $perPage = $request->query('per_page', 10);

        $services = Service::with('societe')
            ->where('is_archived', false) 
            ->when($search, function ($query) use ($search) {
                $query->where('nom', 'like', "%$search%");
            })
            ->paginate($perPage);

        return response()->json($services);
    }


    // GET /service/{id} (get service by ID)
    public function show($id)
    {
        $service = Service::find($id);
        if (!$service) {
            return response()->json(['message' => 'Service non trouvé'], 404);
        }
        return response()->json($service);
    }

    // GET /service/societe/{societe_id} (get services of a societe)
    public function getBySociete($societe_id)
    {
        $services = Service::where('societe_id', $societe_id)->get();
        return response()->json($services);
    }

    // POST /service
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'societe_id' => 'required|exists:societe,id',
        ]);

        $service = Service::create($validated);

        return response()->json(['message' => 'Service créé avec succès', 'service' => $service], 201);
    }

    // PUT/PATCH /service/{id}
    public function update(Request $request, $id)
    {
        $service = Service::find($id);
        if (!$service) {
            return response()->json(['message' => 'Service non trouvé'], 404);
        }

        $validated = $request->validate([
            'nom' => 'sometimes|required|string|max:255',
            'societe_id' => 'sometimes|required|exists:societe,id',
        ]);

        $service->update($validated);

        return response()->json(['message' => 'Service mis à jour', 'service' => $service]);
    }

    // SOFT DELETE /service/{id}
    public function destroy(Service $service)
    {
        $user = auth()->user();

        if ($user->role !== 'RH') {
            abort(403, "Vous n'êtes pas autorisé(e) à archiver ce service.");
        }

        // Check if any active salaries linked to this service
        $hasActiveSalaries = $service->salaries()
            ->whereNotNull('user_id')
            ->whereHas('user', function ($query) {
                $query->withoutGlobalScopes()
                      ->where('is_active', true);
            })
            ->exists();

        // Check if any active stagiaires linked to this service
        $hasActiveStagiaires = $service->stagiaires()
            ->whereNotNull('user_id')
            ->whereHas('stagiaireUser', function ($query) {
                $query->withoutGlobalScopes()
                      ->where('is_active', 1);
            })
            ->exists();


        if ($hasActiveSalaries || $hasActiveStagiaires) {
            return response()->json([
                'message' => 'Impossible d’archiver ce service : utilisateurs actifs liés.'
            ], 403);
        }

        // Archive the service instead of deleting
        $service->update([
            'is_archived' => true,
            'archived_at' => now(),
        ]);

        return response()->json([
            'message' => 'Service archivé avec succès.'
        ]);
    }

    // ARCHIVE THE DELETED SOCIETES
    public function archives(Service $service)
    {
        $user = auth()->user();

        if ($user->role !== 'RH') {
            abort(403, "Vous n'êtes pas autorisé(e) à consulter les services archivés.");
        }

        $archivedServices = Service::with(['societe'])
            ->where('is_archived', true)
            ->get();
        
        return response()->json([
            'data' => $archivedServices,
            'message' => 'Services archivés récupérés avec succès.'
        ]);
    }


    public function restore($id)
    {
        $service = Service::where('id', $id)->where('is_archived', true)->first();

        if (!$service) {
            return response()->json(['message' => 'Service non trouvé ou déjà actif'], 404);
        }

        // Restore
        $service->is_archived = false;
        $service->archived_at = null;
        $service->save();

        return response()->json([
            'data' => $service,
            'message' => 'Service restauré avec succès.'
        ]);
    }


}
