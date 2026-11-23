# Hannout — Suivi de progression

Ce document permet de suivre l'avancement du développement de Hannout. Il est mis à jour après chaque étape terminée et testée.

## 1. Environnement et initialisation

- [x] Création du projet React Native avec Expo.
- [x] Configuration de l'environnement de développement.
- [x] Installation de Bun.
- [x] Configuration d'Expo Router.
- [x] Résolution des problèmes de compatibilité entre Expo Go et le SDK Expo.
- [x] Mise à jour des dépendances vers Expo SDK 58.
- [x] Vérification des dépendances avec `expo install --check`.
- [x] Vérification du projet avec `expo-doctor` : 20/20 contrôles réussis.
- [x] Lancement et test de l'application sur un téléphone Android avec Expo Go.

## 2. Structure et données

- [x] Création des types TypeScript pour les produits.
- [x] Création des types TypeScript pour les vendeurs.
- [x] Création des données JSON de démonstration pour les produits.
- [x] Création des données JSON de démonstration pour les vendeurs.
- [x] Organisation initiale des dossiers du projet.

## 3. Première interface utilisateur

- [x] Création du premier écran d'accueil.
- [x] Ajout du nom et de la présentation de Hannout.
- [x] Ajout du champ de recherche visuel.
- [x] Ajout des catégories avec des icônes.
- [x] Affichage des produits récents.
- [x] Affichage des images, prix, villes et types de vendeurs.
- [x] Test de l'interface sur téléphone Android.

## 4. Git et GitHub

- [x] Initialisation du suivi du projet avec Git.
- [x] Création des premiers commits.
- [x] Commit des types et des données de démonstration : `c4900c7`.
- [x] Commit de l'écran d'accueil et des produits : `4d39b2a`.
- [ ] Vérifier que le dernier commit est bien envoyé sur GitHub.

## 5. Cadrage du MVP

- [x] Définition du concept de Hannout.
- [x] Définition des fonctionnalités principales.
- [x] Définition du mode visiteur.
- [x] Définition de l'authentification simulée.
- [x] Définition du profil vendeur unique par utilisateur.
- [x] Définition des règles de gestion des produits.
- [x] Définition des statuts des produits.
- [x] Définition des favoris.
- [x] Définition de la recherche et des filtres.
- [x] Définition de la gestion des catégories.
- [x] Définition de la gestion des villes.
- [x] Définition du stockage local.
- [x] Définition des fonctionnalités hors MVP.
- [ ] Finaliser et enregistrer le document `MVP.md` dans `docs`.

## 6. Prochaines étapes

Les étapes suivantes ne sont pas encore considérées comme terminées :

- [ ] Vérifier et finaliser la structure complète du projet.
- [ ] Définir l'architecture de l'application.
- [ ] Organiser les dossiers : composants, écrans, services, données et types.
- [ ] Préparer les modèles de données définitifs.
- [ ] Préparer la navigation entre les écrans.
- [ ] Créer l'écran d'accueil définitif.
- [ ] Développer l'inscription et la connexion simulées.
- [ ] Développer la gestion de session utilisateur.
- [ ] Développer la recherche et les filtres fonctionnels.
- [ ] Développer les détails des produits.
- [ ] Développer les profils vendeurs.
- [ ] Développer l'ajout et la gestion des produits.
- [ ] Développer les favoris.
- [ ] Développer la gestion des catégories.
- [ ] Intégrer AsyncStorage.
- [ ] Tester les fonctionnalités.
- [ ] Corriger les erreurs et améliorer l'interface.

---

## Règle de suivi

Une étape ne peut être marquée comme terminée que lorsque son développement est réalisé et que son fonctionnement a été vérifié.

Ce document doit rester synchronisé avec l'avancement réel du projet.