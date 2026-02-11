# iut-symfony - Accès / Identifiants

Identifiants de connexion pour l'environnement de développement / test.

## Enseignant (teacher)
- Email : simon.daubrege@etu.univ-amu.fr
- Mot de passe : mdp

## Étudiant (student)
- Email : lacombedorian25@gmail.com
- Mot de passe : mdp

## Démarrage / Lancer les environnements

- Frontend / assets :
  - Installer les dépendances si nécessaire : `npm install`
  - Lancer le serveur de développement des assets : `npm run dev`

- Backend (Symfony) :
  - Démarrer le serveur Symfony : `symfony serve`
  - Le projet attend généralement que le serveur Symfony fournisse l'API et les routes.

Remarque rapide sur API Platform :
- API Platform fonctionne de manière fiable avec `symfony serve` (requis pour certaines intégrations et le comportement attendu).
- Si vous rencontrez des problèmes avec la connexion avec l'API en utilisant `symfony serve`, essayez ponctuellement de tester avec le serveur PHP intégré : `php -S 127.0.0.1:8000 -t public`. Sur certains postes, cela règle les soucis.