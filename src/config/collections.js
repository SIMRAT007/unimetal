// Collection paths. Singletons use collection/docId format (config/topbar means collection 'config', doc 'topbar').
export const COLLECTIONS = {
  topbar: 'config/topbar',
  navbar: 'config/navbar',
  navLinks: 'navLinks',
  heroSlides: 'heroSlides',
  categories: 'categories',
  products: 'products',
  categoriesSection: 'config/categoriesSection',
  capabilities: 'capabilities',
  capabilitiesSection: 'config/capabilitiesSection',
  dataCenter: 'config/dataCenter',
  about: 'config/about',
  stats: 'config/stats',
  contact: 'config/contact',
  faq: 'config/faq',
  creditApplication: 'config/creditApplication',
  footer: 'config/footer',
}

export const isSingleton = (path) => path.includes('/')

export const defaultTopbar = {
  address: '123 Industrial Area, Phase 1, Ludhiana, Punjab - 141003',
  email: 'info@unimetal.com',
  phone: '+91 98765 43210',
  active: true,
}

export const defaultNavbar = {
  logo: '',
  logoText: 'Unimetal',
  ctaLabel: 'Get a Quote Today',
  ctaTarget: '/contact',
}

export const defaultCategoriesSection = {
  active: true,
  heading: 'Our Categories',
  highlight: 'Explore our wide range of metal products',
  subheading: '',
}

export const defaultCapabilitiesSection = {
  active: true,
  heading: 'Our Capabilities',
  highlight: 'End-to-end metal manufacturing excellence',
}

export const defaultAbout = {
  active: true,
  bgColor: '',
  tag: 'Commercial Bolts',
  heading: 'For Any Project',
  description:
    'Bolt is in our name. It\'s where the company started. So, it\'s no secret that we\'re a leader in the fastener industry when it comes to providing structural bolts. Our inventory includes thousands of bolts in hundreds of sizes, including high-temperature and high-pressure applications. We also have the raw materials and blanks for custom-made orders that will meet your needs.',
  buttonText: '',
  buttonLink: '/contact',
  images: [],
  stats: [],
}

export const defaultStats = {
  active: true,
  heading: 'Our Impact',
  subheading: '',
  items: [],
}

export const defaultContact = {
  active: true,
  tag: 'Contact',
  heading: 'Contact Us',
  subheading: 'We would love to hear from you.',
  address: '123 Industrial Area, Phase 1, Ludhiana, Punjab - 141003',
  phone: '+91 98765 43210',
  email: 'info@unimetal.com',
  hours: 'Mon - Sat: 9:00 AM - 6:00 PM',
  map: '',
}

export const defaultFaq = {
  active: true,
  bgColor: '',
  tag: 'Most asked queries',
  heading: 'Frequently asked questions',
  subheading: 'Answers to common questions about ordering, delivery and choosing the right product.',
  items: [],
  ctaHeading: "Can't locate the answers you need?",
  ctaSubtext: "We're here to help with any questions you have!",
  ctaButtonText: 'Contact Us',
  ctaButtonLink: '/contact',
}

export const defaultCreditApplication = {
  active: true,
  bgColor: '#86C3DA',
  tag: 'Credit',
  heading: 'Apply for a Credit Account',
  description: 'To apply for a credit account please complete the form below and email to info@unimetal.cc',
  pdfLabel: 'Credit Application',
  pdfUrl: '',
}

export const defaultFooter = {
  logo: '',
  description: 'Precision metal products for every industry.',
  columns: [],
  social: [],
  copyright: `© ${new Date().getFullYear()} Unimetal. All rights reserved.`,
}

export const seedCategories = [
  'Flat Plate Brackets',
  'Square Plate Washers & Lip Washers',
  'Angle & Wing Brackets',
  'Base & Floor Plates',
  'U&Z Brackets',
  'Cantilever Arms',
  'Girder & Beam Clamps',
  'Channel Couplers',
  'Strut Channel',
  'Pipe Clamps',
  'Threaded Rod',
  'Channel Nuts',
  'Washers',
  'Hex Nuts',
  'Wedge Nuts',
  'Lindapter Beam Clamps',
  'Threaded Studs',
  'Rod Connectors & Accessories',
  'Rod End & End Caps',
  'Hex Head Screw Sets',
  'Screws & Bolts',
]

export const seedCapabilities = [
  'CNC Machining',
  'Cutting',
  'Drilling',
  'Forging',
  'Milling',
  'Plating & Heat Treating',
  'Secondary Processes',
  'Threading',
]
