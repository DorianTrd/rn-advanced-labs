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



