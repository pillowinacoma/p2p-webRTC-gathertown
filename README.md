# Base TP3 Tiw8 2021-2022

Sujet : https://aurelient.github.io/tiw8/2021/TP3/

L'objectif est de réaliser un clone simplifié de [Gathertown](https://www.gather.town/).

Ce code est la base du projet avec une map, et un perso qui bouge. 

## Build

`yarn install` pour installer les dépendances.

`yarn build` pour construire le projet.

`yarn start` pour lancer le serveur node.

`yarn dev` pour lancer le projet en mode dev, avec webpack-dev-server. 




## Scénario de test idéal : 
<img src="https://cdn.discordapp.com/attachments/820319024746856509/927677126600179752/Capture_decran_de_2022-01-03_22-36-48.png" />

- aller sur le [site](https://tp3-tiw8.herokuapp.com/) deployé sur heroku ou en local (localhost:4000 par defaut)
- partager le lien avec vos amis
- utiliser les flèches pour faire bouger votre avatar pré-selectionné aléatoirement
- approcher vous à des participants, quand la distance est inferieure à 1, vous etez mis en communication
- en vous éloiagnant, le volume diminue
- quand la distance est supérieure à 5 la communication est coupé
- en survolant votre souris sur les boutons en haut de l'écran, vous pouvez voir les inforamtions de chaque participant (distance, avatar ...)

## Ce qui fonctionne: 
- [x] Style Tailwind et Windmill
- [x] State et props react
- [x] Utilisation des hooks
- [x] Mise en relation des pairs avec simple-peer en utilisant les serveur de signalement avec la technologie WebSockets 
### Data

- [x] Les paires peuvent s'envoyer des messages (position, avatar)
- [x] Utilisation du middleware pour gérer la propagation des messages
- [x] les participants bougent de manière cohérente
- [x] Utilisation de redux toolkit pour gérer les connexions en pairs
### VideoChat

- [x] Le flux local s'affiche quand on s'approiche d'un participant
- [x] Les flux remotes s'affichent quand on s'approche des participants remote
- [x] Fonctionnement sur localhost
- [x] La connection se ferme correctement quand on quitte le site (le paire est destroyed et supprimé des listes de paires)


- [x] Deploiement sur heroku fonctionne

### Bonus
- [x] Gestion de plus de deux pairs
- [x] Gestion de l'audio séparément (l'audio diminue avec la distance avant que la vidéo disparait)

## Ce qui ne fonctionne pas:
- [ ] Quand on fait remove stream, on ne peut pas relancer le stream sur le meme paire, pour cela on a pas mis de bouton qui coupe le stream, mais si l'utilisateur ferme l'onglet, cela coupe son flux et les pairs associés proprement


