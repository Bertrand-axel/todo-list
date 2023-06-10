# Retours et documentation

## sommaire
Vous trouverez des explications détaillées sur la stack et les difficultés que j'ai rencontrées dans les pages suivantes

- [la stack docker](docker-stack.md)
- [back / api-platform](back-symfony.md)
- [front / react](front-react.md)

## Résumé / Temps de développement
Il m'a fallu environ 4h pour mettre en place la stack (phpstan et git hooks compris), 6h pour tout le back, le plus long ayant été le système d'identification, suivit par les test. Enfin le front a été la grosse difficulté du projet, au moins 12 heures sans compter l'apprentissage de react sur le tas, avec lequel on monte plutôt à 30h

## Lancer / tester
J'essaie toujours de faire en sorte d'éviter qu'il faille installer quoi que ce soit d'autre que docker et make pour lancer le projet

- `make first-install`
- Aller sur `http://mpp-todolist.localhost`
- se connecter avec "luffy@op.com"

