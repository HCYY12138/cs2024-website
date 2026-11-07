const offerIds = new Map([
  ['1111', 'offer-1111'],
  ['11.11', 'offer-1111'],
  ['1212', 'offer-1212'],
  ['12.12', 'offer-1212']
]);

const requestedOffer = new URLSearchParams(window.location.search).get('offer');
const offer = document.getElementById(offerIds.get(requestedOffer));

if (offer) {
  offer.classList.add('is-campaign-focus');
  window.requestAnimationFrame(() => {
    offer.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'center'
    });
    offer.focus({ preventScroll: true });
  });
}