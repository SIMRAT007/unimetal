export const DATA_CENTER_PATH = '/data-center'

export const DATA_CENTER_IMAGE = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1920&q=70'

// Fallback content for config/dataCenter; anything saved in the admin panel overrides these.
// Multi-line headings use a line break in the text to split lines.
export const defaultDataCenter = {
  seoTitle: 'Data Centre Infrastructure | Unimetal',
  seoDescription: 'Modular strut channels for the cable routes, power systems and services that keep your data centre connected.',

  heroImage: DATA_CENTER_IMAGE,
  heroEyebrow: 'Our capability / Data centre infrastructure',
  heroTitle: 'Engineered support.\nFor data centres.',
  heroText: 'Modular strut channels for the cable routes, power systems and services that keep your data centre connected.',
  heroPrimaryText: 'View product range',
  heroPrimaryLink: '/products',
  heroSecondaryText: 'Explore applications',

  stripItems: [
    { text: 'Cable containment' },
    { text: 'Electrical services' },
    { text: 'Mechanical supports' },
    { text: 'Modular framing' },
  ],

  appsEyebrow: '01 / Applications',
  appsTitle: 'One system.\nAcross your infrastructure.',
  appsText: 'Bring a consistent approach to service supports. Configure channels and compatible fittings around the layout, access and loading requirements of each installation.',
  applications: [
    {
      tag: 'Overhead',
      title: 'Cable tray & ladder supports',
      text: 'Build suspended supports for cable containment above the server aisles. Plan separate routes and leave room for inspection and future additions.',
      items: 'Tray supports, Ladder hangers, Drop rods',
    },
    {
      tag: 'Power',
      title: 'Electrical service supports',
      text: "Configure support frames for conduits and electrical services, with fixing details coordinated to the equipment manufacturer's requirements.",
      items: 'Conduit supports, Service frames',
    },
    {
      tag: 'Mechanical',
      title: 'Pipework & service framing',
      text: 'Arrange modular frames for pipework and ancillary services. Select clamps, anchors and connections for the complete assembly and its loads.',
      items: 'Pipe supports, Wall brackets',
    },
  ],

  profiles: [
    {
      label: 'Shallow channel',
      size: '41 × 21 mm',
      note: 'Low-profile single channel',
      configuration: 'Single channel',
      thickness: '1.5 mm or 2.5 mm; confirm project requirements',
      lengths: '3 m and 6 m; confirm availability',
      selectionBasis: 'Span, load, deflection and connections',
    },
    {
      label: 'Standard channel',
      size: '41 × 41 mm',
      note: 'Single channel configuration',
      configuration: 'Single channel',
      thickness: '2.5 mm; confirm project requirements',
      lengths: '3 m and 6 m; confirm availability',
      selectionBasis: 'Span, load, deflection and connections',
    },
    {
      label: 'Back-to-back channel',
      size: '41 × 82 mm',
      note: 'Double channel configuration',
      configuration: 'Back-to-back double channel',
      thickness: '2.5 mm; confirm project requirements',
      lengths: '3 m and 6 m; confirm availability',
      selectionBasis: 'Span, load, deflection and connections',
    },
  ],
  specNote: 'Dimensions alone do not establish a safe working load. Request the relevant load table and check the complete support assembly.',
  specLinkText: 'Add your requirements to a project brief',

  engEyebrow: '04 / Engineering first',
  engTitle: 'A profile is only\npart of the specification.',
  engText: 'Define the full load path—from supported services through the channel, fittings and anchors to the building structure.',
  engButtonText: 'Prepare your project brief',
  engItems: [
    { title: 'Loads & support spacing', text: 'State service weights, point loads, span, future allowance and deflection criteria.' },
    { title: 'Connections & anchorage', text: 'Confirm bracket, channel nut, fastener and anchor capacities, plus the substrate.' },
    { title: 'Environment & documentation', text: 'Request matching drawings, load tables, material and coating information. Identify any fire, seismic or bonding requirements.' },
  ],

  briefEyebrow: '05 / Your next project',
  briefTitle: 'Turn your layout\ninto a clear brief.',
  briefText: 'Capture the essentials for a conversation with Unimetal. Add drawings, quantities and delivery requirements when sharing your enquiry.',
  briefSmallText: 'This page prepares a downloadable brief. It does not send an enquiry.',
  briefDownloadText: 'Download project brief',
  briefEmailText: 'Email Unimetal',
  briefEmail: '',
  briefFileHeading: 'UNIMETAL PROJECT BRIEF - DATA CENTRE INFRASTRUCTURE',

  faqHeading: 'Specification questions',
  faqs: [
    {
      question: 'Which channel size should I select?',
      answer: 'Start with the supported load, span, deflection limit and connection arrangement. The responsible designer should verify the full assembly against applicable load data; channel dimensions alone are insufficient.',
    },
    {
      question: 'Can the supports accommodate future expansion?',
      answer: 'A modular arrangement can be adapted, but future space and load allowances should be specified at the design stage. Recheck the assembly before adding services.',
    },
    {
      question: 'What should I include in an enquiry?',
      answer: 'Include layout drawings, channel dimensions, lengths and quantities, material or coating requirements, loading information, required accessories, delivery location and programme.',
    },
  ],

  homeEyebrow: 'Data centre infrastructure',
  homeTitle: 'Engineered support for data centres',
  homeText: 'Modular strut channels for the cable routes, power systems and services that keep your data centre connected, configured around the layout, access and loading requirements of each installation.',
  homeButtonText: 'Explore data centre solutions',
}
