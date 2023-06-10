# Les différents éléments de la stack

On met tout sous docker pour démarrer et arrêter facilement le projet, basculer sur un autre en cas de besoin plutôt qu'avoir une stack à installer sur chaque machine. Là, on part clé en main.
Petit zoom sur les conteneurs et commandes.

## Makefile
Pour créer des raccourcis communs et faciliter le démarrage pour une nouvelle personne sur les projets, j'utilise un makefile qui contient les commandes principales pour initializer, démarrer, arrêter le projet. Ca permet d'éviter un readme à rallonge d'instructions et on a juste à faire `cd docker && make first-install` pour commencer à développer

## Traefik et Portainer
Traefik est un reverse proxy pour nous éviter d'avoir à gérer les ports dans nos urls quand on développe ainsi que les conflits de ports lorsque plusieurs projets tournent en parallèle. Portainer une ui pour gérer ses conteneurs docker.

En temps normal ces deux conteneurs sont dans une stack à part, justement pour pouvoir travailler sur plusieurs projets à la fois, pour le cadre de ce test je l'inclus dans cette stack.

## PHP
J'utilise une image de thecodingmachine, qui contient php avec composer préinstallé et la possibilité d'ajouter/activer facilement des extensions. De plus il a un système qui permet d'éviter les conflits d'utilisateurs sans avoir à passer son id linux, c'est bien pratique.

## nginx
Je suis encore fâché avec le server du cli symfony qui ne peut gérer qu'une requête à la fois (j'ai eu plusieurs fois des bugs qui ne pouvaient pas être reproduits en local à cause de ça) donc je fais passer les requêtes par nginx. De plus, le script qui permet au conteneur php d'avoir le bon id utilisateur ne fonctionne plus bien si on ne le laisse pas lancer fpm, bien que ce soit un problème facilement contournable.

## postgresql
Image officielle de la base de données. Première fois à vrai dire que je n'utilise pas mysql, je ne vais pas tenter de faire le fou tout de suite avec cette base

## Node
Je ne suis pas un grand connaisseur des images nodes disponibles donc je reste sur l'officielle. En cas de besoin on peut toujours l'améliorer avec un dockerfile.

A noter que thecodingmachine a construit une image node avec les mêmes avantages que celle pour php, à savoir une gestion de l'id utilisateur pour éviter les conflits de droits mais ils ont eu la mauvaise idée de ne pas publier les images pour les versions mineures. Ils le justifient en disant qu'il n'y a pas de problème de rétrocompatibilité à utiliser une image avec une version plus haute mais ça me pose problème parce que ça empêche d'être iso avec les environnements de production qui on souvent une version figée de node.

NB: Je me rends compte en écrivant que ce n'est pas un problème dans le cadre de ce test puisque l'on utilise node seulement en développement et build (pas de serveur node qui tourne en production). J'aurais finalement pu utiliser leur image. 
