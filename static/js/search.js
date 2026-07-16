function initSearch() {
    const searchInput = document.getElementById('search-input');
    const clearButton = document.getElementById('clear-search');
    const posts = document.querySelectorAll('.blog-post-item');
    const noResults = document.getElementById('no-results');

    // Se non c'è la barra di ricerca in questa pagina, interrompi lo script
    if (!searchInput) return;

    function filterPosts() {
        // Prendi il testo digitato, trasformalo in minuscolo e togli gli spazi extra
        const query = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;

        // Mostra o nascondi il bottone "X" per pulire la ricerca
        if (query.length > 0) {
            clearButton.classList.remove('hidden');
        } else {
            clearButton.classList.add('hidden');
        }

        // Controlla ogni singolo articolo
        posts.forEach(post => {
            const title = post.getAttribute('data-title') || '';
            const summary = post.getAttribute('data-summary') || '';
            const tags = post.getAttribute('data-tags') || '';

            // Se il testo cercato è nel titolo, nel riassunto o nei tag, mostralo
            if (title.includes(query) || summary.includes(query) || tags.includes(query)) {
                post.style.display = ''; // Mostra l'articolo
                visibleCount++;
            } else {
                post.style.display = 'none'; // Nascondi l'articolo
            }
        });

        // Gestisci il messaggio "Nessun risultato"
        if (noResults) {
            if (visibleCount === 0 && query.length > 0) {
                noResults.classList.remove('hidden'); // Mostra il messaggio
            } else {
                noResults.classList.add('hidden'); // Nascondi il messaggio
            }
        }
    }

    // EVENTO CHIAVE: Ascolta ogni volta che l'utente digita o cancella una lettera
    searchInput.addEventListener('input', filterPosts);

    // Gestisci il click sul bottone "X" per resettare
    if (clearButton) {
        clearButton.addEventListener('click', () => {
            searchInput.value = '';
            filterPosts(); // Resetta la visualizzazione
            searchInput.focus(); // Riporta il cursore nella barra
        });
    }
}

// Avvio sicuro: se il DOM è pronto esegue subito, altrimenti attende il caricamento
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSearch);
} else {
    initSearch();
}