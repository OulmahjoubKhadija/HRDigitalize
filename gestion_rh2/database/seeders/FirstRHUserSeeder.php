<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Salarie;
use App\Models\Societe;
use App\Models\Service;

class FirstRHUserSeeder extends Seeder
{
    public function run(): void
    {
        //  Société
        $societe = Societe::factory()->create([
            'nom' => 'Société Principale',
            'adresse'=>'RABAT AGDALE',
            'telephone'=>'0811334422',
            'email' => 'contact@societe-principale.com',
            'activite'=>'Informatique',
            'if'=>'12213443',
            'cnss'=>'23443256',
            'rc'=>'110094563',
            'ice' => '001234567890123',
        ]);

        //  Service
        $service = Service::factory()->create([
            'nom' => 'Ressources Humaines',
            'societe_id' => $societe->id,
        ]);

        //  Salarié RH
        $salarie = Salarie::create([
            'user_id' => null,
            'cin' => 'RH0001',
            'nom' => 'RH',
            'prenom' => 'Admin',
            'sexe' => 'homme',
            'email' => 'admin.rh@example.com',
            'telephone' => '0600000000',
            'poste' => 'Responsable RH',
            'date_embauche' => now(),
            'linkedin' => null,
            'github' => null,
            'role' => 'RH',
            'status' => 'actif',
            'societe_id' => $societe->id,
            'service_id' => $service->id,
        ]);

        //  User RH lié
        $user = User::create([
            'name' => $salarie->prenom . ' ' . $salarie->nom,
            'email' => $salarie->email,
            'password' => Hash::make('password123'),
            'salarie_id' => $salarie->id,
            'registration_code' => null,
            'activation_expires_at' => null,
            'is_active' => 1,
            'role' => 'RH',
        ]);

         // Link user to salarie
        $salarie->user_id = $user->id;
        $salarie->save();
    }
    
}
