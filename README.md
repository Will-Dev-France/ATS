# ATS Checker — site de téléchargement

Site public de présentation et de téléchargement d'**ATS Checker** (Mac et Windows), publié par Willy Pontvianne :
**https://will-dev-france.github.io/ATS/**

ATS Checker analyse un CV comme le ferait un logiciel de recrutement (ATS) : une note, ce qu'il faut corriger et les mots-clés manquants. L'analyse est gratuite et entièrement locale. Le code de l'application est dans un dépôt privé ; ce dépôt contient seulement le site et les installeurs (onglet **Releases**).

## Contenu

| Chemin                                    | Rôle                                                                         |
| ----------------------------------------- | ---------------------------------------------------------------------------- |
| `index.html`, `en/index.html`             | Page d'accueil (FR, EN)                                                      |
| `mentions-legales.html`, `en/legal.html`  | Mentions légales (FR, EN)                                                    |
| `assets/style.css`                        | Styles (clair et sombre, sans aucune ressource externe)                      |
| `assets/img/`                             | Icônes, captures d'écran (CV fictifs uniquement), images de partage          |

Le site est statique, sans framework ni étape de build. Il est publié par GitHub Pages depuis la branche `main`, à la racine. Il ne contient ni cookie, ni mesure d'audience, ni ressource tierce.

## Téléchargements

Les boutons pointent vers `releases/latest/download/<nom>`. Chaque version doit donc garder les mêmes noms de fichiers :

- `ATS-Checker-macOS-arm64.dmg` : signé Developer ID, notarisé et agrafé ;
- `ATS-Checker-Windows-x64-Setup.exe` : non signé pour l'instant (alerte SmartScreen, expliquée sur le site).

## Publier une nouvelle version

Depuis le dépôt de l'application (privé) :

1. Passer la version dans `package.json`, pousser sur `main` et attendre la CI verte (Mac et Windows).
2. Construire le `.dmg` notarisé sur le Mac :
   ```sh
   APPLE_KEYCHAIN_PROFILE=ats-checker npm run build:mac
   ```
3. Récupérer l'installeur Windows produit par la CI :
   ```sh
   gh run download <id du run> -n ATS-Checker-Windows -D /tmp/ats-win
   ```
4. Copier les deux fichiers sous les noms stables, puis vérifier et noter leurs empreintes :
   ```sh
   cp release/X.Y.Z/ATS-Checker-X.Y.Z-arm64.dmg /tmp/ATS-Checker-macOS-arm64.dmg
   cp /tmp/ats-win/X.Y.Z/ATS-Checker-Setup-X.Y.Z-x64.exe /tmp/ATS-Checker-Windows-x64-Setup.exe
   xcrun stapler validate /tmp/ATS-Checker-macOS-arm64.dmg
   shasum -a 256 /tmp/ATS-Checker-*
   ```
5. Créer la release dans **ce** dépôt (compte GitHub Will-Dev-France) :
   ```sh
   gh release create vX.Y.Z --repo Will-Dev-France/ATS --title "ATS Checker X.Y.Z" \
     --notes-file notes.md /tmp/ATS-Checker-macOS-arm64.dmg /tmp/ATS-Checker-Windows-x64-Setup.exe
   ```
6. Dans `index.html` et `en/index.html`, mettre à jour la version, la date, les tailles et les empreintes SHA-256. Puis pousser sur `main` : le site est republié automatiquement.

## Contact

Willy Pontvianne — willypontvianne8@gmail.com — voir les [mentions légales](mentions-legales.html).
