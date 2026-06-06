// Renders project / writing cards from a JSON file into any element with [data-projects].
// Usage in markup:
//   <div class="projects-grid" data-projects></div>
//   <div class="projects-grid" data-projects="featured"></div>
// Optional attributes:
//   data-source="writings.json"    -> swap the data file (default: projects.json)
//   data-target="writing.html"     -> swap the card link target (default: case.html)
(function () {
    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // An emoji/short string renders as text; a path or URL renders as an image.
    function renderImage(image) {
        const value = (image || '').trim();
        const looksLikePath = /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(value) || /^https?:\/\//i.test(value) || value.includes('/');
        if (looksLikePath) {
            return `<img src="${escapeHtml(value)}" alt="" loading="lazy">`;
        }
        return escapeHtml(value);
    }

    function renderCard(project, target) {
        const tags = Array.isArray(project.tags) ? project.tags : [];
        const tagsHtml = tags
            .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
            .join('');

        // A card with a slug links to its article; otherwise it stays a plain block.
        const slug = (project.slug || '').trim();
        const tag = slug ? 'a' : 'div';
        const href = slug ? ` href="${escapeHtml(target)}?slug=${encodeURIComponent(slug)}"` : '';

        return `
            <${tag} class="project-card"${href}>
                <div class="project-image">${renderImage(project.image)}</div>
                <div class="project-content">
                    <div class="project-meta">
                        <h3 class="project-title">${escapeHtml(project.title)}</h3>
                        <span class="project-year">${escapeHtml(project.year)}</span>
                    </div>
                    <p class="project-description">${escapeHtml(project.description)}</p>
                    <div class="project-tags">${tagsHtml}</div>
                </div>
            </${tag}>`;
    }

    // Cache fetched data files so multiple grids sharing the same source only hit the network once.
    const _cache = new Map();
    async function loadItems(source) {
        if (_cache.has(source)) return _cache.get(source);
        const res = await fetch(source, { cache: 'no-cache' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // Accept any top-level key (projects, writings, items, ...) or a raw array.
        const items = Array.isArray(data)
            ? data
            : (Object.values(data).find(Array.isArray) || []);
        _cache.set(source, items);
        return items;
    }

    async function init() {
        const grids = document.querySelectorAll('[data-projects]');
        if (!grids.length) return;

        for (const grid of grids) {
            const source = grid.getAttribute('data-source') || 'projects.json';
            const target = grid.getAttribute('data-target') || 'case.html';
            const mode = grid.getAttribute('data-projects');
            let items;
            try {
                items = await loadItems(source);
            } catch (err) {
                console.error(`Could not load ${source}:`, err);
                continue;
            }
            const list = mode === 'featured' ? items.filter((p) => p.featured) : items;
            grid.innerHTML = list.map((item) => renderCard(item, target)).join('');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
