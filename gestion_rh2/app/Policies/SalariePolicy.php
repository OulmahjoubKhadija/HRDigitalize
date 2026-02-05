<?php

namespace App\Policies;

use App\Models\Salarie;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class SalariePolicy
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
    public function view(User $user, Salarie $salarie): bool
    {
         // RH can view all
        return in_array($user->role, ['RH', 'SALARIE', 'CHEF_SERVICE']);

        // A user can view only their own profile
         return $user->salarie_id === $salarie->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user)
    {
        // Only RH can create salariés
        return $user->role === 'RH';
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Salarie $salarie)
    {
        // RH can update any salarié
        if ($user->role === 'RH') {
            return true;
        }

        // A normal user can update only their own profile
        return $user->salarie_id === $salarie->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Salarie $salarie): bool
    {
        return $user->role === 'RH';
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Salarie $salarie): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Salarie $salarie): bool
    {
        return false;
    }
}
