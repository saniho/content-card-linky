# cardLinky
cardLinky compatible avec le sensor apiEnedis/myenedis

https://github.com/saniho/apiEnedis

pour le faire fonctionner 

telecharger le fichier et le mettre dans votre repertoire www et l'ajouter dans l'interface ressource

ou sinon via HACS, ajouter le depot personnaliser : https://github.com/saniho/content-card-linky

puis installer le card

et dans votre lovelace, ajouter ceci

````
type: 'custom:content-card-linky'
entity: sensor.myenedis
````
