+++
date = '2025-03-15T10:00:00+01:00'
draft = false
title = 'Markdown: La Guida Definitiva al Test'
summary = "Un articolo enciclopedico per testare ogni singola funzionalità di formattazione Markdown, Hugo shortcodes, espressioni matematiche e tipografia del nuovo tema."
tags = ["Test", "Markdown", "Tipografia"]
math = true
+++

Questo post è un vero e proprio "stress test" per il motore di rendering di Hugo (Goldmark) e per il nostro file CSS personalizzato con Tailwind. 

Oltre al **grassetto** e al *corsivo*, possiamo testare il testo ~~barrato~~ (utile per mostrare correzioni) e l'inserimento di un comando inline come `npm run build` o `hugo server -D`.

---

## 1. Liste di ogni genere

Abbiamo già visto le liste normali, ma Markdown supporta configurazioni molto più complesse.

### Liste Annidate Miste
1. Primo livello (ordinato)
   - Sotto-livello (non ordinato)
   - Un altro sotto-livello
     - Livello ancora più profondo (con *corsivo*)
2. Secondo livello (ordinato)
3. Terzo livello, che contiene un blocco di codice:
   ```bash
   echo "Il codice dentro le liste funziona!"
   ```

### Task List (Liste di cose da fare)
Perfette per roadmaps o guide passo-passo:
- [x] Configurare Hugo
- [x] Scrivere il CSS personalizzato
- [x] Testare la tipografia di base
- [ ] Implementare la Dark Mode (prossimo passo!)
- [ ] Comprare il dominio finale

---

## 2. Citazioni (Semplici e Annidate)

Le citazioni sono fondamentali in un blog di ricerca. 

> Questa è una citazione standard. Il design minimalista la fa risaltare grazie alla linea laterale e al testo leggermente attenuato.
> 
> Puoi anche avere più paragrafi all'interno della stessa citazione.

Possiamo anche **annidare** le citazioni (citazioni nelle citazioni):

> Marco ha scritto nel suo ultimo paper:
> > "L'algoritmo presenta un bias intrinseco nei dati di addestramento."
> 
> Ed io sono perfettamente d'accordo con lui.

---

## 3. Link Avanzati e Tasti (KBD)

Oltre al classico [link a Google](https://google.com), Markdown supporta i **Link di Riferimento**. Sono comodissimi se devi ripetere lo stesso link più volte. Guarda il codice sorgente: io linko [GitHub][1] e poi linko di nuovo [GitHub][1] usando solo un numero! 

Un'altra funzionalità HTML molto elegante è il tag `<kbd>`. Premi <kbd>Ctrl</kbd> + <kbd>C</kbd> per copiare, oppure <kbd>Cmd</kbd> su Mac.

---

## 4. Tabelle con Allineamenti

Le tabelle Markdown permettono di definire l'allineamento delle colonne (sinistra, centro, destra) usando i due punti `:` nella riga di separazione.

| Feature (Sinistra) | Stato (Centro) | Difficoltà (Destra) |
| :--- | :---: | ---: |
| Tailwind CSS v4 | ✅ Attivo | Media |
| KaTeX / MathJax | ✅ Attivo | Alta |
| Ricerca Live JS | ✅ Attivo | Bassa |

---

## 5. La Potenza della Matematica (LaTeX)

Poiché nel nostro front matter abbiamo impostato `math = true`, i blocchi passthrough sono attivi.

**Matematica Inline:** La probabilità condizionata $P(A|B) = \frac{P(B|A)P(A)}{P(B)}$ è alla base del teorema di Bayes[^1].

**Matematica a Blocco (Display Mode):**
L'equazione di Schrödinger dipendente dal tempo:
$$ i\hbar \frac{\partial}{\partial t} \Psi(\mathbf{r},t) = \hat{H} \Psi(\mathbf{r},t) $$

---

## 6. Contenuti Interattivi: Il Toggle

Questo è puro HTML inserito nel Markdown. Usa il cursore del mouse per espandere.

<details>
  <summary>Spiegazione Dettagliata (Clicca qui)</summary>
  
  Questo testo era nascosto! È un ottimo modo per inserire dimostrazioni matematiche chilometriche o grossi blocchi di codice che altrimenti intaserebbero la lettura dell'articolo.
  Puoi persino metterci un'immagine dentro:
  ![Esempio immagine web](https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80)

  **Matematica Inline:** La probabilità condizionata $P(A|B) = \frac{P(B|A)P(A)}{P(B)}$ è alla base del teorema di Bayes[^1].

  **Matematica a Blocco (Display Mode):**
  L'equazione di Schrödinger dipendente dal tempo:
  $$ i\hbar \frac{\partial}{\partial t} \Psi(\mathbf{r},t) = \hat{H} \Psi(\mathbf{r},t) $$

</details>

---

## 7. Codice con Syntax Highlighting

Testiamo il parser Chroma di Hugo con un linguaggio diverso dal solito, come il CSS:

```css
/* Un piccolo estratto dal nostro file main.css */
article blockquote {
  border-left: 4px solid var(--border);
  padding-left: 1rem;
  color: var(--muted-foreground);
  font-style: italic;
}
```

---

## 8. Shortcode per Immagini (Hugo)

Usando lo shortcode `figure` di Hugo, generiamo automaticamente la didascalia sotto l'immagine.

{{< figure src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80" title="Figura 1: Una rappresentazione astratta delle reti neurali." >}}

---

*Fine del documento di test. Sotto a questa linea verranno generate automaticamente le note a piè di pagina.*

[^1]: Thomas Bayes (1701–1761) è stato un matematico e ministro presbiteriano britannico. La sua formula è stata pubblicata postuma nel 1763.

[1]: https://github.com