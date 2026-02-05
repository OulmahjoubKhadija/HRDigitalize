# GestionRH

GestionRH est une application web de gestion des ressources humaines  
développée avec **Laravel (backend)** et **React (frontend)**.

Cette application a été conçue pour moderniser la gestion des ressources humaines en centralisant toutes les opérations essentielles dans une seule plateforme. Elle permet aux équipes RH de gérer les collaborateurs, les documents et les processus internes de manière simple, rapide et sécurisée, tout en réduisant les tâches répétitives et en améliorant l’efficacité globale.

The system manages:

* Employees (Salaries)
* Interns (Stagiaires)
* Services & sociétés
* Authentication & roles (RH, SALARIE , CHEF_SERVICE)
* Téléchargements de fichiers (CVs, profile photos ...)
* Email notifications

---

## Technologies utilisées

### Backend

* Laravel 10
* PHP 8+
* MySQL
* Laravel Sanctum (authentification)
* Stockage des fichiers (storage/app/public)

### Frontend

* React (Vite)
* Axios
* CSS

---

## Structure du projet

```
GestionRH/
├── gestion_rh2/        # Laravel backend
├── gestion_rh-front/   # React frontend
└── README.md
```

---

## Configuration du backend (Laravel)

### Prérequis

* PHP 8+
* Composer
* MySQL

### Installation

1. Accéder au dossier backend :

```bash
cd gestion_rh2
```

2. Installer les dépendances :

```bash
composer install
```

3. Créer le fichier d’environnement :

```bash
cp .env.example .env
```

4. Générer la clé de l’application :

```bash
php artisan key:generate
```

5. Configurer la base de données dans le fichier .env :

* DB_DATABASE=nom_de_la_base
* DB_USERNAME=utilisateur
* DB_PASSWORD=mot_de_passe


6. Exécuter les migrations :

```bash
php artisan migrate
```

7. Créer le lien de stockage (obligatoire pour les photos et fichiers) :

```bash
php artisan storage:link
```

8. Lancer le serveur :

```bash
php artisan serve
```

Le serveur Backend sera accessible à l'adresse : `http://localhost:8000`

---

## Frontend Setup (React)

### Prérequis

* Node.js (v18+ recommandé)
* npm

### Installation

1. Accéder au dossier frontend :

```bash
cd gestion_rh-front
```

2. Installer les dépendances :

```bash
npm install
```

3. Installer  ces dépendances :
- React (Vite)
- Axios (requêtes HTTP)
- React Router DOM (navigation)
- React Hook Form & Yup (gestion et validation des formulaires)
- React Toastify (notifications)
- React Icons

Tu peux ajouter une section “Dépendances utilisées” avec cette commande unique

```bash
npm install react react-dom axios react-router-dom react-hook-form @hookform/resolvers yup react-toastify react-icons

```
4. Lancer l’application :

```bash
npm run dev
```

Le serveur Frontend sera accessible à l'adresse : `http://localhost:5173`

---

## Variables d’environnement

⚠️ Le fichier `.env` n’est **pas inclus** dans le dépôt GitHub pour des raisons de sécurité.

Vous devez configurer manuellement :

La base de données

L’URL de l’application

La configuration email (SMTP)

Un fichier `.env.example` peut être utilisé comme référence.

---

## Stockage des fichiers

Les fichiers (photos de profil, CV, etc.) sont stockés dans :

```
storage/app/public
```

Assurez-vous d’avoir exécuté :

```bash
php artisan storage:link
```

---


## Author

**Khadija Oul mahjoub (KO)**

Stagiaire en développement web Full-Stack
