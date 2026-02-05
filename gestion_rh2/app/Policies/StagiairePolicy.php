<?php

namespace App\Policies;

use App\Models\Stagiaire;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class StagiairePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['RH', 'SALARIE', 'CHEF_SERVICE']);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Stagiaire $stagiaire): bool
    {
        // RH can view all
        if ($user->role === 'RH') {
            return true;
        }

        // Everyone else CAN SEE all stagiaires
        return in_array($user->role, ['SALARIE', 'CHEF_SERVICE', 'STAGIAIRE']);

        // Stagiaire can view his own profile
        if ($user->role === 'STAGIAIRE') {
            return $stagiaire->user_id === $user->id;
        }

        // Encadrant can view his stagiaires
        if (in_array($user->role, ['SALARIE', 'CHEF_SERVICE'])) {
            return $user->salarie
                && $stagiaire->encadrant_id === $user->salarie->id;
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return in_array($user->role, ['RH', 'SALARIE', 'CHEF_SERVICE']);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Stagiaire $stagiaire)
    {
        if ($user->role === 'RH') {
            return true;
        }

        if ($user->role === 'STAGIAIRE') {
            return $stagiaire->user_id === $user->id;
        }

        if (in_array($user->role, ['SALARIE', 'CHEF_SERVICE'])) {
            return $user->salarie
                && $stagiaire->encadrant_id === $user->salarie->id;
        }

        return in_array($user->role, ['RH', 'SALARIE', 'CHEF_SERVICE']);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Stagiaire $stagiaire): bool
    {
        return $user->role === 'RH';

    }

    /**
     * Determine whether the user can restore the model.
     */


     public function restore(User $user, Stagiaire $stagiaire): bool
     {
         return false;
     }

    /**
     * Determine whether the user can permanently delete the model.
     */


     public function forceDelete(User $user, Stagiaire $stagiaire): bool
     {
        return false;
     }
}
