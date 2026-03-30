+++
date = "2026-02-13T01:04:32+01:00"
draft = false
title = "Stress Test: Funzionalità Markdown e Stili"
summary = "Un articolo completo per testare liste, citazioni, tabelle, matematica in LaTeX, immagini e note a piè di pagina con il nuovo tema Tailwind v4."
tags = ["Test", "Markdown", "Math"]
math = true
+++

Questo è un paragrafo iniziale per testare i **testi in grassetto**, in *corsivo* e i [link interattivi](https://github.com). Come puoi vedere, i link hanno un bell'effetto hover senza disturbare la lettura.

## Liste e Gerarchia

Controlliamo se Tailwind ha smesso di azzerare i nostri elenchi puntati e numerati.

### Lista Non Ordinata
- Primo concetto fondamentale
- Secondo concetto con una sotto-lista:
  - Dettaglio A
  - Dettaglio B
- Terzo e ultimo concetto

### Lista Ordinata
1. Aprire l'editor di testo
2. Scrivere il codice Markdown
3. Avviare `hugo server` nel terminale (test codice inline)

## Citazioni (Blockquote)

Quando citi un autore o un paper accademico, l'aspetto visivo è molto importante:

> "La semplicità è la massima raffinatezza. Un design minimalista non significa assenza di elementi, ma presenza della giusta proporzione."
> — *Leonardo da Vinci (forse)*

## Matematica e Formule

Grazie al passthrough di Goldmark, possiamo scrivere matematica inline come l'equazione di massa-energia $E=mc^2$ o la formula di Eulero $e^{i\pi} + 1 = 0$.

Possiamo anche usare i blocchi (display mode) per le equazioni più complesse:

$$f(x) = \int_{-\infty}^{\infty} \hat{f}(\xi)\,e^{2 \pi i \xi x} \,d\xi$$

## Blocchi di Codice (Syntax Highlighting)

Ecco una funzione in Python per testare il motore Chroma di Hugo:

```python
import numpy as np

def calcola_divergenza_kl(p, q):
    """Calcola la divergenza KL tra due distribuzioni."""
    # Evitiamo la divisione per zero
    p = np.asarray(p, dtype=float)
    q = np.asarray(q, dtype=float)
    return np.sum(np.where(p != 0, p * np.log(p / q), 0))

```