# Retour sur la stack back

## symfony api-platform
Le but était de faire un crud avec une gestion des droits, des contexts de sérialisation afin de communiquer efficacement avec le front. Api-platform gère tous ces aspects et je le maitrisais déjà en grande partie avant de commencer alors il me semblait tout indiqué.
J'essaie évidemment d'utiliser la dernière version.

## Les tests
Phpunit est facile à intégrer sur symfony et api-platform possède des outils pour simplifier l'écriture des tests (classe ApiTestCase).

Je n'ai pas souvent l'occasion d'écrire beaucoup de tests alors je me rends compte que la couverture est manquante, notamment sur la pagination, la recherche et le tri. Pour tester ces aspects j'ai hésité à utiliser AliceBundle ou écrire plus de fixtures mais je n'ai finalement pas pris de décision à ce sujet.

## Identification
Pour l'identification, j'avais en tête au début de garder la possibilité de s'identifier de plusieurs façons. Je voulais laisser la porte ouverte à une identification par mot de passe (classe Password) ou externe sans forcément avoir à les implémenter (saml, oauth), c'est pour cela que j'ai installé jwt plutôt que de fonctionner en session id. Accessoirement jwt évite beaucoup de problèmes de session lorsqu'on fait de la scalabilisation horizontale 

Pour ne pas alourdir le projet, je n'ai par contre pas mis en place le refresh de token parce que ça m'ouvrait des question qui sortaient du cadre du projet tel que "comment déconnecter un utilisateur de force ?"

Concernant la classe Password qui était présente au début du projet, son but était de décorréler la notion d'utilisateur et celle d'identification. Il n'y a à mon avis pas de raison que l'entité utilisateur porte une donnée telle qu'un hash de mot de passe alors que de plus en plus de sites délèguent l'identification à des sources externes (encore une fois, saml, oauth)

## Difficultés
La plus grosse difficulté m'a surprise, c'était l'identification sans mot de passe. Je ne m'étais pas dit qu'il n'existait pas déjà d'authenticator qui réponde à ce besoin donc j'ai dû me plonger dans le système de badges et passeports avec lequel je n'étais pas familier.
