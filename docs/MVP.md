# Hannout — Document de cadrage MVP

**Projet :** Hannout  
**Type :** Application mobile Marketplace  
**Technologies :** React Native, Expo, TypeScript  
**Version :** MVP 1.0  
**Stockage :** JSON et stockage local  
**Backend :** Aucun backend réel dans cette version

---

## 1. Présentation du projet

Hannout est une application mobile Marketplace qui permet aux utilisateurs de découvrir des produits proposés par des magasins et des particuliers dans différentes villes.

L'objectif est de faciliter la recherche de produits près de chez soi et de permettre aux vendeurs de présenter et gérer leurs produits.

Ce projet est réalisé dans un cadre pédagogique. Il nous permettra d'apprendre les principales étapes du développement d'une application mobile avec React Native et Expo.

## 2. Objectifs du projet

Les objectifs sont :

- Apprendre à développer une application mobile avec React Native.
- Comprendre l'organisation d'un projet mobile.
- Créer des interfaces adaptées aux smartphones.
- Gérer la navigation entre les écrans.
- Utiliser des composants réutilisables.
- Gérer les données et les états de l'application.
- Utiliser des formulaires et vérifier les données saisies.
- Enregistrer des données localement.
- Organiser et versionner le code avec Git et GitHub.

## 3. Gestion des utilisateurs

L'application propose deux modes d'utilisation :

### 3.1 Visiteur

Un visiteur peut :

- Consulter les produits.
- Rechercher des produits.
- Filtrer et trier les résultats.
- Consulter les détails d'un produit.
- Consulter les informations du vendeur.
- Contacter le vendeur par téléphone ou WhatsApp.
- Changer la ville sélectionnée.

Le visiteur doit se connecter pour utiliser les fonctionnalités réservées aux utilisateurs connectés.

### 3.2 Utilisateur connecté

Un utilisateur connecté peut :

- Ajouter des produits aux favoris.
- Consulter ses favoris.
- Publier des produits.
- Consulter ses propres produits.
- Modifier ses produits.
- Supprimer ses produits.
- Modifier le statut de ses produits.
- Gérer son profil vendeur.
- Ajouter et gérer des catégories.

### 3.3 Inscription et connexion

L'application proposera :

- Un écran d'inscription.
- Un écran de connexion.
- Une option pour continuer en tant que visiteur.
- Une possibilité de se déconnecter.

**Important :** l'authentification sera simulée localement. Il n'y aura pas de véritable serveur d'authentification. Cette simulation est destinée à l'apprentissage et ne garantit pas la sécurité d'un véritable compte.

## 4. Gestion du profil vendeur

Chaque compte utilisateur possède un seul profil vendeur.

Le profil contient :

- Le nom du vendeur ou du magasin.
- Le numéro de téléphone.
- La ville.
- Les informations nécessaires pour présenter le vendeur.

Un même profil peut publier des produits personnels et des produits de magasin.

Chaque produit possède son propre type de vendeur, qui permet de distinguer un produit publié en tant que particulier d'un produit publié en tant que magasin.

L'utilisateur peut modifier ses informations depuis la section « Mon profil vendeur ».

## 5. Gestion des produits

Un utilisateur connecté peut publier un produit avec les informations suivantes :

- Nom du produit.
- Description.
- Prix.
- Catégorie.
- Ville.
- Plusieurs images.
- Identifiant du vendeur (`sellerId`).
- Type de vendeur (`sellerType`).

Le type de vendeur peut prendre deux valeurs :

- `shop` : produit publié en tant que magasin.
- `individual` : produit publié en tant que particulier.

Chaque produit possède un identifiant unique et une référence vers son vendeur (`sellerId`).

### 5.1 Opérations disponibles

Le vendeur peut :

- Ajouter un produit.
- Consulter ses produits.
- Modifier un produit.
- Supprimer un produit après confirmation.
- Changer le statut d'un produit.

**Règle de propriété :** un utilisateur peut uniquement modifier, supprimer et gérer les produits associés à son propre profil vendeur.

### 5.2 Statuts des produits

Trois statuts sont disponibles :

| Statut | Description |
|---|---|
| `AVAILABLE` | Produit disponible |
| `SOLD` | Produit vendu |
| `HIDDEN` | Produit masqué temporairement |

Règles d'affichage :

- `AVAILABLE` : visible dans les résultats normaux.
- `SOLD` : visible avec la mention « Vendu », mais exclu des résultats disponibles par défaut.
- `HIDDEN` : invisible pour les visiteurs et les acheteurs, mais toujours accessible à son propriétaire pour la gestion.

La suppression d'un produit nécessite une confirmation. La suppression est définitive dans les données locales.

## 6. Recherche et filtres

L'utilisateur peut :

- Rechercher un produit par son nom.
- Filtrer par catégorie.
- Filtrer par ville.
- Filtrer par type de vendeur : magasin ou particulier.
- Trier les produits par prix croissant.
- Trier les produits par prix décroissant.

Les résultats affichés respectent les filtres sélectionnés et les statuts des produits.

## 7. Gestion des catégories

L'application contient des catégories prédéfinies :

- Électronique
- Vêtements
- Maison
- Alimentation
- Beauté
- Sport
- Accessoires
- Autres

Un utilisateur connecté peut également ajouter une nouvelle catégorie.

Règles :

- Le nom d'une catégorie doit être valide.
- Une catégorie déjà existante ne peut pas être ajoutée une deuxième fois.
- Une catégorie utilisée par un produit ne peut pas être supprimée.
- Une catégorie sans produit associé peut être supprimée.
- Pour supprimer une catégorie utilisée, il faut d'abord modifier la catégorie des produits concernés.

Les nouvelles catégories sont enregistrées localement.

## 8. Favoris

Un utilisateur connecté peut :

- Ajouter un produit aux favoris.
- Consulter la liste de ses favoris.
- Retirer un produit des favoris.

Chaque utilisateur connecté possède sa propre liste de favoris. Les favoris sont associés à son identifiant et conservés localement sur l'appareil.

Les visiteurs doivent se connecter pour utiliser les favoris.

## 9. Contact avec le vendeur

La page de détails d'un produit affiche les informations du vendeur.

Deux moyens de contact sont proposés :

- Appeler le vendeur.
- Contacter le vendeur via WhatsApp.

**Règle d'accès :** les visiteurs et les utilisateurs connectés peuvent contacter directement le vendeur, sans obligation de connexion.

L'application ouvre l'application correspondante sur le téléphone.

Il n'y aura pas de système de messagerie interne dans le MVP.

## 10. Gestion des villes

La ville par défaut est **Oujda**.

L'utilisateur peut choisir une autre ville manuellement.

Le choix de la ville est conservé localement.

L'application n'utilise pas le GPS dans cette version.

## 11. Données et stockage

Le projet n'utilisera pas de véritable backend ni de base de données distante.

Nous utiliserons :

- Des données JSON pour les données de démonstration.
- TypeScript pour définir les types des données.
- AsyncStorage pour conserver les données locales nécessaires.

Exemples de données :

- Utilisateurs.
- Profils vendeurs.
- Produits.
- Catégories.
- Favoris.
- Préférences de l'application.
- Session utilisateur.

**Limitation importante :** les données enregistrées localement ne sont pas automatiquement partagées entre plusieurs appareils. L'authentification locale est uniquement une simulation pédagogique et ne garantit pas la sécurité d'un véritable compte.

## 12. Écrans prévus

Les principaux écrans du MVP sont :

1. Welcome Screen.
2. Login Screen.
3. Register Screen.
4. Home Screen.
5. Liste des produits.
6. Recherche et filtres.
7. Détails du produit.
8. Profil du vendeur.
9. Favoris.
10. Mes produits.
11. Ajouter un produit.
12. Modifier un produit.
13. Mon profil vendeur.
14. Gestion des catégories.

## 13. Technologies utilisées

| Technologie | Utilisation |
|---|---|
| React Native | Développement mobile |
| Expo | Environnement de développement |
| Expo Router | Navigation entre les écrans |
| TypeScript | Typage et organisation du code |
| JSON | Données de démonstration |
| AsyncStorage | Stockage local |
| Git | Gestion des versions |
| GitHub | Hébergement du code source |

## 14. Fonctionnalités hors MVP

Les fonctionnalités suivantes ne sont pas prévues dans cette première version :

- Backend réel.
- Base de données distante.
- Authentification sécurisée.
- Synchronisation entre plusieurs appareils.
- Paiement électronique.
- Livraison et suivi des commandes.
- Messagerie interne.
- Géolocalisation GPS.
- Notifications push.

Elles pourront être étudiées dans une version future.

## 15. Plan de réalisation

Le développement sera réalisé progressivement :

1. Vérification et organisation de la structure du projet.
2. Préparation des types et des données JSON.
3. Création des composants communs.
4. Création des écrans de navigation.
5. Développement de l'inscription et de la connexion simulées.
6. Développement de l'accueil et de la navigation.
7. Développement de la recherche et des filtres.
8. Développement des détails des produits.
9. Développement du profil vendeur.
10. Développement de l'ajout et de la gestion des produits.
11. Développement des favoris.
12. Intégration du stockage local.
13. Tests, correction des erreurs et amélioration de l'interface.

Chaque étape sera testée avant de passer à la suivante.

## 16. Règles de travail

- Ne pas développer une fonctionnalité sans avoir défini son objectif.
- Garder une structure de code claire.
- Réutiliser les composants lorsque c'est nécessaire.
- Séparer les interfaces, les données et la logique.
- Respecter les droits d'accès de chaque utilisateur.
- Tester chaque fonctionnalité.
- Utiliser Git pour sauvegarder les étapes importantes.
- Expliquer les technologies utilisées et comprendre le code écrit.

---

## Conclusion

Hannout est un projet d'apprentissage du développement mobile. L'objectif n'est pas seulement de créer une application fonctionnelle, mais aussi de comprendre les technologies, les choix techniques et les bonnes pratiques nécessaires pour développer une application mobile.