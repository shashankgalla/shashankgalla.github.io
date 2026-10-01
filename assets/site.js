/* Progressive enhancement: every section remains readable without JavaScript. */
'use strict';

const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
menu.hidden = false;
document.documentElement.classList.add('js');
function closeMenu() {
  menu.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
}
menu.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!expanded));
  navigation.classList.toggle('is-open', !expanded);
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menu.focus();
  }
});

const controls = document.querySelector('.publication-controls');
const search = document.querySelector('#publication-search');
const filters = Array.from(document.querySelectorAll('[data-filter]'));
const publications = Array.from(document.querySelectorAll('.publication'));
let activeFilter = 'All';
controls.hidden = false;
function updatePublications() {
  const query = search.value.trim().toLocaleLowerCase();
  let count = 0;
  for (const publication of publications) {
    const show = (activeFilter === 'All' || publication.dataset.type === activeFilter)
      && publication.textContent.toLocaleLowerCase().includes(query);
    publication.hidden = !show;
    if (show) count += 1;
  }
  document.querySelector('#publication-count').textContent = `${count} publication${count === 1 ? '' : 's'}`;
  document.querySelector('#no-results').hidden = count !== 0;
}
filters.forEach(button => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
  updatePublications();
}));
search.addEventListener('input', updatePublications);

/* News links must reveal their paper even after a filter or search is applied. */
function revealLinkedPaper(id = window.location.hash.slice(1)) {
  const paper = publications.find(item => item.id === id);
  if (!paper) return;
  activeFilter = 'All';
  search.value = '';
  filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter.dataset.filter === 'All')));
  updatePublications();
  paper.scrollIntoView({ block: 'start' });
}
window.addEventListener('hashchange', () => revealLinkedPaper());
document.addEventListener('click', event => {
  const anchor = event.target.closest('a[href^="#pub-"]');
  if (anchor) revealLinkedPaper(anchor.hash.slice(1));
});
revealLinkedPaper();

const sectionLinks = Array.from(navigation.querySelectorAll('a[href^="#"]'));
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach(anchor => {
        if (anchor.hash === `#${entry.target.id}`) anchor.setAttribute('aria-current', 'location');
        else anchor.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-12% 0px -65% 0px', threshold: 0 });
  sectionLinks.forEach(anchor => observer.observe(document.querySelector(anchor.hash)));
}
