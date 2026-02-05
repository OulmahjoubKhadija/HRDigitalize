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

    // DELETE /service/{id}
    public function destroy(Service $service)
    {
        $user = auth()->user();

        if ($user->role !== 'RH') {
            abort(403, "Vous n'êtes pas autorisé(e) à archiver ce service.");
        }

        // Check if any active salaries linked to this service
        $hasActiveSalaries = $service->salaries()
            ->whereHas('user', function ($query) {
                $query->where('is_active', true);
            })
            ->exists();

        // Check if any active stagiaires linked to this service
        $hasActiveStagiaires = $service->stagiaires()
            ->whereHas('stagiaireUser', function ($query) {
                $query->where('is_active', true);
            })
            ->exists();

            $activeSalaries = $service->salaries()->with('user')->get();

            foreach ($activeSalaries as $s) {
                Log::info('Salarie: '.$s->nom.' - UserID: '.$s->user_id.' - User Active: '.($s->user?->is_active ? 'true' : 'false'));
            }


        if ($hasActiveSalaries || $hasActiveStagiaires) {
            return response()->json([
                'message' => 'Impossible d’archiver ce service : utilisateurs actifs liés.'
            ], 403);
        }

        // Archive the service instead of deleting
        $service->update([
            'is_archived' => true,
        ]);

        return response()->json([
            'message' => 'Service archivé avec succès.'
        ]);
    }

    // ARCHIVE THE DELETED SOCIETES
    public function archives()
    {
        $user = auth()->user();

        if ($user->role !== 'RH') {
            abort(403, "Vous n'êtes pas autorisé(e) à consulter les services archivés.");
        }

        // Fetch all archived services
        $archivedServices = Service::where('is_archived', true)->get();

        return response()->json([
            'data' => $archivedServices,
            'message' => 'Services archivés récupérés avec succès.'
        ]);
    }



}
