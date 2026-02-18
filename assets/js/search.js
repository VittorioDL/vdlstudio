document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const clearBtn = document.getElementById('clear-search');
    const resultsCount = document.getElementById('results-count');
    const tagButtons = document.querySelectorAll('.filter-tag');
    const activeFiltersText = document.getElementById('active-filters-text');
    const posts = document.querySelectorAll('.blog-post-item');
    const noResults = document.getElementById('no-results');
    
    let activeTags = [];

    function updateUI(visibleCount, query) {
        // Gestione bottone clear
        if (query) {
            clearBtn.classList.remove('hidden');
        } else {
            clearBtn.classList.add('hidden');
        }

        // Gestione testo conteggio
        if (query || activeTags.length > 0) {
            resultsCount.textContent = `${visibleCount} ${visibleCount === 1 ? 'post' : 'posts'} found`;
            resultsCount.classList.remove('hidden');
        } else {
            resultsCount.classList.add('hidden');
        }

        // Gestione testo filtri attivi
        if (activeTags.length > 0) {
            activeFiltersText.textContent = `Filtering by: ${activeTags.join(', ')}`;
            activeFiltersText.classList.remove('hidden');
        } else {
            activeFiltersText.classList.add('hidden');
        }

        // Gestione No Results
        if (visibleCount === 0) {
            noResults.classList.remove('hidden');
        } else {
            noResults.classList.add('hidden');
        }
    }

    function filterPosts() {
        const query = searchInput.value.toLowerCase();
        let visibleCount = 0;

        posts.forEach(post => {
            const title = post.dataset.title || "";
            const summary = post.dataset.summary || "";
            const tags = post.dataset.tags || "";

            const matchesSearch = !query || title.includes(query) || summary.includes(query) || tags.includes(query);
            const matchesTags = activeTags.length === 0 || activeTags.every(tag => tags.includes(tag));

            if (matchesSearch && matchesTags) {
                post.style.display = 'block';
                visibleCount++;
            } else {
                post.style.display = 'none';
            }
        });

        updateUI(visibleCount, query);
    }

    // Event Listeners
    searchInput.addEventListener('input', filterPosts);
    
    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        filterPosts();
        searchInput.focus();
    });

    tagButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Previene click indesiderati
            const tag = btn.dataset.tag;
            
            if (activeTags.includes(tag)) {
                activeTags = activeTags.filter(t => t !== tag);
                btn.removeAttribute('data-active');
            } else {
                activeTags.push(tag);
                btn.setAttribute('data-active', 'true');
            }
            filterPosts();
        });
    });
});