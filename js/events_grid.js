/**
 * events_grid.js — vanilla JS replacement for jQuery + Owl Carousel
 * Used by: gallery.html (events grid) and event.html (event detail)
 */

const BASE_URL = 'https://raw.githubusercontent.com/sm650rb/events/main/';

function formatDate(dateStr) {
  // Input: "YYYY/MM/DD" or "YYYY-MM-DD"
  const d = new Date(dateStr.replace(/\//g, '-'));
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getUrlParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function showError(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'block';
  const loading = document.getElementById('loading-msg');
  if (loading) loading.style.display = 'none';
}

function hideLoading() {
  const loading = document.getElementById('loading-msg');
  if (loading) loading.style.display = 'none';
}

/* ── GALLERY PAGE (events grid) ─────────────────── */
function loadEventsGrid() {
  const grid = document.getElementById('events-grid');
  if (!grid) return;

  fetch(BASE_URL + 'events.json')
    .then(r => {
      if (!r.ok) throw new Error('Network error');
      return r.json();
    })
    .then(data => {
      hideLoading();
      const past = (data.events?.past || []).sort(
        (a, b) => new Date(b.date.replace(/\//g, '-')) - new Date(a.date.replace(/\//g, '-'))
      );

      if (past.length === 0) {
        grid.innerHTML = '<p class="text-muted">No events yet. Check back soon!</p>';
        return;
      }

      past.forEach(evt => {
        const col = document.createElement('div');
        col.className = 'col-lg-4 col-md-6';
        col.innerHTML = `
          <a href="event.html?date=${encodeURIComponent(evt.date)}" class="event-card-link">
            <div class="event-card">
              <div class="event-card-img">
                <img src="${evt.cover_picture}" alt="${evt.name}" loading="lazy" />
              </div>
              <div class="event-card-body">
                <h5>${evt.name}</h5>
                <p>${formatDate(evt.date)}</p>
              </div>
            </div>
          </a>`;
        grid.appendChild(col);
      });
    })
    .catch(err => {
      console.error('Failed to load events:', err);
      showError('error-msg');
    });
}

/* ── EVENT DETAIL PAGE ───────────────────────────── */
function loadEventDetail() {
  const detail = document.getElementById('event-gallery');
  if (!detail) return;

  const date = getUrlParam('date');
  if (!date) {
    showError('error-msg');
    return;
  }

  fetch(BASE_URL + 'past/' + date.replace(/\//g, '/') + '.json')
    .then(r => {
      if (!r.ok) throw new Error('Network error');
      return r.json();
    })
    .then(data => {
      hideLoading();

      // Set title and date
      const titleEl = document.getElementById('event-title');
      const dateEl  = document.getElementById('event-date');
      if (titleEl) titleEl.textContent = data.name || '';
      if (dateEl)  dateEl.textContent  = formatDate(data.date || date);

      // Update page title
      if (data.name) document.title = data.name + ' | Road Burners SM650';

      // Description
      const descEl = document.getElementById('event-desc');
      if (descEl && data.description) descEl.innerHTML = `<p>${data.description}</p>`;

      // Photo grid
      const gallery = data.gallery || [];
      if (gallery.length === 0) {
        detail.innerHTML = '<p class="text-muted col-12">No photos for this event yet.</p>';
        return;
      }

      gallery.forEach((imgSrc, i) => {
        const col = document.createElement('div');
        col.className = 'col-6 col-md-4 col-lg-3';
        col.innerHTML = `
          <img
            src="${imgSrc}"
            alt="${(data.name || 'Event') + ' photo ' + (i + 1)}"
            class="gallery-thumb"
            loading="lazy"
            data-bs-toggle="modal"
            data-bs-target="#photoModal"
            data-src="${imgSrc}"
          />`;
        detail.appendChild(col);
      });

      // Wire up modal to show clicked photo
      const modal = document.getElementById('photoModal');
      if (modal) {
        modal.addEventListener('show.bs.modal', e => {
          const trigger = e.relatedTarget;
          const modalPhoto = document.getElementById('modalPhoto');
          if (trigger && modalPhoto) {
            modalPhoto.src = trigger.dataset.src || '';
          }
        });
        modal.addEventListener('hidden.bs.modal', () => {
          const modalPhoto = document.getElementById('modalPhoto');
          if (modalPhoto) modalPhoto.src = '';
        });
      }
    })
    .catch(err => {
      console.error('Failed to load event:', err);
      showError('error-msg');
    });
}

/* ── INIT ────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  loadEventsGrid();
  loadEventDetail();
});
