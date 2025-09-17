# rn-advanced-labs

## 🚀 Environnement
- **Node.js recommandé** : ≥ 20.19.4
- **Node.js utilisé** : ≥ v22.9.0
- **Expo CLI** (via `npx`)

## ▶️ Lancement du projet
```bash
npx expo start
```
## TP 1
Structure 

<img width="264" height="197" alt="image" src="https://github.com/user-attachments/assets/7e93b6da-2011-4fa7-a3f4-902efcf4c7b7" />

Description :
Petit composant de Profiles avec nombre d'abonnés ajouté toutes les x secondes. Avec possibilité de s'abonner soi-même et de changer la valeur du bouton

## TP 2
Composant installé et role: 
npm install expo-router react-native-safe-area-context react-native-screens => pour optimiser les stacks de navigation et gerer les zones sures
npx expo install @react-native-async-storage/async-storage  => permet de stocker des données localement sur le téléphone

Structure : 

<img width="277" height="309" alt="image" src="https://github.com/user-attachments/assets/36cfcaaf-6e52-4533-b53a-d4caf25bdba9" />


Table de routes (nom, URL, paramètres).

```bash
<Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="tp1-profile-card"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
      
      <Tabs.Screen name="detail/[id]" options={{ href: null }} />
      <Tabs.Screen name="tp1-profile-card/components" options={{ href: null }} />
      <Tabs.Screen name="tp1-profile-card/components/ProfileCard" options={{ href: null }} />
    </Tabs>
      
```

<img width="514" height="153" alt="image" src="https://github.com/user-attachments/assets/39a1b1ee-7788-40b3-bda1-6a11df74f7ad" />



Scénarios de persistance 

Grace a une méthode créer dans Utils , quand on quitte l'application en étant sur detail/1 par exemple et que je relance l'application il me redirige bien directement vers detail/1

https://github.com/user-attachments/assets/b811c0c6-30e1-44a9-ae1f-81ba5a0fedfd

## TP 3

Formik vs RHF

<img width="430" height="176" alt="image" src="https://github.com/user-attachments/assets/56404c66-08b2-4c11-989f-208f0761af01" />

Architecture 

<img width="329" height="377" alt="image" src="https://github.com/user-attachments/assets/e9022a56-59b4-4517-9c6d-add3119146fc" />

Routes

/formik → Formulaire avec Formik + Yup

/rhf → Formulaire avec React Hook Form + Zod

Les écrans sont liés entre eux par des <Link> :
Depuis /formik → bouton "Aller à RHF + Zod" et /rhf → bouton "Aller à Formik + Yup"

UI 

<img width="180" height="400" alt="image" src="https://github.com/user-attachments/assets/79c2138d-885c-4b06-8bff-8fa3b9f7e703" />
<img width="180" height="400" alt="image" src="https://github.com/user-attachments/assets/82d1692e-6042-4555-bcff-e333c2442c2e" />


## TP4A Robots

### Choix du stack formulaire
J'ai choisi **Formik + Yup** pour le formulaire car Formik est simple à intégrer avec React Native, offre une bonne gestion des états de formulaire et la validation avec Yup est très lisible et flexible. Cela permet une expérience utilisateur fluide et une validation robuste.

### Schéma d’arborescence et routes
```
app/
  TP4-robots/
    index.tsx           // Liste des robots
    create.tsx          // Création d'un robot
    edit/[id].tsx       // Édition d'un robot
    components/
      RobotForm.tsx     // Formulaire réutilisable
      RobotListItem.tsx // Affichage d'un robot
    store/
      robotsStore.ts    // Zustand store
    validation/
      robotSchema.ts    // Validation Yup
```
Routes principales :
- `/TP4-robots` : liste
- `/TP4-robots/create` : création
- `/TP4-robots/edit/[id]` : édition

### Règles de validation
- **name** : min 2 caractères, unique, non vide
- **label** : min 3 caractères, non vide
- **year** : entier, 1950 ≤ year ≤ année courante
- **type** : valeur parmi l’enum

### Explications persistance Zustand
Le store Zustand utilise le middleware `persist` avec **AsyncStorage** pour sauvegarder la liste des robots. Les robots restent présents même après redémarrage de l’application. Toutes les opérations (create, update, delete) modifient la liste en temps réel sans rechargement.

### Plan de tests manuels exécutés
- **Create** :
    - Succès : un nouvel item apparaît dans la liste.
    - Échec (name dupliqué, year invalide) : erreurs affichées, pas de création.
- **Edit** :
    - Charger un robot existant, modifier label/type, sauvegarder → retour à la liste mise à jour.
- **Delete** :
    - Suppression confirmée → l’item disparaît, feedback visuel et haptique.
- **Persistance** :
    - Créer 2 robots, redémarrer l’app → robots toujours présents.
- **UX** :
    - Le clavier ne masque pas le bouton submit.
    - Le bouton submit est désactivé tant que le formulaire n’est pas valide.

**Tous les tests sont validés et fonctionnels.**

Capture d'écran :
## TP4A Robots

### Choix du stack formulaire
J'ai choisi **Formik + Yup** pour le formulaire car Formik est simple à intégrer avec React Native, offre une bonne gestion des états de formulaire et la validation avec Yup est très lisible et flexible. Cela permet une expérience utilisateur fluide et une validation robuste.

### Schéma d’arborescence et routes
```
app/
  TP4-robots/
    index.tsx           // Liste des robots
    create.tsx          // Création d'un robot
    edit/[id].tsx       // Édition d'un robot
    components/
      RobotForm.tsx     // Formulaire réutilisable
      RobotListItem.tsx // Affichage d'un robot
    store/
      robotsStore.ts    // Zustand store
    validation/
      robotSchema.ts    // Validation Yup
```
Routes principales :
- `/TP4-robots` : liste
- `/TP4-robots/create` : création
- `/TP4-robots/edit/[id]` : édition

### Règles de validation
- **name** : min 2 caractères, unique, non vide
- **label** : min 3 caractères, non vide
- **year** : entier, 1950 ≤ year ≤ année courante
- **type** : valeur parmi l’enum

### Explications persistance Zustand
Le store Zustand utilise le middleware `persist` avec **AsyncStorage** pour sauvegarder la liste des robots. Les robots restent présents même après redémarrage de l’application. Toutes les opérations (create, update, delete) modifient la liste en temps réel sans rechargement.

### Plan de tests manuels exécutés
- **Create** :
    - Succès : un nouvel item apparaît dans la liste.
    - Échec (name dupliqué, year invalide) : erreurs affichées, pas de création.
- **Edit** :
    - Charger un robot existant, modifier label/type, sauvegarder → retour à la liste mise à jour.
- **Delete** :
    - Suppression confirmée → l’item disparaît, feedback visuel et haptique.
- **Persistance** :
    - Créer 2 robots, redémarrer l’app → robots toujours présents.
- **UX** :
    - Le clavier ne masque pas le bouton submit.
    - Le bouton submit est désactivé tant que le formulaire n’est pas valide.

**Tous les tests sont validés et fonctionnels.**

Capture d'écran :
## TP4A Robots

### Choix du stack formulaire
J'ai choisi **Formik + Yup** pour le formulaire car Formik est simple à intégrer avec React Native, offre une bonne gestion des états de formulaire et la validation avec Yup est très lisible et flexible. Cela permet une expérience utilisateur fluide et une validation robuste.

### Schéma d’arborescence et routes
```
app/
  TP4-robots/
    index.tsx           // Liste des robots
    create.tsx          // Création d'un robot
    edit/[id].tsx       // Édition d'un robot
    components/
      RobotForm.tsx     // Formulaire réutilisable
      RobotListItem.tsx // Affichage d'un robot
    store/
      robotsStore.ts    // Zustand store
    validation/
      robotSchema.ts    // Validation Yup
```
Routes principales :
- `/TP4-robots` : liste
- `/TP4-robots/create` : création
- `/TP4-robots/edit/[id]` : édition

### Règles de validation
- **name** : min 2 caractères, unique, non vide
- **label** : min 3 caractères, non vide
- **year** : entier, 1950 ≤ year ≤ année courante
- **type** : valeur parmi l’enum

### Explications persistance Zustand
Le store Zustand utilise le middleware `persist` avec **AsyncStorage** pour sauvegarder la liste des robots. Les robots restent présents même après redémarrage de l’application. Toutes les opérations (create, update, delete) modifient la liste en temps réel sans rechargement.

### Plan de tests manuels exécutés
- **Create** :
    - Succès : un nouvel item apparaît dans la liste.
    - Échec (name dupliqué, year invalide) : erreurs affichées, pas de création.
- **Edit** :
    - Charger un robot existant, modifier label/type, sauvegarder → retour à la liste mise à jour.
- **Delete** :
    - Suppression confirmée → l’item disparaît, feedback visuel et haptique.
- **Persistance** :
    - Créer 2 robots, redémarrer l’app → robots toujours présents.
- **UX** :
    - Le clavier ne masque pas le bouton submit.
    - Le bouton submit est désactivé tant que le formulaire n’est pas valide.

**Tous les tests sont validés et fonctionnels.**

Capture d'écran :

<img width="180" height="400" alt="image" src="https://github.com/user-attachments/assets/8e36c134-e357-4688-b826-3f46a4593790" />

<img width="180" height="400" alt="image" src="https://github.com/user-attachments/assets/a8408c72-cc6b-4f02-82a5-ede95f5a2cf6" />

<img width="180" height="400" alt="image" src="https://github.com/user-attachments/assets/56f7850d-f6fb-4f54-9b7e-baa1d259cf63" />

<img width="180" height="400" alt="image" src="https://github.com/user-attachments/assets/396be7d9-31d2-461a-a939-bee3f2c6916f" />

<img width="180" height="400" alt="image" src="https://github.com/user-attachments/assets/9a24f026-0cbd-4c40-836e-e9976a7a1864" />

<img width="180" height="400" alt="image" src="https://github.com/user-attachments/assets/d5d0d097-bb46-4118-bf60-882f765e7fe9" />
