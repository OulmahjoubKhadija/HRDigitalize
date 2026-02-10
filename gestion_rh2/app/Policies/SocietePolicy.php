<?php

namespace App\Policies;

use App\Models\Societe;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class SocietePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['RH', 'SALARIE', 'CHEF_SERVICE', 'STAGIAIRE']);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Societe $societe): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->role === 'RH';
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Societe $societe): bool
    {
        return $user->role === 'RH';
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user): bool
    {
        return $user->role === 'RH';
    }

    /**
     * Determine whether the user can restore the model.
     */


     public function restore(User $user): bool
     {
        return $user ->role === 'RH';
     }

    /**
     * Determine whether the user can permanently delete the model.
     */

    
    // public function forceDelete(User $user, Societe $societe): bool
    // {
    //     //
    // }

    public function viewArchived(User $user): bool
    {
        return $user->role === 'RH';
    }

}
