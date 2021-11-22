# Base TP3 Tiw8 2021-2022

Sujet : https://aurelient.github.io/tiw8/2021/TP3/

L'objectif est de réaliser un clone simplifié de [Gathertown](https://www.gather.town/).

Ce code est la base du projet avec une map, et un perso qui bouge. 

## Build

`yarn install` pour installer les dépendances.

`yarn build` pour construire le projet.

`yarn start` pour lancer le serveur node.

`yarn dev` pour lancer le projet en mode dev, avec webpack-dev-server. 

## Gestion d'erreur
Il est possible que vous tombiez sur une erreur liée au support Typescript de redux-toolkit : `Failed to parse source map from 'xxx/node_modules/@reduxjs/toolkit/dist/redux-toolkit.esm.ts'`

L'erreur est discutée dans plusieurs issues du repo reduxjs/redux-toolkit [exemple le plus récent](https://github.com/reduxjs/redux-toolkit/issues/1704). J'ai corrigé le problème de manière barbare en supprimant la référence à `redux-toolkit.esm.ts` dans `redux-toolkit.esm.js.map` (dans le dossier `node_modules/@reduxjs/redux-toolkit/dist/` [Voir ici](https://github.com/reduxjs/redux-toolkit/issues/1704#issuecomment-965651759), vu que le fichier n'existe pas et qu'au vu des discussions sur le dépot il semblerait que cette ref ne devrait pas être là. 

Si vous avez une solution plus propre/moins manuelle je suis preneur. 

