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

<img width="180" height="400" alt="image" src="https://github.com/user-attachments/assets/9508c05c-97a1-4aa2-aa02-d045f0c20b9e" />

<img width="180" height="400" alt="image" src="https://github.com/user-attachments/assets/54323efa-6dde-40f1-aa77-f7d0fb7c0b01" />

<img width="180" height="400" alt="image" src="https://github.com/user-attachments/assets/175924d8-fdb6-446d-a165-4ee5a6f8aba0" />

<img width="180" height="400" alt="image" src="https://github.com/user-attachments/assets/c1f4e88f-3f60-4d97-afdc-ba256a8d38fe" />

<img width="180" height="400" alt="image" src="https://github.com/user-attachments/assets/ad9a4df3-42df-44b7-9046-4a8c6f680e57" />

<img width="180" height="400" alt="image" src="https://github.com/user-attachments/assets/3247c62d-d1db-4a3d-88f1-ad96fd62f689" />


## TP4B Robots

### Dépendances & rôles
- @reduxjs/toolkit: configuration store, slice `robots` (reducers synchrones + createAsyncThunk bonus), selectors mémoïsés.
- react-redux: Provider au niveau de `app/_layout.tsx`, hooks typés `useAppDispatch`/`useAppSelector` (`app/(main)/TP4-robots-redux/app/hooks.ts`).
- redux-persist: persistance de l’état `robots.items` dans AsyncStorage (config dans `app/(main)/TP4-robots-redux/app/store.ts`).

### Arborescence (extrait) & routes
```
app/
  (main)/
    _layout.tsx
    TP4-robots-redux/
      index.tsx
      create.tsx
      edit/[id].tsx
      components/RobotForm.tsx
      features/robots/
        robotsSlice.ts
        selectors.ts
      app/
        store.ts
        rootReducer.ts
        hooks.ts
      validation/robotSchema.ts
```

Routes Expo Router:
- `/TP4-robots-redux`
- `/TP4-robots-redux/create`
- `/TP4-robots-redux/edit/[id]`

### Règles de validation
- name: requis, min 2, unique (UI + slice)
- label: requis, min 3
- year: entier, [1950, année courante]
- type: ∈ enum dans `validation/robotSchema.ts`

Logique métier slice (`robotsSlice.ts`):
- createRobot: refuse si name déjà existant, génère id si absent
- updateRobot: refuse si name collisionne un autre robot
- deleteRobot: supprime par id

### Choix de stack formulaire
- Formik: intégration directe avec Yup, réutilisation d’un composant unique `RobotForm`, UX mobile (KeyboardAvoidingView, navigation entre champs, submit désactivé si invalide).


### Captures d’écran 

<img width="180" height="400" alt="image" src="https://github.com/user-attachments/assets/e9be312e-d119-437e-91a2-0753ff5b0a00" />

<img width="180" height="400" alt="image" src="https://github.com/user-attachments/assets/a9234a11-3ae8-48d1-b01d-c8950ad8c7f3" />

<img width="180" height="400" alt="image" src="https://github.com/user-attachments/assets/658c6dc2-a265-4aae-aacd-b4f211fd4ebf" />

<img width="180" height="400" alt="image" src="https://github.com/user-attachments/assets/051601bc-791d-41cf-911a-cd7b7fc68812" />

## TP5 Stockage Local


### 📦 Dépendances & rôle de chaque paquet

| Paquet | Rôle |
|--------|------|
| `expo-sqlite` | Création et gestion de la base SQLite locale. |
| `expo-file-system` | Export et import des données JSON. |
| `uuid` | Génération d’ID uniques pour les robots. |
| `formik + yup` ou `react-hook-form + zod` | Validation des formulaires (création / édition). |
| `@tanstack/react-query` (optionnel) | Gestion de cache et invalidation automatique des requêtes CRUD. |


### 🏛️ Architecture des Dossiers
L'organisation des fichiers respecte les bonnes pratiques de séparation des préoccupations :

<img width="349" height="331" alt="image" src="https://github.com/user-attachments/assets/80cca01c-1921-492c-9624-ee2a6d4ed5af" />

### Démonstration fonctionnement

https://github.com/user-attachments/assets/8476e39f-d5ef-4be7-a0f5-78d745b5f6dc


# 📸 TP6 – Application Caméra / Galerie

Ce projet est une application mobile développée avec **Expo** et **React Native** qui permet de capturer des photos et des vidéos, de les stocker localement, de les afficher dans une galerie et de les consulter en détail.

---

## 1. Dépendances & Rôles

Le tableau ci-dessous liste les principales bibliothèques utilisées et leur fonction dans l'application :

| Dépendance | Rôle |
| :--- | :--- |
| `expo-camera` | Accès à la **caméra** (prise de photo / vidéo). |
| `expo-file-system` | **Stockage local** des fichiers (photos et vidéos). |
| `react-native-uuid` | **Génération d’identifiants uniques** pour chaque média. |

---

## 2. Arborescence & Routes


### Arborescence des fichiers

<img width="428" height="200" alt="image" src="https://github.com/user-attachments/assets/cc3f85a8-31be-4c93-9bbe-0bca3dddb059" />


### Routes principales


| Route | Écran | Description |
| :--- | :--- | :--- |
| `/TP6-camera` | **Galerie** | Affiche toutes les photos et vidéos. |
| `/TP6-camera/camera` | **Caméra** | Capture photo ou vidéo. |
| `/TP6-camera/detail/[id]` | **Détail** | Affiche un média, ses informations et le bouton de suppression. |



## 3. Gestion des Permissions

### Déclaration (`app.json`)

Pour Android :

```json
{
  "expo": {
    "name": "rn-advanced-labs",
    "slug": "rn-advanced-labs",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "rnadvancedlabs",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.exemple.rnadvancedlabs"
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundImage": "./assets/images/android-icon-background.png",
        "monochromeImage": "./assets/images/android-icon-monochrome.png"
      },
      "edgeToEdgeEnabled": true,
      "predictiveBackGestureEnabled": false,
      "package": "com.exemple.rnadvancedlabs",
      "permissions": ["CAMERA"]
    },
    "web": {
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff",
          "dark": {
            "backgroundColor": "#000000"
          }
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    }
  }
}

}
```
## 4. Flux Applicatif
Capture
L'utilisateur ouvre /TP6-camera/camera, choisit le mode (photo/vidéo) et capture le média.

Sauvegarde
Photo → expo-file-system via savePhoto().

Vidéo → saveVideo() (format .mp4).

Galerie
/TP6-camera : La FlatList charge toutes les images/vidéos. Affichage en miniature, tri par date (plus récentes d’abord).

Détail & Suppression
/TP6-camera/detail/[id] : Affiche le média et ses informations. Le bouton Supprimer déclenche deletePhoto() ou deleteVideo(), puis redirige vers la galerie.

## Capture Video 


https://github.com/user-attachments/assets/d7d0f785-0b83-4595-9bc2-1951325f6a4f


