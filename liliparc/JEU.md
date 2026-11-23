# 🎪 Lili Parc — documentation du jeu

> Jeu de gestion de fête foraine pour enfants, avec Ellie (robot vert) et Livia (robot rose) de [L'atelier de Lili](https://lilirobot.com). Monnaie : les **LiliDollars (L$)**.
> But pédagogique : apprendre à **faire fructifier** son argent (prix justes, épargne, investissements, entretien).

- **Adresse** : https://lilirobot.com/liliparc/ (installable sur téléphone comme une application)
- **Code** : `liliparc/index.html` (tout le jeu tient dans ce fichier), `liliparc/sw.js` (hors connexion), `liliparc/manifest.webmanifest`, `liliparc/img/` (Ellie et Livia)
- **Mise en ligne** : chaque fusion sur `main` est envoyée par FTP sur OVH (GitHub Actions, `.github/workflows/deploy.yml`)

_Ce document est à mettre à jour à chaque évolution du jeu._

## Sommaire
- [Démarrer : joueuses et niveaux](#démarrer--joueuses-et-niveaux)
- [Une journée au parc](#une-journée-au-parc)
- [L'argent](#largent)
- [Les attractions](#les-attractions)
- [Les méga-attractions bonus](#les-méga-attractions-bonus)
- [Le plan du parc](#le-plan-du-parc)
- [Agrandir, démolir](#agrandir-démolir)
- [Entretien](#entretien)
- [Sécurité, secours, propreté, espaces verts](#sécurité-secours-propreté-espaces-verts)
- [Santé du parc](#santé-du-parc)
- [Météo, jour et nuit](#météo-jour-et-nuit)
- [Événements spéciaux](#événements-spéciaux)
- [Anniversaires du parc](#anniversaires-du-parc)
- [Badges](#badges)
- [Conseils d'Ellie et Livia](#conseils-dellie-et-livia)
- [Affichage et téléphone](#affichage-et-téléphone)
- [Transférer une partie sur un autre téléphone](#transférer-une-partie-sur-un-autre-téléphone)
- [Réglages techniques](#réglages-techniques)
- [Historique des versions](#historique-des-versions)

## Démarrer : joueuses et niveaux

Au lancement, l'écran **« Qui joue ? »** liste les joueuses. Chacune a **sa propre fête foraine**, sauvegardée dans le navigateur du téléphone (`localStorage`, une clé par joueuse), et reprend là où elle s'était arrêtée. On peut créer une joueuse (prénom + avatar), la supprimer (🗑️), et changer de joueuse depuis le menu ⚙️. Le menu permet aussi de modifier son prénom et son avatar.

Le **niveau de jeu** se choisit au début de chaque partie et peut être changé à tout moment dans le menu ⚙️ :

| Niveau | Pour qui | Ce qui est actif |
|---|---|---|
| ⭐ Petit forain | Dès 6 ans  | petits montants pour bien compter ; construire, fixer les prix, épargner. L'entretien se paie tout seul. |
| ⭐⭐ Forain malin | Dès 8 ans  | en plus, choisir l'entretien, sécurité et secours, propreté, santé du parc et météo. |
| ⭐⭐⭐ Grand directeur | Dès 10 ans  | en plus, engager agents, ambulanciers et jardiniers, et entretenir l'herbe et les arbres. |

| Fonction | ⭐ | ⭐⭐ | ⭐⭐⭐ |
|---|:-:|:-:|:-:|
| Attractions, prix, billet d'entrée, tirelire | ✅ | ✅ | ✅ |
| Agrandir (Grand Parc), démolir | ✅ | ✅ | ✅ |
| Événements spéciaux, badges, méga-attractions | ✅ | ✅ | ✅ |
| Entretien payé automatiquement | ✅ | — | — |
| Entretien à choisir (fermetures, ×2, destruction) | — | ✅ | ✅ |
| Poste de sécurité et de secours | — | ✅ (un poste suffit) | ✅ (+ agents et ambulanciers) |
| Propreté (équipes de nettoyage) | — | ✅ | ✅ |
| Santé du parc ❤️ | — | ✅ | ✅ (+ espaces verts) |
| Météo (soleil, nuages, pluie, neige, orage) | — | ✅ | ✅ |
| Espaces verts (jardiniers) | — | — | ✅ |

## Une journée au parc

- Une journée dure **60 secondes** à vitesse normale (▶), plus vite avec ⏩, pause avec ⏸. Les fenêtres mettent le jeu en pause.
- Chaque petit personnage représente **un groupe de 8 visiteurs**. Les compteurs affichent le nombre réel de visiteurs.
- Les visiteurs arrivent par l'**entrée** (zone 1), paient le billet s'ils le trouvent correct, puis vont d'attraction en attraction selon leur argent de poche, le prix et l'attente (6 groupes au maximum par file).
- La fréquentation dépend de l'**attractivité** du parc (somme du « fun » des attractions), de la **note** des visiteurs (★), de la **météo**, des **événements**, et de la **santé du parc**.
- Le jour se lève, le soleil se couche, puis c'est la **nuit** : les attractions et les réverbères s'allument.
- Le soir, le **bilan du jour** affiche les recettes (billets, attractions), l'entretien, l'événement éventuel, le bénéfice, les intérêts de la tirelire, la santé du parc et la météo du lendemain, avec un conseil.

## L'argent

- On démarre avec une **pêche aux canards** et **800 L$** (niveaux 2 et 3) ou **100 L$** (niveau 1).
- **Niveau 1 = petits montants** pour les plus jeunes : chaque personnage est 1 visiteur et tous les prix, entretiens et récompenses sont **divisés par 8** (pêche aux canards 50 L$, Grand Huit 40 000 L$). Les niveaux 2 et 3 utilisent l'échelle réaliste (groupes de 8 visiteurs, montants ×8). Changer de niveau en cours de partie convertit l'argent automatiquement.
- **Prix** : chaque attraction a un « juste prix » par personne. Trop cher, les visiteurs refusent (« Trop cher ! ») ; pas assez cher, on gagne moins. La fenêtre de l'attraction indique ce que pensent les visiteurs (pas cher / juste prix / un peu cher / beaucoup trop cher). Le juste prix augmente avec le niveau de l'attraction.
- **Billet d'entrée** : son juste prix augmente avec le nombre et la qualité des attractions.
- **Tirelire 🐷** : l'argent rangé rapporte **5 % chaque nuit**. Il faut le reprendre pour le dépenser. Le soir, la tirelire peut servir à payer l'entretien ou un événement.
- **Améliorer** une attraction (jusqu'au niveau ★★★) : plus rapide, plus amusante, juste prix plus élevé, mais entretien plus cher. Coût : 75 % du prix × niveau actuel.

## Les attractions

Prix et entretien en L$ (niveaux 2 et 3 ; au niveau 1 : divisés par 8). « Juste prix » = prix d'un tour par personne, identique à tous les niveaux.

| | Attraction | Prix (niv. 2-3) | Prix (niv. 1) | Juste prix | Entretien / soir (niv. 2-3) | Fun |
|---|---|--:|--:|--:|--:|--:|
| 🦆 | **Pêche aux canards** — Attrape un canard et gagne un petit cadeau ! | 400 | 50 | 2 | 24 | 1 |
| 🍭 | **Barbe à papa** — Un gros nuage rose tout sucré. | 640 | 80 | 3 | 40 | 1 |
| 🥨 | **Churros** — Des churros tout chauds avec plein de sucre ! | 1 200 | 150 | 3 | 64 | 1 |
| 🥫 | **Chamboule-tout** — Fais tomber toutes les boîtes avec une balle ! | 2 000 | 250 | 4 | 80 | 2 |
| 🤸 | **Trampolines** — Boing ! Boing ! On saute jusqu'au ciel ! | 3 200 | 400 | 4 | 120 | 2 |
| 🎠 | **Carrousel** — Les chevaux de bois qui tournent en musique. | 4 800 | 600 | 5 | 200 | 3 |
| 🚂 | **Petit train** — Tchou tchou ! Tout le monde en voiture ! | 7 200 | 900 | 5 | 280 | 3 |
| ☕ | **Tasses tournantes** — On tourne, on tourne… la tête qui tourne ! | 9 600 | 1 200 | 6 | 360 | 3 |
| 🚗 | **Autos tamponneuses** — Bim ! Bam ! Boum ! On se rentre dedans. | 12 800 | 1 600 | 7 | 440 | 4 |
| 🏰 | **Château gonflable** — Un château tout mou où on rebondit partout. | 17 600 | 2 200 | 6 | 520 | 4 |
| 🏴‍☠️ | **Bateau pirate** — À l'abordage ! Le bateau se balance très haut. | 24 000 | 3 000 | 8 | 680 | 5 |
| 🎡 | **Grande roue** — Tout là-haut, on voit toute la fête ! | 32 000 | 4 000 | 8 | 800 | 5 |
| 🪂 | **Chaises volantes** — On vole en rond, les pieds dans le vide ! | 56 000 | 7 000 | 9 | 960 | 6 |
| 🎪 | **Grand chapiteau** — Jongleurs, acrobates et clowns sous le grand chapiteau ! | 68 000 | 8 500 | 10 | 1 120 | 6 |
| 👻 | **Train fantôme** — Hou hou… même pas peur ! | 80 000 | 10 000 | 10 | 1 200 | 6 |
| 🛶 | **Rivière sauvage** — En bateau sur la rivière… et SPLASH dans la grande descente ! | 112 000 | 14 000 | 12 | 1 520 | 7 |
| 🗼 | **Tour de chute** — On monte tout doucement… et AAAAH ça tombe ! | 144 000 | 18 000 | 13 | 1 760 | 8 |
| 🌀 | **Pendule géant** — Le grand bras se balance jusqu'au ciel en tournant sur lui-même ! | 224 000 | 28 000 | 14 | 2 160 | 10 |
| 🎢 | **Grand Huit Galactique** — L'attraction à sensation la plus folle de l'univers ! | 320 000 | 40 000 | 15 | 2 560 | 12 |

Le but : construire les 19 attractions, jusqu'au **Grand Huit Galactique** (écran de victoire). On peut continuer à jouer ensuite.

## Les méga-attractions bonus

Débloquées par les **badges** (3, 6 puis 9 badges ; montants ÷8 au niveau 1), elles ne font pas partie de l'objectif mais rapportent beaucoup.

| | Méga-attraction | Badges nécessaires | Prix | Juste prix | Entretien | Fun |
|---|---|:-:|--:|--:|--:|--:|
| 🌈 | **Toboggan Arc-en-ciel** | 3 | 48 000 | 10 | 880 | 9 |
| 🐉 | **Dragon Volant** | 6 | 120 000 | 14 | 1 600 | 12 |
| 🤖 | **Lili-Robot Géant** | 9 | 240 000 | 18 | 2 240 | 16 |

## Le plan du parc

- Chaque zone a une **grande rue qui serpente**, une **place ronde avec fontaine** au milieu, une rue qui la **croise** (vers le **kiosque à musique** en haut et un **jardin** en bas dans la zone 1 ; vers la **statue de Lili** et un jardin fleuri dans le Grand Parc), et une **petite allée** qui mène à chaque attraction. Arbres, buissons, fleurs, fanions et réverbères décorent le parc.
- Les visiteurs **suivent les rues** (chacun garde sa droite), font la queue dans l'allée de l'attraction, et vont parfois se promener vers le kiosque ou le jardin.
- Les postes de **sécurité** et de **secours** s'installent dans le jardin du bas de la zone 1.
- Bouton **🔭 Tout voir** : vue d'ensemble des deux zones sur un seul écran, avec l'enseigne « Lili Parc », le parking et la forêt autour. On peut y cliquer sur une attraction, ou ailleurs dans une zone pour zoomer dessus (**🔍 Zoomer** pour revenir). Tant que le Grand Parc n'est pas acheté, il apparaît « à vendre ».
- Les terrains font 82 % de leur taille d'avant pour laisser la place aux rues ; la vitesse des visiteurs a été ajustée pour garder le même rythme de jeu.

## Agrandir, démolir

- La fête démarre avec **8 terrains**. Le panneau « 🔒 Agrandir » au bout de l'allée (ou le bouton 🗺️) permet d'acheter le **Grand Parc** pour **12 000 L$** : 8 terrains de plus. Les visiteurs circulent entre les deux zones ; le bouton ➡️/⬅️ change de vue.
- 16 terrains pour 19 attractions (+3 méga) : pour tout construire, il faut **démolir** (🧨 dans la fenêtre d'une attraction). On récupère 25 % du prix de construction ; les améliorations sont perdues. Conseil : démolir celle qui rapporte le moins par rapport à son entretien.

## Entretien

- Chaque soir, on paie l'entretien des attractions et des services.
- **Niveau 1** : payé automatiquement (le porte-monnaie, puis la tirelire, puis « dans le rouge »).
- **Niveaux 2 et 3** : s'il n'y a pas assez d'argent, une fenêtre permet de **choisir** ce qu'on entretient (avec ce que chaque attraction a rapporté dans la journée), et de puiser dans la tirelire. Ce qui n'est pas entretenu est **fermé le lendemain** (aucun visiteur, aucune recette), son entretien **double** à chaque soir oublié (×2, ×4), et après **3 soirs** sans entretien, c'est **détruit**.

## Sécurité, secours, propreté, espaces verts

Tout se gère avec le bouton **🛠️ Services** (niveaux 2 et 3). Rien ne prend de terrain.

| Service | Coût | Entretien / soir | Règle |
|---|--:|--:|---|
| 🛡️ Poste de sécurité | 9 600 | 240 | Obligatoire dès **500 visiteurs** dans la journée. Au niveau 3, il couvre 1 000 visiteurs avec 1 agent ; chaque **agent 👮** de plus (1 600 L$ puis 200 L$/soir) protège **+500** visiteurs. |
| ⛑️ Poste de secours | 20 000 | 400 | Obligatoire dès **1 000 visiteurs**. Au niveau 3, chaque **ambulancier 🚑** de plus (2 400 L$ puis 280 L$/soir) protège **+1 000** visiteurs. |
| 🧹 Équipe de nettoyage | 3 200 | 120 | **1 équipe pour 250 visiteurs** par jour. Une équipe est offerte au départ. Au-delà, le parc se salit (papiers, canettes visibles) ; chaque équipe nettoie la nuit. |
| 🌳 Jardinier (niveau 3) | 1 200 | 160 | L'herbe et les buissons poussent chaque jour (−12 %) ; chaque jardinier en coupe +7 %. **2 jardiniers** gardent le parc beau. Un jardinier est offert au départ. |

Sans sécurité ou secours suffisants, les visiteurs suivants **ont peur et font demi-tour** (« j'ai peur ! »). Ellie prévient un peu avant chaque seuil.

## Santé du parc

Jauge **❤️** (niveaux 2 et 3), cliquable pour le détail. Elle combine :

| Composante | Niveau 2 | Niveau 3 |
|---|--:|--:|
| 🔧 Attractions ouvertes (non fermées faute d'entretien) | 35 % | 30 % |
| 🧹 Propreté | 35 % | 25 % |
| 🛡️ Sécurité suffisante pour la fréquentation | 15 % | 12,5 % |
| ⛑️ Secours suffisants | 15 % | 12,5 % |
| 🌳 Espaces verts | — | 20 % |

Sous 100 %, une partie des visiteurs fait demi-tour à l'entrée (« Beurk, c'est sale ! », « C'est mal entretenu… ») : proportion = 65 % × (1 − santé).

## Météo, jour et nuit

Niveaux 2 et 3. La météo du lendemain est annoncée dans le bilan du soir et dans les propositions d'événement.

| Météo | Effet sur les visiteurs | Chance |
|---|---|--:|
| ☀️ Soleil | ×1,15 (un peu plus de visiteurs) | 48 % |
| ⛅ Nuageux | ×1 (rien de spécial) | 25 % |
| 🌧️ Pluie | ×0,55 (beaucoup moins de visiteurs) | 14 % |
| ❄️ Neige | ×0,75 (moins de visiteurs, mais c'est très joli) | 8 % |
| ⛈️ Orage | ×0,45 (presque personne ne vient) | 5 % |

À l'écran : nuages qui passent, pluie, neige qui tombe et sol blanchi, orage avec éclairs. Chaque journée finit par un coucher de soleil puis la nuit, avec les lumières des attractions, des guirlandes et des réverbères (tous niveaux).

## Événements spéciaux

À partir du jour 4, environ tous les 3 à 6 jours, un événement est proposé le soir **pour le lendemain**. On le **paie le lendemain matin** (porte-monnaie puis tirelire) : s'il manque de l'argent à ce moment-là, l'événement est **raté**. C'est la récompense de l'épargne. Le prix suit les recettes habituelles (moyenne des 3 derniers jours normaux × coefficient, avec un minimum). Pendant l'événement, plus de visiteurs peuvent être présents en même temps.

| Événement | Effet | Prix |
|---|---|---|
| 🎅 La visite du Père Noël | 4 fois plus de visiteurs (+300 %) | 1 × recettes moyennes (min. 2 400 L$) |
| 🎆 Le grand feu d'artifice | 2,5 fois plus de visiteurs (+150 %) | 0,5 × recettes moyennes (min. 1 200 L$) |
| 🎤 Le concert d'Ellie et Livia | +80 % de visiteurs, et ils acceptent de payer plus cher | 0,5 × recettes moyennes (min. 1 200 L$) |
| 🤡 La parade des clowns | 2 fois plus de visiteurs, et la note de ta fête monte | 0,4 × recettes moyennes (min. 800 L$) |
| 🚌 La sortie des écoles | 3 fois plus de visiteurs… mais avec peu d'argent de poche | 0,6 × recettes moyennes (min. 800 L$) |

Attention : un gros événement attire du monde ; il faut la sécurité, les secours et assez d'équipes de nettoyage, sinon il rapporte beaucoup moins.

## Anniversaires du parc

Tous les **100 jours** (100, 200, 300…) et le **jour 365**, le parc fête son anniversaire, automatiquement et gratuitement :

- une fenêtre de fête avec le bilan (argent gagné depuis le début, attractions, meilleure journée, badges) ;
- un **cadeau d'Ellie et Livia** : 1 000 L$ × échelle (8 000 L$ aux niveaux 2 et 3, 1 000 L$ au niveau 1), le double pour 1 an ;
- une journée de fête : **3 fois plus de visiteurs**, de bonne humeur (ils dépensent plus), la note monte ;
- dans l'allée : un **gâteau géant** avec ses bougies et le nombre de jours, des **ballons** qui s'envolent et un **feu d'artifice** ;
- le badge **🎂 Joyeux anniversaire** (100 jours).

Une partie qui a déjà dépassé le cap fête l'anniversaire dès le jour suivant. Si un événement était réservé, il est décalé au lendemain.

## Badges

Bouton **🏅**. Chaque badge a son image (médaille dessinée pour Lili Parc, `liliparc/badges/<id>.webp`, 192 × 192, fond transparent), en couleur quand il est gagné et en gris sinon ; elle s'affiche aussi dans l'annonce du badge. Chaque badge rapporte des LiliDollars ; 3, 6 et 9 badges débloquent les méga-attractions. Montants des niveaux 2 et 3 ; au niveau 1, seuils et récompenses sont divisés par 8 (arrondis).

| | Badge | Condition | Récompense | Niveau |
|---|---|---|--:|:-:|
| 👥 | **Premiers fans** | 300 visiteurs en une journée | +800 L$ | ⭐+ |
| 💯 | **Plein de monde !** | 1 000 visiteurs en une journée | +2 400 L$ | ⭐+ |
| 🐷 | **Petit épargnant** | 4 000 L$ dans la tirelire | +1 200 L$ | ⭐+ |
| 🎠 | **Collectionneur** | 8 attractions en même temps | +4 000 L$ | ⭐+ |
| 🌟 | **Parc 5 étoiles** | Note des visiteurs de 4,5 ★ ou plus | +6 400 L$ | ⭐+ |
| 🎉 | **Grosse foule** | 2 000 visiteurs en une journée | +8 000 L$ | ⭐+ |
| 🎅 | **Organisateur** | 3 événements réussis | +8 000 L$ | ⭐+ |
| 🏦 | **Grand épargnant** | 80 000 L$ dans la tirelire | +12 000 L$ | ⭐+ |
| 🗺️ | **Parc complet** | 16 attractions en même temps | +16 000 L$ | ⭐+ |
| 🏟️ | **Fête géante** | 4 000 visiteurs en une journée | +24 000 L$ | ⭐+ |
| 💰 | **Grand forain** | 800 000 L$ gagnés en tout | +24 000 L$ | ⭐+ |
| 🧹 | **Parc tout propre** | 5 soirs de suite à 90 % de propreté | +4 800 L$ | ⭐⭐+ |
| 🛡️ | **Parc sécurisé** | Sécurité + secours, et 5 soirs sans visiteur effrayé (500 visiteurs ou plus) | +6 400 L$ | ⭐⭐+ |
| ❤️ | **Parc en pleine forme** | 7 soirs de suite avec une santé de 95 % ou plus | +12 000 L$ | ⭐⭐+ |
| 🎂 | **Joyeux anniversaire** | Fêter les 100 jours du parc | +8 000 L$ | ⭐+ |
| 🌳 | **Parc fleuri** | 7 soirs de suite avec des espaces verts à 90 % | +6 400 L$ | ⭐⭐⭐+ |

## Conseils d'Ellie et Livia

- Une barre d'astuce (et le bouton 💡 sur téléphone) donne le conseil du moment.
- Les bulles (pop-ups) sont **dégressives** : beaucoup d'aide les 3 premiers jours, puis de moins en moins (au plus 1 par jour, alertes de prix espacées). Les alertes importantes (dans le rouge, visiteurs effrayés) restent.
- Les déblocages d'attraction sont annoncés pour les 6 premières seulement.

## Affichage et téléphone

- **Icône de l'application** : Ellie et Livia devant une grande roue (`icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`).
- **Application** : sur Android, bouton « 📲 Installer » ; sur iPhone, Safari → Partager → « Sur l'écran d'accueil ». Le jeu marche hors connexion et l'écran reste allumé pendant que le jeu tourne.
- **Téléphone à l'horizontale** : infos à gauche, jeu au centre, boutons à droite, sans défilement. En portrait, Ellie demande de tourner le téléphone.
- **Dessins** : attractions dessinées en vectoriel et animées (le mode pixel art a été retiré).
- **Net partout** : le jeu est dessiné à la taille réelle de l'écran et selon sa densité de pixels (jusqu'à ×3) ; sur grand écran, il s'agrandit (jusqu'à 1 900 pixels de large) tant que tout tient en hauteur.

## Transférer une partie sur un autre téléphone

Menu ⚙️ → **📤 Envoyer ma partie** : le jeu affiche un **QR code** et un **code** (texte d'environ 500 caractères) qui contiennent toute la partie compressée, avec le prénom et l'avatar. Rien n'est envoyé sur un serveur.

- **Android** : scanner le QR code avec l'appareil photo de l'autre téléphone ; le lien ouvre Lili Parc et propose d'importer la partie.
- **iPhone** (l'app installée sur l'écran d'accueil ne partage pas ses données avec Safari) : **📋 Copier le code**, l'envoyer (message, mail…), puis dans le jeu de l'autre téléphone : « Qui joue ? » → **📥 J'ai un code**, coller, Récupérer.
- À l'import, on choisit : **➕ Nouvelle joueuse** ou **♻️ Remplacer** une joueuse existante.
- Le code est une photo de la partie à cet instant : les deux téléphones continuent ensuite chacun de leur côté.
- Technique : JSON → compression `deflate-raw` → base64url, préfixe `LP1.` ; lien `…/liliparc/#import=<code>` ; QR code généré localement (`liliparc/qrcode.js`, bibliothèque qrcode-generator, licence MIT).

## Réglages techniques

Constantes en haut du script de `index.html` :

- `GROUP` et `MUL` : visiteurs par personnage et multiplicateur des montants ; 8 aux niveaux 2-3, 1 au niveau 1 (`applyScale()`). Prix de base dans `DEFS` (niveau 1).
- `DAY = 60` s par journée, `MAXQ = 6` groupes par file, `BANK_RATE = 0.05`, `ZONE_COST = 12 000`.
- `DEFS` (attractions), `EVENTS`, `BADGES`, `SVC` et `STAFF` (services), `WEATHER`.
- **Plan du parc** : `COLS`, `ROWY` (position des terrains), `mainY()` (forme de la grande rue), `buildStreets()` (graphe des rues suivi par les visiteurs), `OVS` (zoom de la vue d'ensemble).
- **Ajouter une attraction** : une ligne dans `DEFS` + une fonction de dessin `dXxx(w,h,t,lvl)` (zone de 225 × 170) déclarée dans `DRAW`.
- **Ajouter un badge** : une ligne dans `BADGES` + son image ronde `badges/<id>.webp` (à ajouter aussi dans `SHELL` de `sw.js`).
- **Ajouter un jeu au menu Détente du site** : une ligne dans `JEUX` (`assets/menu.js`), avec `icon:APP("/<jeu>/icon-192.png")` pour afficher le logo de l'application.
- **Après chaque modification** : incrémenter `VERSION` dans `liliparc/sw.js` pour que l'app installée se mette à jour, et mettre à jour ce document.
- Sauvegardes : `lilipark-profiles` (liste des joueuses), `lilipark-<id>` (partie de chaque joueuse). L'ancienne clé `lilipark-v1` est reprise automatiquement comme « Joueuse 1 ».

## Historique des versions

- **PR #1** — première version : fête foraine, LiliDollars, Ellie et Livia, prix, tirelire, 8 attractions.
- **PR #2** — menu « Détente » sur lilirobot.com ; Lili Parc installable sur téléphone (hors connexion).
- **PR #3** — 16 attractions, zone « Grand Parc », affichage téléphone sans défilement.
- **PR #4** — écran toujours allumé, plus de recherche Google au toucher, aide dégressive, événements spéciaux.
- **PR #5** — événements plus rentables, 3 nouvelles attractions, démolition.
- **PR #6** — entretien à choisir (fermetures, destruction), postes de sécurité et de secours.
- **PR #7** — niveaux de jeu, propreté, personnel, espaces verts, santé du parc, météo, badges, 3 méga-attractions.
- **PR #8** — échelle réaliste (groupes de 8 visiteurs, prix ×8, ratios de personnel réalistes), mode pixel art, jour/nuit, neige et orage, profils de joueuses, cette documentation.
- **PR #9** — nouveau logo (grande roue derrière Ellie et Livia) ; niveau 1 en petits montants (÷8).
- **PR #12** — anniversaires du parc (100 jours, 200…, 1 an) ; transfert de partie par QR code ou code.
- **PR #15** — vraies images pixel art pour les 22 attractions, panneaux nets en mode pixel.
- **PR #16** — mode pixel art retiré ; images dessinées pour les 16 badges (fenêtre des badges et annonces).
- **PR #17** — logos des applications dans le menu Détente du site.
- **PR #18** — nouveau plan du parc (rues qui serpentent, places, carrefours, allées, décor), vue d'ensemble 🔭, dessin net sur tous les écrans et jeu plus grand sur grand écran.
