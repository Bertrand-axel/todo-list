# L'enfer du front

## Le choix de React
La plus grosse erreur de ma part a clairement été d'utiliser react que je ne maitrisais plus à la place d'angular. Ce choix a été principalement motivé par ma volonté de réapprendre le fonctionnement de la librairie mais une autre raison a été l'intégration automatique d'api-platform via react-admin. Je n'ai finalement pas utilisé react-admin parce que ce serait rentré en opposition avec mon objectif d'apprentissage mais ça me confirmait qu'il n'y aurait pas de point bloquant pour intégrer l'api.

Pour ce qui est de l'intégration, j'ai utilisé la bibliothèque mui qui m'a semblé la plus complete et avoir l'intégration la plus simple avec les formulaires de react-hook-form

## Difficultés

### Transfert de données et hooks
Pour avoir une base de code, j'ai d'abord utilisé [l'outil d'api-platform](https://api-platform.com/docs/create-client/react/#install) pour générer le front en react. Comme j'étais complètement novice à ce niveau là j'ai été particulièrement perturbé par les hooks qu'il met en place. Le workflow consistant à appeler un hook qui appel un autre hook qui set un ou plusieurs states et renvoie plusieurs objets et méthodes utilisés par les hooks intermédiaires, avant d'être renvoyés.

J'ai à présent saisi ce workflow mais cette façon de faire me pose certains problèmes. Il rend le code prompt à l'erreur, ne décorrèle pas les traitements et le rendu front et de ce fait le code me semblait bien dur à tester (non pas que je sache vraiment tester du front).

C'est pour ces raisons que j'ai créé un pseudo-container/pseudo-dependency-injector avec le hook useService (qui pourrait se dériver en useAuthService, useTaskService, useUserService, etc.) afin de retrouver une programmation moins procédurale et avec laquelle je suis plus à l'aise.

### Mui et react-hook-form

Autant certains composants comme l'input-text s'intègrent facilement entre react-hook-form et mui, autant d'autres comme l'autocomplete sont plus compliqués. Il m'a fallu du temps pour comprendre quels éléments du hook useForm doivent être transmis à quel node mui.

Ce n'était pas simple mais je suis assez satisfait du composant UserSelectInput.tsx par exemple.

Ce que je n'ai finalement pas réussi à bien faire par contre, c'est la validation en front des formulaires donc j'ai délégué cette tâche au back

## Conclusion

Après avoir remis mes choix de carrière plusieurs fois en question, je pense avoir une bonne compréhension des bases de react. C'était riche en information
