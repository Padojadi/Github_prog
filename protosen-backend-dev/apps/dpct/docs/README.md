# Documentation Protosen DPCT

Cette documentation est générée avec [VitePress](https://vitepress.dev/).

## Développement local

### Démarrer le serveur de dev

```bash
npm run docs:dev
```

La documentation sera accessible sur http://127.0.0.1:5173

### Build pour production

```bash
npm run docs:build
```

Les fichiers générés seront dans `docs/.vitepress/dist/`

### Preview du build

```bash
npm run docs:preview
```

## Structure

```
docs/
├── .vitepress/
│   └── config.ts              # Configuration VitePress
├── guide/
│   ├── overview.md            # Vue d'ensemble du projet
│   ├── getting-started.md     # Installation et démarrage
│   └── configuration.md       # Configuration détaillée
├── api/
│   ├── rest.md                # Documentation API REST
│   ├── grpc.md                # Documentation API gRPC
│   └── ...
├── architecture/
│   ├── overview.md            # Vue d'ensemble architecture
│   └── ...
├── modules/
│   └── ...                    # Documentation par module
├── development/
│   └── ...                    # Guides de développement
└── index.md                   # Page d'accueil
```

## Contribuer à la documentation

### Ajouter une nouvelle page

1. Créer un fichier `.md` dans le dossier approprié
2. Ajouter le lien dans `.vitepress/config.ts` (sidebar)
3. Écrire le contenu en Markdown

### Conventions

- Utiliser des titres clairs et descriptifs
- Inclure des exemples de code
- Ajouter des liens vers les ressources connexes
- Utiliser les [containers VitePress](https://vitepress.dev/guide/markdown#custom-containers) pour les notes/warnings

### Exemples de containers

```markdown
::: info
Ceci est une information
:::

::: tip
Ceci est un conseil
:::

::: warning
Ceci est un avertissement
:::

::: danger
Ceci est un danger
:::
```

## Mise à jour de la documentation

La documentation doit être mise à jour lors de:
- Ajout de nouvelles features
- Modification d'APIs existantes
- Changement de configuration
- Ajout de nouveaux modules

## Ressources

- [VitePress Documentation](https://vitepress.dev/)
- [Markdown Guide](https://www.markdownguide.org/)
