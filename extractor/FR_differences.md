Voici l'analyse complète des différences entre **`R:\YDKJ.ISO`** et **`R:\YDKJ2.ISO`** (ainsi que leurs extractions `R:\YDKJ` et `R:\YDKJ2`).

---

### 1. Quelle version est laquelle ?

- **`R:\YDKJ.ISO` (783 fichiers `.SRF`, 743 questions, MD5 `QHEADERS.SRF` = `e25763f3dba7348d34c02bc1315834c3`)** est une **version pré-finale / master v1.0 non corrigée** :
  - Les crédits (`CREDITS.SRF`) contiennent encore des textes de remplissage (*« bidule »*, *« Ujnmu »*, *« Satan / Beelzebub / Lucifer »*).
  - Les réponses alternatives des Rimatologies (`Wrds`) contiennent un bug de formatage qui empêche le jeu d'accepter les orthographes tolérées.
  - De nombreuses fautes d'orthographe, de typographie ou de marques déposées (`™`) sont présentes.
- **`R:\YDKJ2.ISO` (785 fichiers `.SRF` dont 8 dans `Riviera/`, 737 questions, MD5 `QHEADERS.SRF` = `4779ff2519fdd14273a95b94e08e33f2`)** est la **version finale / patchée (v1.1 retail)** :
  - Crédits finalisés, fautes corrigées, certaines questions censurées/réécrites (droits Disney, allusions politiques ou vulgarité), bug des Rimatologies corrigé, et ajout d'un chunk `Nuke` dans `QHEADERS.SRF`.

---

### 2. Différences sur le catalogue de questions ($743 - 21 + 15 = 737$)

#### A. 21 questions présentes uniquement dans `YDKJ.ISO` (supprimées dans `YDKJ2.ISO`)
**12 questions normales :**
| ID | Dossier | Titre | Valeur | Réponse |
| :--- | :--- | :--- | :---: | :---: |
| `AFX` | `QFOLD4/AFX` | *Bien après J-C* | 3 | 2 |
| `AIQ` | `QFOLD6/AIQ` | *Aboule les boules* | 1 | 4 |
| `AKN` | `QFOLD7/AKN` | *Je bricole et je suis à la masse* | 1 | 2 |
| `ALV` | `QFOLD8/ALV` | *C’est occupé !* | 3 | 1 |
| `AXT` | `QFOLD8/AXT` | *La bosse des maths* | 3 | 1 |
| `AYC` | `QFOLD8/AYC` | *Da dan da da da da da* | 1 | 1 |
| `AYH` | `QFOLD8/AYH` | *Trotte toujours tu m’intéresses* | 3 | 3 |
| `AYL` | `QFOLD8/AYL` | *C’est cul-cul mais on aime* | 2 | 4 |
| `AYR` | `QFOLD9/AYR` | *Tate donc poupée ! !* | 3 | 2 |
| `BAA` | `QFOLD9/BAA` | *Le petit cochonnet* | 1 | 3 |
| `BGW` | `QFOLD13/BGW` | *Je suis, donc je suis* | 2 | 3 |
| `BHG` | `QFOLD13/BHG` | *Tiens ma poule* | 1 | 2 |

**9 JackAttacks (`QFOLD16` et `QFOLD17`) :**
- `JBC` (*C’est beau quand c’est en couleur*), `JBD` (*Mais ça sert à quoi ?*), `JBE` (*Magicae formulae*), `JBF` (*Le cri qui tue*), `JBG` (*Monte là-dessus …*), `JBH` (*L’invention selon saint Marque*), `JBI` (*La ville éternelle*), `JBJ` (*4 mariages et des noces d’argent*), `JBK` (*Ça fleure bon la province*).

#### B. 15 questions présentes uniquement dans `YDKJ2.ISO` (ajoutées dans `YDKJ2.ISO`)
**5 questions normales :**
| ID | Dossier | Titre | Valeur | Réponse |
| :--- | :--- | :--- | :---: | :---: |
| `AGV` | `QFOLD5/AGV` | *Les hommes préfèrent les blondes* | 2 | 3 |
| `AGY` | `QFOLD5/AGY` | *Boum ! Boum !* | 2 | 4 |
| `AGZ` | `QFOLD5/AGZ` | *Papa, c’est encore loin l’Amérique ?* | 1 | 1 |
| `AHA` | `QFOLD5/AHA` | *Allez directement en prison, sans passer par le terrain* | 1 | 4 |
| `BLA` | `QFOLD15/BLA` | *T’es au courant ?* | 1 | 4 |

**10 JackAttacks (`QFOLD19`) :**
- `JBT` (*Expressionnément vôtre*), `JBU` (*Le prénom précède le nom …*), `JBV` (*T’habites à 80 km de Tours*), `JBW` (*Passe la monnaie*), `JBX` (*Poulet français, monsieur …*), `JBY` (*Silence, on broute !*), `JBZ` (*Où tu vas, là, doudou, dis donc ?*), `JCA` (*C’est mon truc à moi …*), `JCB` (*T’es fait pour quoi, toi ?*), `JCC` (*Des noms ! … Des noms !*).

---

### 3. Questions modifiées sur le fond (Gameplay, Réécritures, Censure/Droits)

Au-delà des ~150 corrections orthographiques/typographiques (`chlorydrique` → `chlorhydrique`, `Colombo` → `Columbo`, `Mitterand` → `Mitterrand`, `Sanson`, `Gilles de Rais`, `Incitatus`, guillemets français, espaces doubles), plusieurs questions ont changé de **paramètres** ou ont été **réécrites et réenregistrées en audio** :

1. **Corrections de paramètres dans `QHEADERS.SRF`** :
   - **`BKG`** (* La vie en jaune*) : la bonne réponse passe de **`3` (`un bus jaune`) à `4` (`un taxi jaune`)**, et les choix 3 et 4 ont été modifiés (`un taxi jaune` / `un bus multicolore`).
   - **`BHZ`** (*Maman, les p’tits bateaux*) : la valeur de la question passe de **`1` à `2`**.
   - **`AXM`** (*Bang ! T’es mort …*) : ajout d'une question forcée **`forced = 'AXL'`** dans `YDKJ2` (`None` dans `YDKJ`).

2. **Questions réécrites (et réenregistrées en audio) pour raisons éditoriales ou juridiques** :
   - **`AHC`** : *« Disney™ au logisme »* (avec Picsou et Géo Trouvetou) devient *« Xavière au vinaigre »* (avec l'Essonne et les services techniques — référence à l'affaire Xavière Tibéri).
   - **`BFC`** : *« Si Flairsou savait »* (avec Gontrand, Donald et Picsou) devient *« Ça va les enfants ! ? ! »* (avec Gnafron, Guignol et le gendarme).
   - **`AZT`** : Pan-Pan (Bambi) et Daffy Duck sont remplacés par *Peter Pan et Gros-Bec le canard*.
   - **`BFA`** : la réponse *« un dalmatien nommé Pongo »* devient *« un bâtard nommé Rantanplan »*.
   - **`AKO`** : *« La France aux Français »* (*« Mais si tu leur demandais, aux Frontistes, de qui Charles Martel est le géniteur... »*) est entièrement réécrite en *« Comment vas-tu, vieille branche ? »* (sans référence au FN).
   - **`BHL`** : *« Alice au pays des merdes vieilles… »* (où Alice *« se roule un joint »* et les réponses sont *« va bouffer ta merde, connard ! »*, *« va te faire mettre chez les grecs ! »*, *« va te faire sucer chez les nains ! »*) est adoucie en *« Pipi-caca-poubelle… »* (*« Alice cassée au thé »*, *« mange ta crotte, Charlot ! »*, *« rentre chez ta mère, Albert ! »*, *« arrête le prozac™, Jean-Jacques ! »*).
   - **`AGJ`** : le gâteau bourré de dynamite envoyé par les Lockridge aux Capwell devient un gâteau d'anniversaire de fin de tournage.
   - **`BDH`** : toutes les réponses ont été changées pour inclure le nom de famille *« Cake »* (`Zoé Cake`, `Jacus Diplodocus Cakos`, `Jack Cake`, `Archéoptérix Cake`).
   - **`BGG`** : *« exciter Jane Manson »* / *« j’ai une trompe à la Dumbo, petite fille »* devient *« exciter sa femme »* / *« viens voir le gorille dans la brume, petite »*.
   - **`BLJ`** : correction d'une erreur factuelle dans le choix 1 : *« la sonate au clair de lune par Mozart »* → *« par Beethoven »*.
   - **`BBO`** : *« 8ème étage »* corrigé en *« 7ème étage »* (pour la Tour de Pise).
   - **`AKC`**, **`ALK`**, **`AZV`**, **`BAB`**, **`BAG`**, **`BAQ`** : énoncés et/ou choix reformulés et réenregistrés.

3. **Décalage des dossiers `QFOLD2` à `QFOLD19`** :
   - Comme des questions ont été retirées et ajoutées, **179 questions** ont changé de dossier `QFOLDx` entre `YDKJ.ISO` et `YDKJ2.ISO` (souvent décalées d'un dossier, ou déplacées vers `QFOLD19`).

---

### 4. Correction majeure dans les Rimatologies (`QFOLD17` / `QFOLD18`, chunk `Wrds`)

Dans `YDKJ.ISO`, pour presque toutes les questions de Rimatologie (`GAA` à `GBQ`), les variantes orthographiques acceptées au clavier dans la ressource `Wrds` étaient stockées sous forme d'une **seule chaîne séparée par des virgules** au lieu d'une liste de chaînes distinctes :
- `YDKJ.ISO` : `['Tiens', 'Tiens', 'tiens, tient, tien, teins, trein']`
- `YDKJ2.ISO` : `['Tiens', 'Tiens', 'tiens', 'tient', 'tien', 'teins', 'trein']`

De plus, plusieurs Rimatologies (`GAH`, `GAM`, `GAN`, `GBL`, `GBO`, `GBQ`, `GAY`) n'avaient **aucune** variante orthographique dans `YDKJ.ISO` et se sont vu ajouter des tolérances de frappe dans `YDKJ2.ISO`.

---

### 5. Différences dans les fichiers système à la racine

- **`CREDITS.SRF`** :
  - Dans `YDKJ.ISO`, de nombreux postes ont pour valeur **`bidule`** (*Packaging: bidule*, *Opérations: bidule*, *Livret d'utilisation: bidule*, *Producteur Jingles: bidule*, *Production des pubs: bidule*), **`Ujnmu`** (*Marketing Manager*), ou encore **`Satan / Beelzebub / Lucifer / Belial / ...`** (*Marketing pour Berkeley Systems & BMG*).
  - Dans `YDKJ2.ISO`, tous les vrais noms sont renseignés (Dan Houser, Sam Houser, Lucienach, etc.).
- **`INTRO1.SRF`** :
  - La liste de prénoms `('STRL', 128)` contenait encore les prénoms de l'équipe américaine dans `YDKJ.ISO` (`Harry, John, Martin, Julie, Tom, Howard...`) et a été remplacée par des prénoms français dans `YDKJ2.ISO` (`David, Marité, Marjorie, Frédéric, Olivier...`).
  - Dans `('STRL', 90)` (noms automatiques de joueurs), `'Foune'` est devenu `'Foufoune'`, et `'Pétrol Hahn'` / `'Wizard'` ont reçu le symbole `™`.
- **`HISCORES.SRF`** :
  - `('STR', 510)` : `'Jane Birkin'` (`YDKJ.ISO`) → `'Jane'` (`YDKJ2.ISO`).
- **`ENDGAME.SRF`**, **`DDSND.SRF`**, **`GIBBER.SRF`**, **`JACKSND1.SRF`**, **`JATTACK2.SRF`** :
  - Quelques pistes audio (`snd`) ont été réenregistrées ou nettoyées, et `JACKSND1.SRF` dans `YDKJ.ISO` contient un sous-fichier audio `Mc92/2` supprimé dans `YDKJ2.ISO`.
