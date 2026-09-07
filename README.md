# Enosh. Graphist. — V2

Version améliorée du portfolio, prête pour GitHub Pages.

## Important
- L'intégration Supabase est conservée.
- Authentification : Supabase Auth (email + mot de passe).
- Tables utilisées : `projects` et `project_images`.
- Storage utilisé : `portfolio`.
- Aucun changement SQL n'est requis par cette V2. Le formulaire n'exige pas de colonne `sector` dans `projects`.
- Les images sont compressées côté navigateur puis envoyées au bucket `portfolio`.

## Déploiement
1. Remplacer les fichiers du dépôt par ceux de ce dossier.
2. Conserver `index.html`, `style.css`, `script.js` et `favicon.svg` à la racine.
3. Envoyer sur GitHub.
4. Attendre le déploiement GitHub Pages.

## Sauvegarde
Avant remplacement, conserver une copie de l'ancienne version. Le bouton « Exporter JSON » reste disponible dans l'administration pour exporter les projets en ligne.
