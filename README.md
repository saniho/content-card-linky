# cardLinky
cardLinky compatible avec le sensor apiEnedis/myenedis

https://github.com/saniho/apiEnedis

pour le faire fonctionner 

ajouter dans les ressources du lien suivant : 

https://github.com/saniho/content-card-linky/blob/main/content-card-linky.js

et dans votre lovelace, ajouter ceci

````
type: 'custom:content-card-linky'
entity: sensor.myenedis
````