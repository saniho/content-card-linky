# content-card-linky
[![HACS Supported](https://img.shields.io/badge/HACS-Supported-green.svg)](https://github.com/custom-components/hacs)

**Cette carte est compatible avec l'integration : [MyEnedis](https://github.com/saniho/apiEnedis)**

**Un question ? Un problème ? Une demande ? Venez en parler sur le [fil de discussion dédié](https://forum.hacf.fr/t/sensor-pour-enedis-apienedis/935) sur le [forum HACF](https://forum.hacf.fr/).**

## Bienvenue !

Cette intégration fonctionne à l'aide de la passerelle fournie par https://enedisgateway.tech/.

Cette carte est initialement inspirée de [@royto](https://github.com/royto/linky-card)

Avant de pouvoir utiliser cette intégration, assurez vous : 
* D'avoir validé la partage de données avec la [passerelle](https://enedisgateway.tech/),
* D'avoir activé sur votre [espace privé Enedis](https://mon-compte-client.enedis.fr/) la remontée des informations de votre linky,
* Et d'avoir installé l'integration [MyEnedis](https://github.com/saniho/apiEnedis).

## Installer la carte
<details>
  <summary><b>Via HACS (mise à jour en un clic) : </b></summary><br>
 
* Ouvrez HACS, cliquez sur `Frontend`, puis selectionnez le menu 3 points en haut à droite.
 
 *si vous n'avez pas HACS, pour l'installer cela se passe ici : [HACS : Ajoutez des modules et des cartes personnalisées](https://forum.hacf.fr/t/hacs-ajoutez-des-modules-et-des-cartes-personnalisees/359)
 
* Ajoutez le dépot personnalisé : `https://github.com/saniho/content-card-linky`

* Choisir la catégorie `Lovelace`

* Cliquez sur le bouton `Installer` de la carte
 
* Cliquez sur le bouton `Installer` de la popup
 
* La carte est maintenant rouge, signifiant qu'un redémarrage du serveur Home Assistant est nécessaire

* Accédez à la vue `Contrôle du serveur` (`Configuration` -> `Contrôle du serveur`), puis cliquez sur le bouton `Redémarrer` dans la zone `Gestion du serveur`
</details>

<details>
  <summary><b>Manuellement (à faire à chaque mise à jour)</b></summary>
* Telecharger le fichier [content-card-linky.js](https://github.com/saniho/content-card-linky/blob/main/content-card-linky.js) et le dossier [images](https://github.com/saniho/content-card-linky/tree/main/images) 
  
* Les mettre dans votre repertoire `www` et l'ajouter dans l'interface ressource
  
* Configurez la ressource dans votre fichier de configuration.
  
```
resources:
  - url: /hacsfiles/content-card-linky/content-card-linky.js
    type: module
```
</details>

## Ajouter la carte
<details>
  <summary><b>Via l'interface graphique</b></summary>
  * Ajoutez une carte via l'interface graphique, et configurez les options comme vous le désirez.  

</details>
<details>
  <summary><b>En YAML</b></summary>
  * Dans votre éditeur lovelace, ajouter ceci :

````
type: 'custom:content-card-linky'
entity: sensor.myenedis
````
</details>

### Redémarrer votre serveur Home Assistant

## Options disponibles

  ````
type: custom:content-card-linky                 Type de la carte
nbJoursAffichage: '7'                           Nombre de jour historique
titleName: Consommation d'hier                  Titre
entity: sensor.myenedis_09145007157315          Sensor de l'integration [MyEnedis](https://github.com/saniho/apiEnedis)
showIcon: false                                 Affiche l'icon Linky
showHistory: true                               Affiche l'historique sur plusieurs jours
showInTableUnit: false                          
showDayPriceHCHP: false
showDayHCHP: false                              
showMonthRatio: false                           
showTitle: true                                 
showPeakOffPeak: false
showDayPrice: true                              
showPrice: true                                 Affiche le prix de l'historique
showCurrentMonthRatio: true                     
showWeekRatio: true                             
showDayName: short                              Affichage des jours de la semaine : "short", "narrow", "long"
````

**************

N'hésitez pas à aller faire un tour sur ce forum ou vous trouverez pleins d'informations

https://forum.hacf.fr/t/hacs-ajoutez-des-modules-et-des-cartes-personnalisees/359 

*************
