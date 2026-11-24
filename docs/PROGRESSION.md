# Hannout — Suivi de progression

Ce document permet de suivre l'avancement réel du développement de Hannout. Il est mis à jour après chaque étape terminée et testée.

## 1. Environnement et initialisation

- [x] Création du projet React Native avec Expo.
- [x] Configuration de l'environnement de développement.
- [x] Installation de Bun.
- [x] Configuration d'Expo Router.
- [x] Résolution des problèmes de compatibilité entre Expo Go et le SDK Expo.
- [x] Mise à jour des dépendances vers Expo SDK 58.
- [x] Installation du package AsyncStorage (`2.2.0`).
- [x] Mise à jour des dépendances Expo vers les versions compatibles.
- [x] Installation de `expo-image-picker`.
- [x] Lancement et test de l'application sur un téléphone Android avec Expo Go.
- [x] Vérification de la compatibilité des dépendances Expo.

## 2. Structure et données

- [x] Création des types TypeScript pour les produits.
- [x] Création des types TypeScript pour les vendeurs.
- [x] Création des types TypeScript pour les utilisateurs.
- [x] Création des types TypeScript pour les catégories.
- [x] Création des données de démonstration pour les produits.
- [x] Création des données de démonstration pour les vendeurs.
- [x] Création des données de démonstration pour les utilisateurs.
- [x] Création des données de démonstration pour les catégories.
- [x] Organisation des dossiers principaux du projet.
- [x] Mise en place des dossiers `app`, `contexts`, `data`, `services` et `types`.

## 3. Interface utilisateur et navigation

- [x] Création du premier écran d'accueil.
- [x] Ajout du nom et de la présentation de Hannout.
- [x] Ajout du champ de recherche visuel.
- [x] Ajout des catégories avec des icônes.
- [x] Affichage des produits récents.
- [x] Affichage des images, prix, villes et types de vendeurs.
- [x] Organisation de la navigation avec Expo Router.
- [x] Création de la navigation par onglets.
- [x] Création des onglets Accueil, Favoris, Mes produits et Profil.
- [x] Création des écrans de connexion et d'inscription.
- [x] Création de l'écran de profil dynamique.
- [x] Création de l'écran Mes produits avec filtres par statut.
- [ ] Finaliser l'écran Favoris.
- [ ] Créer l'écran de détails d'un produit.
- [ ] Créer l'écran de profil public d'un vendeur.
- [ ] Améliorer et harmoniser l'interface générale.

## 4. Authentification et gestion des utilisateurs

- [x] Définition du mode visiteur.
- [x] Autorisation de consulter les produits sans connexion.
- [x] Création de l'écran de connexion.
- [x] Création de l'écran d'inscription.
- [x] Validation des champs du formulaire d'inscription.
- [x] Vérification des identifiants lors de la connexion.
- [x] Gestion locale de la session utilisateur.
- [x] Mise en place d'un contexte d'authentification (`AuthContext`).
- [x] Gestion de la déconnexion.
- [x] Création automatique d'un profil vendeur lors de l'inscription.
- [x] Association du profil vendeur à son utilisateur.
- [x] Affichage dynamique des informations du profil.
- [x] Tests de l'inscription, de la connexion et du profil sur Android.

**Remarque :** l'authentification est simulée localement pour le MVP. Elle ne constitue pas un système sécurisé de production.

## 5. Gestion des produits et des vendeurs

- [x] Définition du modèle de données des produits.
- [x] Définition des types de publication : `SHOP` et `INDIVIDUAL`.
- [x] Définition des statuts : `AVAILABLE`, `SOLD` et `HIDDEN`.
- [x] Association des produits à un vendeur avec `sellerId`.
- [x] Création du service de stockage des produits.
- [x] Création de l'écran Mes produits.
- [x] Affichage des produits appartenant à l'utilisateur connecté.
- [x] Filtrage des produits par statut.
- [x] Gestion des états visiteur et utilisateur connecté.
- [x] Tests de l'écran Mes produits sur Android.
- [x] Installation de la bibliothèque de sélection d'images `expo-image-picker`.
- [x] Création du formulaire de publication d'un produit.
- [x] Préparation de la sélection et de la prévisualisation des images.
- [x] Ajout des validations du formulaire de publication.
- [x] Préparation de l'enregistrement d'un nouveau produit dans AsyncStorage.
- [ ] Tester complètement la publication d'un produit sur Android.
- [ ] Développer la modification d'un produit.
- [ ] Développer la suppression d'un produit.
- [ ] Développer le changement de statut d'un produit.
- [ ] Finaliser la gestion du profil vendeur.

## 6. Stockage local et persistance

- [x] Installation et configuration d'AsyncStorage.
- [x] Création d'un service générique de stockage.
- [x] Définition des clés de stockage.
- [x] Initialisation des données de démonstration si elles sont absentes.
- [x] Stockage local des utilisateurs.
- [x] Stockage local des vendeurs.
- [x] Stockage local des produits.
- [x] Stockage local des catégories.
- [x] Stockage local de la session utilisateur.
- [x] Stockage local de la ville sélectionnée.
- [x] Création du service de gestion des favoris.
- [x] Organisation des services de stockage par fonctionnalité.
- [x] Tests de persistance des favoris sur Android.
- [ ] Vérifier la persistance de toutes les données après fermeture et redémarrage de l'application.
- [ ] Améliorer la gestion des erreurs de stockage.
- [ ] Préparer une solution durable pour les images locales.

## 7. Favoris, recherche et catégories

- [x] Définition du fonctionnement des favoris.
- [x] Stockage des favoris par utilisateur.
- [x] Création des fonctions d'ajout et de suppression des favoris.
- [x] Création des données des catégories.
- [ ] Développer l'interface complète des favoris.
- [ ] Connecter l'interface Favoris au service de stockage.
- [ ] Développer la recherche fonctionnelle.
- [ ] Développer les filtres par catégorie.
- [ ] Développer les filtres par ville.
- [ ] Développer le tri des produits.
- [ ] Développer la gestion des catégories.

## 8. Git et GitHub

- [x] Initialisation du suivi du projet avec Git.
- [x] Création des premiers commits.
- [x] Commit des types et des données de démonstration : `c4900c7`.
- [x] Commit de l'écran d'accueil et des produits : `4d39b2a`.
- [x] Commit de la documentation MVP et du suivi : `a440d89`.
- [x] Commit de l'installation d'AsyncStorage et de la mise à jour du suivi : `a7682a2`.
- [x] Création du commit consacré à l'authentification et à la gestion des produits : `c78a883`.
- [ ] Vérifier que le dernier commit est bien envoyé sur GitHub.
- [ ] Vérifier que la branche `main` est synchronisée avec `origin/main`.

## 9. Cadrage du MVP

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
- [x] Rédaction et enregistrement du document `MVP.md`.

## 10. Prochaines étapes prioritaires

Les prochaines étapes de développement sont :

1. Tester complètement le formulaire de publication sur Android.
2. Finaliser la fonctionnalité Favoris.
3. Développer l'écran de détails d'un produit.
4. Développer le profil public du vendeur.
5. Ajouter la modification et la suppression des produits.
6. Développer la recherche et les filtres fonctionnels.
7. Développer la gestion des catégories et des villes.
8. Vérifier la persistance de toutes les données.
9. Améliorer l'interface et l'expérience utilisateur.
10. Effectuer des tests fonctionnels complets.

---

## Règle de suivi

Une étape ne peut être marquée comme terminée que lorsque son développement est réalisé et que son fonctionnement a été vérifié.

Les fonctionnalités implémentées mais non encore testées doivent rester identifiées comme telles.

Ce document doit rester synchronisé avec l'avancement réel du projet.