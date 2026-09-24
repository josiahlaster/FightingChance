export const site = {
  name: 'Fighting Chance Transitional Restoration',
  shortName: 'Fighting Chance',
  tagline: 'A New Chapter. A Better Future.',
  motto: ['Rebuild.', 'Restore.', 'Rise.', 'Redeem.'],
  phone: '919-685-0569',
  phoneHref: 'tel:+19196850569',
  email: 'fightingchancetransitional@gmail.com',
  city: 'Durham, North Carolina',
};

export const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/program', label: 'Our Program' },
  { path: '/locations', label: 'Locations' },
  { path: '/referral', label: 'Referral' },
  { path: '/contact', label: 'Contact' },
];

export const footerLinks = navLinks;

export const locations = [
  {
    id: 'hearthside',
    name: 'Hearthside House',
    street: ' Hearthside St',
    city: 'Durham',
    state: 'NC',
    zip: '27703',
    mapsQuery: ' Hearthside St, Durham, NC 27703',
  },
  {
    id: 'pekoe',
    name: 'Pekoe Avenue House',
    street: ' Pekoe Avenue',
    city: 'Durham',
    state: 'NC',
    zip: '27707',
    mapsQuery: ' Pekoe Avenue, Durham, NC 27707',
  },
  {
    id: 'middle',
    name: 'Middle Street House',
    street: 'Middle St',
    city: 'Durham',
    state: 'NC',
    zip: '27703',
    mapsQuery: ' Middle St, Durham, NC 27703',
  },
];

export function mapsDirectionsUrl(query) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}
