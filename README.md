# simu-gravite

Simulation de gravitation newtonienne entre plusieurs corps, rendue en 3D dans le navigateur avec three.js.

La scène par défaut place un petit corps en orbite circulaire autour d'un corps massif. Le moteur physique est écrit à la main, sans bibliothèque de physique : vecteurs, loi de gravitation et intégration du mouvement.

## Lancer

Prérequis : Node ≥ 20.

```bash
npm install
npm run dev
```

Puis ouvrir l'URL affichée par Vite. La caméra se pilote à la souris : clic gauche pour tourner, molette pour zoomer, clic droit pour se déplacer.

## Ce que calcule la simulation

### 1. Loi de gravitation (avec adoucissement)

Chaque corps $A$ subit l'attraction de tous les autres. Pour un corps $B$, l'accélération imposée à $A$ est :

$$
\vec a_{A \leftarrow B} = \frac{G \, m_B \, (\vec r_B - \vec r_A)}{\left(\lVert \vec r_B - \vec r_A \rVert^2 + \varepsilon^2\right)^{3/2}}
$$

- Sans le terme $\varepsilon$, c'est la loi de Newton classique $G m_B / d^2$, écrite sous forme vectorielle : le vecteur direction non normalisé est divisé par $d^3$.
- $\varepsilon$ est l'**adoucissement de Plummer** (*softening*). Quand deux corps se rapprochent, $1/d^2$ tend vers l'infini et la simulation explose. Avec $\varepsilon$, la force reste bornée à courte distance, tandis qu'à grande distance ($d \gg \varepsilon$) on retrouve exactement Newton.
- Les unités sont normalisées : $G = 1$ et $\varepsilon = 10$ (`src/physics/gravitation.ts`).

L'accélération totale d'un corps est la somme sur tous les autres corps. Ce calcul est en $O(n^2)$, ce qui convient pour quelques dizaines ou centaines de corps.

### 2. Intégration du mouvement : Euler semi-implicite

À chaque pas de temps $\Delta t$ (`src/physics/simulation.ts`), on calcule d'abord toutes les accélérations, puis on met à jour chaque corps :

$$
\vec v_{n+1} = \vec v_n + \vec a_n \, \Delta t \qquad
\vec r_{n+1} = \vec r_n + \vec v_{n+1} \, \Delta t
$$

Le détail qui compte est que la position est mise à jour avec la **nouvelle** vitesse. Ce schéma est **symplectique** : l'énergie oscille autour de sa vraie valeur au lieu de dériver. Une orbite reste donc fermée sur la durée, alors qu'avec un Euler explicite classique (position mise à jour avec l'ancienne vitesse) elle s'élargirait en spirale.

Chaque image calcule 10 sous-pas de $\Delta t = 1/600$, soit $1/60$ d'unité de temps par image.

### 3. La vitesse d'orbite circulaire

Pour qu'un corps tourne en cercle à la distance $d$ d'une masse $M$, l'attraction doit fournir exactement l'accélération centripète :

$$
\frac{v^2}{d} = \frac{G M}{d^2} \quad\Longrightarrow\quad v = \sqrt{\frac{G M}{d}}
$$

Avec $M = 2\,000\,000$ et $d = 200$, on obtient $v = 100$, pour une période $T = 2\pi d / v \approx 12{,}6$ unités de temps, soit environ 12,6 s à 60 images/s.

L'adoucissement réduit légèrement la force réelle à cette distance, d'un facteur $(1 + \varepsilon^2/d^2)^{-3/2} \approx 0{,}996$. L'orbite est donc très légèrement elliptique plutôt que parfaitement circulaire.

## Structure

```
src/
  physics/
    vector.ts       vecteur 3D immuable (addition, soustraction, multiplication par un scalaire, norme)
    body.ts         corps : position, vitesse, masse, accélération
    gravitation.ts  loi de gravitation adoucie
    simulation.ts   calcul des accélérations + intégration
  render/
    canvas.ts       premier rendu 2D (Canvas), conservé pour référence
  main.ts           scène three.js, conditions initiales, boucle d'animation
```

## Pistes

- **Autres intégrateurs** (`integrators.ts` est prévu pour ça) : Velocity Verlet / leapfrog (ordre 2, symplectique), RK4, pour comparer leur précision.
- **Afficher l'énergie totale** (cinétique + potentielle) au fil du temps, pour mesurer la qualité de chaque intégrateur.
- **Traînées d'orbite** et taille ou couleur des sphères en fonction de la masse.
- **Scénarios** : problème à trois corps, orbite en huit de Chenciner–Montgomery, système solaire simplifié.
- Exploiter la 3ᵉ loi de Newton ($\vec F_{AB} = -\vec F_{BA}$) pour calculer chaque paire une seule fois, puis Barnes–Hut ($O(n \log n)$) pour beaucoup de corps.
