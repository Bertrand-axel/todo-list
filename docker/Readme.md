# Les différents éléments de la stack

On met tout sous docker pour démarrer et arrêter facilement le projet, basculer sur un autre en cas de besoin plutôt qu'avoir une stack à installer sur chaque machine. Là, on part clé en main.
Petit zoom sur les containers.

## Traefik et Portainer
Traefik est un reverse proxy pour nous éviter d'avoir à gérer les ports dans nos urls quand on développe ainsi que les conflits de ports lorsque plusieurs projets tournent en parallèle. Portainer une ui pour gérer ses conteneurs docker.

En temps normal ces deux conteneurs sont dans une stack à part, justement pour pouvoir travailler sur plusieurs projets à la fois, pour le cadre de ce test je l'inclus dans cette stack.

## PHP
J'utilise une image de thecodingmachine, qui contient php avec composer préinstallé et la possibilité d'ajouter/activer facilement des extensions. De plus il a un système qui permet d'éviter les conflits d'utilisateurs sans avoir à passer son id linux, c'est bien pratique.

## nginx
Je suis encore fâché avec le server du cli symfony qui ne peut gérer qu'une requête à la fois (j'ai eu plusieurs fois des bugs qui ne pouvaient pas être reproduits en local à cause de ça) donc je fais passer nginx devant. De plus, le script qui permet au conteneur php d'avoir le bon id utilisateur ne fonctionne plus bien si on ne le laisse pas lancer fpm, bien que ce soit un problème facilement contournable.

## postgresql
Image officielle de la base de données. Première fois à vrai dire que je n'utilise pas mysql, je ne vais pas tenter de faire le fou tout de suite avec cette base
