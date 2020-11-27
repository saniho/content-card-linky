# cardLinky
cardLinky compatible avec le sensor apiEnedis/myenedis

https://github.com/saniho/apiEnedis

Cette card est initialement inspirée de [@royto](https://github.com/royto/linky-card)

Pour le faire fonctionner 

telecharger les fichiers et les mettre dans votre repertoire www et l'ajouter dans l'interface ressource

ou sinon via HACS, ajouter le depot personnaliser : https://github.com/saniho/content-card-linky

puis installer le card

et dans votre lovelace, ajouter ceci

````
type: 'custom:content-card-linky'
entity: sensor.myenedis
````

les options suivantes sont disponibles

voir l'icone linky
````
showIcon: True
showHistory : true
showPeakOffPeak: true
showInTableUnit : false
showDayPrice : false
showDayPriceHCHP: false
showDayHCHP: false
````
