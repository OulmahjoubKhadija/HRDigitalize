<?php

namespace App\Providers;

use App\Models\Salarie;

// use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Auth\Notifications\ResetPassword;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // Salarie::class => \App\Policies\SalariePolicy::class,
        \App\Models\Salarie::class   => \App\Policies\SalariePolicy::class,
        \App\Models\Societe::class   => \App\Policies\SocietePolicy::class,
        \App\Models\Stagiaire::class => \App\Policies\StagiairePolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        ResetPassword::createUrlUsing(function ($notifiable, string $token) {
            return "http://localhost:5173/reset-password?token={$token}&email={$notifiable->email}";
        });
    }
}
