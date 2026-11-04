const colourInputs = document.querySelectorAll('[name="colour"]');
const productImage = document.querySelector('[data-product-image]');
const colourNames = document.querySelectorAll('[data-colour-name]');
const listingLinks = document.querySelectorAll('[data-listing-link]');
const listingNote = document.querySelector('[data-listing-note]');
const detailsLink = document.querySelector('[data-details-link]');
const primaryActions = document.querySelector('[data-primary-actions]');
const buyBar = document.querySelector('[data-buybar]');

function applyColour(input) {
  const { label, image, listingUrl } = input.dataset;
  const url = listingUrl.trim();
  const hasListing = url.startsWith('https://');

  productImage.src = image;
  productImage.alt = `${label} Somnus Sleepbuds`;
  colourNames.forEach((name) => {
    name.textContent = label;
  });
  detailsLink.href = `product-detail.html?colour=${encodeURIComponent(input.value)}`;

  listingLinks.forEach((link) => {
    if (hasListing) {
      link.href = url;
      link.removeAttribute('aria-disabled');
    } else {
      link.removeAttribute('href');
      link.setAttribute('aria-disabled', 'true');
    }
  });
  listingNote.hidden = hasListing;
}

colourInputs.forEach((input) => {
  input.addEventListener('change', () => applyColour(input));
});

// Browsers can restore a different radio on reload, so read the actual state.
applyColour(document.querySelector('[name="colour"]:checked'));

// The mobile buy bar only appears while the main actions are off screen.
if ('IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => {
    buyBar.hidden = entry.isIntersecting;
  }).observe(primaryActions);
}