---
title: "Il Metodo del Punto di Sella e il Modello di Curie-Weiss"
summary: "Un'esplorazione dell'approssimazione di Laplace per gli integrali asintotici e la sua potente applicazione nella meccanica statistica del magnetismo."
date: 2026-07-15
tags: ["meccanica-statistica", "matematica", "fisica"]
math: true
showReadingTime: false
---

Nella meccanica statistica, ci troviamo spesso a dover valutare la funzione di partizione $Z$ per sistemi macroscopici, dove il numero di particelle $N$ è dell'ordine del numero di Avogadro ($10^{23}$). Calcolare esattamente queste somme o integrali multidimensionali è, nella maggior parte dei casi, analiticamente impossibile.

Tuttavia, proprio la vastità di $N$ viene in nostro soccorso grazie a una tecnica di analisi asintotica nota come **Metodo del Punto di Sella** (o *Approssimazione di Laplace*).

> "L'arte di fare matematica consiste nel trovare quel caso speciale che contiene tutti i germi di una generalità."  
> — *David Hilbert*

## 1. L'Approssimazione di Laplace

Consideriamo un integrale della forma:

$$ I(N) = \int_{a}^{b} e^{N f(x)} dx $$

dove $f(x)$ è una funzione reale, due volte derivabile, che possiede un unico massimo globale nel punto $x_0 \in (a, b)$. Quando $N \to \infty$, l'esponenziale amplifica enormemente il valore della funzione in prossimità del massimo, sopprimendo esponenzialmente i contributi lontani da $x_0$.

Possiamo espandere $f(x)$ in serie di Taylor attorno a $x_0$:

$$ f(x) \approx f(x_0) + f'(x_0)(x - x_0) + \frac{1}{2}f''(x_0)(x - x_0)^2 + \dots $$

Poiché $x_0$ è un massimo, la derivata prima si annulla ($f'(x_0) = 0$) e la derivata seconda è strettamente negativa ($f''(x_0) < 0$). Sostituendo questa espansione nell'integrale ed estendendo i limiti di integrazione a $\pm \infty$ (lecito nel limite di grandi $N$), otteniamo un classico integrale gaussiano:

$$ I(N) \approx e^{N f(x_0)} \int_{-\infty}^{\infty} e^{-\frac{1}{2} N |f''(x_0)| (x - x_0)^2} dx = e^{N f(x_0)} \sqrt{\frac{2\pi}{N |f''(x_0)|}} $$

Prendendo il logaritmo e dividendo per $N$, il termine della radice svanisce nel limite termodinamico ($N \to \infty$), lasciando un risultato di una semplicità disarmante:

$$ \lim_{N \to \infty} \frac{1}{N} \ln I(N) = f(x_0) $$

## 2. Il Modello di Curie-Weiss

Il modello di Curie-Weiss descrive il ferromagnetismo assumendo che ogni spin interagisca equamente con *tutti* gli altri spin del sistema (interazione a campo medio). 

L'Hamiltoniana per $N$ spin $\sigma_i \in \{-1, +1\}$ è data da:

$$ H = -\frac{J}{2N} \sum_{i=1}^N \sum_{j=1}^N \sigma_i \sigma_j - h \sum_{i=1}^N \sigma_i $$

* $J > 0$ è la costante di accoppiamento ferromagnetico.
* $h$ è il campo magnetico esterno.
* Il fattore $1/N$ garantisce che l'energia totale sia estensiva.

La funzione di partizione canonica è la somma su tutte le $2^N$ configurazioni possibili:

$$ Z_N = \sum_{\{\sigma_i\}} \exp\left[ \frac{\beta J}{2N} \left( \sum_{i=1}^N \sigma_i \right)^2 + \beta h \sum_{i=1}^N \sigma_i \right] $$

La difficoltà qui risiede nel termine quadratico $\left( \sum \sigma_i \right)^2$, che accoppia tutti gli spin, impedendoci di fattorizzare la somma. Per disaccoppiarli, utilizziamo un'identità matematica fondamentale.

<details>
<summary>La Trasformazione di Hubbard-Stratonovich</summary>

Questa trasformazione utilizza l'integrale gaussiano al contrario per linearizzare un termine quadratico nell'esponenziale. L'identità (conosciuta anche come trucco gaussiano) è:

$$ e^{\frac{a}{2} x^2} = \sqrt{\frac{a}{2\pi}} \int_{-\infty}^{\infty} e^{-\frac{a}{2} y^2 + a x y} dy $$

Sostituendo $a = \beta J N$ e $x = \frac{1}{N} \sum \sigma_i$, possiamo riscrivere il nostro esponenziale quadratico introducendo una variabile ausiliaria continua $m$ (che fisicamente rappresenterà la magnetizzazione media). Questo disaccoppia l'interazione tra gli spin al costo di aggiungere un integrale.

</details>

Applicando la trasformazione al nostro $Z_N$, dopo aver sommato sui singoli spin indipendenti $\sigma_i = \pm 1$, arriviamo a un'espressione puramente integrale:

$$ Z_N = \sqrt{\frac{\beta J N}{2\pi}} \int_{-\infty}^{\infty} e^{-N \beta f(m, h)} dm $$

dove abbiamo definito la funzione di "energia libera effettiva":

$$ f(m, h) = \frac{J}{2} m^2 - \frac{1}{\beta} \ln \left[ 2 \cosh(\beta J m + \beta h) \right] $$

## 3. Applicazione del Punto di Sella

Eccoci arrivati al punto cruciale. La funzione di partizione $Z_N$ è ora esattamente nella forma richiesta per il Metodo di Laplace! Nel limite termodinamico ($N \to \infty$), l'integrale è dominato dal valore di $m$ che *minimizza* $f(m, h)$ (poiché c'è un segno meno nell'esponenziale).

Per trovare questo punto di minimo (o di sella), imponiamo la derivata prima uguale a zero:

$$ \frac{\partial f(m, h)}{\partial m} = J m - \frac{1}{\beta} \frac{2 \sinh(\beta J m + \beta h)}{2 \cosh(\beta J m + \beta h)} \cdot (\beta J) = 0 $$

Semplificando, otteniamo la celebre **equazione di auto-consistenza** del modello di Curie-Weiss:

$$ m = \tanh(\beta J m + \beta h) $$

### Fasi del Sistema (con h = 0)

La soluzione di questa equazione trascendente determina le fasi del sistema magnetico.

| Temperatura | Soluzioni per $m$ | Stato Fisico | Comportamento del Materiale |
| :--- | :--- | :--- | :--- |
| $T > T_c$ | $m = 0$ (unica soluzione) | Disordinato | Paramagnetico (nessun magnetismo residuo) |
| $T < T_c$ | $m = 0$, $m = \pm m_0$ | Ordinato | Ferromagnetico (magnetizzazione spontanea) |

La temperatura critica $T_c$ (Temperatura di Curie) si trova ponendo $\beta_c J = 1$, il che implica $k_B T_c = J$.

## 4. Risoluzione Numerica

Dato che l'equazione $m = \tanh(\beta J m)$ non ha una soluzione analitica in forma chiusa per $T < T_c$, possiamo calcolarne facilmente le radici usando un semplice script Python con il metodo di bisezione o tramite librerie come `scipy`.

```python
import numpy as np
from scipy.optimize import root_scalar

def curie_weiss_magnetization(T, J=1.0):
    """
    Calcola la magnetizzazione spontanea m per una data temperatura T.
    """
    if T >= J:
        return 0.0 # Fase paramagnetica
    
    # Definiamo l'equazione di auto-consistenza f(m) = 0
    beta = 1.0 / T
    def f(m):
        return m - np.tanh(beta * J * m)
    
    # Cerchiamo la radice nell'intervallo [0.01, 1.0] (evitando la soluzione banale m=0)
    sol = root_scalar(f, bracket=[0.01, 0.999], method='brentq')
    
    return sol.root

# Esempio: Calcolo per T = 0.5 (Sotto la temperatura critica T_c = 1.0)
m_spontanea = curie_weiss_magnetization(0.5)
print(f"Magnetizzazione a T=0.5: {m_spontanea:.4f}")
```

Come abbiamo visto, il Metodo del Punto di Sella non è solo un semplice "trucco" matematico per risolvere integrali complessi. È un principio fisico profondo: nel limite di sistemi grandi, le fluttuazioni microscopiche si annullano e il sistema è interamente governato dal suo stato di minima energia libera macroscopica.