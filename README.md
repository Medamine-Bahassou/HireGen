<img src="https://github.com/user-attachments/assets/26bf631c-1ae7-4113-91cf-c09faf1981b2" width="150px" />

# HireGen

## Description
Cette application est un **générateur de fiches de mission alimenté par l'IA**, conçu pour aider les recruteurs à créer rapidement et efficacement des descriptions de mission complètes. À partir d'une brève description textuelle, l'application utilise l'IA de Groq pour générer une fiche de mission structurée au format JSON, qui peut ensuite être gérée et consultée.

### Fonctionnalités Clés :
*   **Génération de Fiches de Mission par IA**: Créez des fiches de mission détaillées et structurées à partir de descriptions textuelles concises, grâce à l'intégration de l'API Groq.
    *   **Prompt Système et Réponse**: Le chat IA est configuré pour recevoir un prompt système qui guide son comportement et son contexte, spécialisé dans la création de fiches de mission. Ce prompt système est défini dans le fichier `hiregen1.client/src/components/GroqChat.jsx`. Les réponses de l'IA sont formatées en JSON, contenant toutes les informations nécessaires pour une fiche de mission complète.
*   **Gestion et Modification des Missions**: Les fiches de mission générées sont automatiquement sauvegardées et peuvent être consultées et modifiées via une interface dédiée.
*   **Historique des Missions**: Accédez à un historique complet de toutes les fiches de mission générées et sauvegardées.

## Technologies Utilisées

### Frontend
*   **React**: Une bibliothèque JavaScript pour la construction d'interfaces utilisateur.
*   **Vite**: Un outil de build rapide pour les projets web modernes.
*   **CSS**: Pour le style de l'application.

### Backend
*   **.NET 8**: Une plateforme de développement gratuite, multiplateforme et open-source pour la création de nombreux types d'applications.
*   **ASP.NET Core**: Un framework pour la création d'applications et de services web avec .NET.
*   **Entity Framework Core**: Un mappeur objet-relationnel (ORM) pour .NET.
*   **MySQL**: Un système de gestion de base de données relationnelle.

## Installation

Pour configurer le projet localement, suivez ces étapes :

### 1. Cloner le dépôt
```bash
git clone https://github.com/your-username/hiregen1.git
cd hiregen1
```

### 2. Configuration du Backend (hiregen1.Server)

Naviguez vers le répertoire `hiregen1.Server` :
```bash
cd hiregen1.Server
```

#### Installer les Dépendances .NET
```bash
dotnet restore
```

#### Configuration de la Base de Données
Ce projet utilise MySQL avec Entity Framework Core.
1.  Assurez-vous qu'un serveur MySQL est en cours d'exécution.
2.  Mettez à jour la chaîne de connexion dans `hiregen1.Server/appsettings.json` et `hiregen1.Server/appsettings.Development.json` pour pointer vers votre base de données MySQL.
    ```json
    "ConnectionStrings": {
      "DefaultConnection": "Server=localhost;Port=3306;Database=hiregen1db;Uid=your_user;Pwd=your_password;"
    }
    ```
3.  Appliquez les migrations de base de données :
    ```bash
    dotnet ef database update
    ```

### 3. Configuration du Frontend (hiregen1.client)

Naviguez vers le répertoire `hiregen1.client` :
```bash
cd hiregen1.client
```

#### Installer les Dépendances Node.js
```bash
npm install
```

#### Variables d'Environnement
Créez un fichier `.env` dans le répertoire `hiregen1.client` et ajoutez votre clé API Groq :
```
VITE_GROQ_API_KEY=votre_cle_api_groq_ici
```

## Exécution du Projet

### 1. Démarrer le Backend (hiregen1.Server)

Depuis le répertoire `hiregen1.Server` :
```bash
dotnet run
```
Cela démarrera le backend ASP.NET Core, généralement sur `https://localhost:7000` ou un port similaire.

### 2. Démarrer le Frontend (hiregen1.client)

Depuis le répertoire `hiregen1.client` :
```bash
npm run dev
```
Cela démarrera le serveur de développement React, généralement sur `http://localhost:5173` ou un port similaire. Le frontend transmettra les requêtes API au backend.

## Captures d'Écran

### Page d'Accueil
![image](https://github.com/user-attachments/assets/a5562337-5815-426c-8203-2efbfef1dc80)

**Après generation:**

| ![image](https://github.com/user-attachments/assets/9d2cbc8f-1ca6-4eef-a848-8bd008ccd9e4) | ![image](https://github.com/user-attachments/assets/354ad0cd-8d0a-43d2-b128-758228888e25) | 
|---|---|


### Historique des Missions
![image](https://github.com/user-attachments/assets/92f01a06-aa42-4492-b12a-4c3079fbd3e4)
![image](https://github.com/user-attachments/assets/c98a7429-c410-4c4c-886a-75c386533ee2)


## Réaliser par
* Mohamed Amine BAHASSOU
* Hodaifa ECHFFANI

## Encadré par
* Hassan ZILI
