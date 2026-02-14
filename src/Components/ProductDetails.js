// This file exports the product database structure used by ProductDetailPage.jsx.
// Each product is keyed by its unique ID for easy lookup.

const productDatabase = {
  // --- APOLLO Wireless Controller (Assumed from far-left image) ---
  'AC-400': {
    id: 'AC-400',
    title: 'APOLLO AC-400 Centralized Wireless Controller',
    category: 'Wireless / Controller',
    imageUrl: 'https://placehold.co/600x600/004d40/ffffff?text=AC-400+Controller',
    shortDescription: 'Centralized management platform for up to 50 APOLLO Access Points, offering simple deployment and monitoring.',
    longDescription: [
      "The AC-400 provides comprehensive management for small to medium-sized wireless networks. It simplifies network operations by offering unified configuration, firmware management, and monitoring across all connected APs.",
      "Ideal for businesses needing robust, centralized control without the complexity of cloud-only systems. Features 4 Gigabit Ethernet ports for flexible deployment."
    ],
    features: [
      'Manages up to 50 Access Points (APs)',
      '4 x Gigabit Ethernet Ports',
      'Unified AP Configuration & Monitoring',
      'Centralized Guest Access Management',
    ],
    specifications: [
      { key: 'Max APs Supported', value: '50' },
      { key: 'Interface', value: '4 x 10/100/1000 Mbps Ethernet' },
      { key: 'Deployment', value: 'Desktop or Rack-Mount' },
      { key: 'Power', value: 'DC Power Adapter' },
    ]
  },

  // --- APOLLO ASC Series (802.11ac Wave 2 APs) ---
  'ASC-1200L-V2': {
    id: 'ASC-1200L-V2',
    title: 'APOLLO ASC-1200L V2 2x2 AC1200 Dual-Band AP',
    category: 'Wireless / Indoor AP (AC)',
    imageUrl: 'https://placehold.co/600x600/008080/ffffff?text=ASC-1200L+V2',
    shortDescription: 'Value-oriented 802.11ac Wave 2 AP, providing reliable dual-band connectivity for budget-conscious deployments.',
    longDescription: ["The V2 version offers improved chipset efficiency and stable AC1200 throughput, perfect for general office use, retail, and small classrooms."],
    features: [
      '802.11ac Wave 2 Support (MU-MIMO)',
      'Dual-Band (300Mbps @ 2.4GHz + 867Mbps @ 5GHz)',
      '1 x Gigabit Ethernet Port (PoE)',
      'Sleek, Low-Profile Design',
    ],
    specifications: [
      { key: 'Wi-Fi Standard', value: '802.11ac Wave 2' },
      { key: 'Max Throughput', value: '1167 Mbps' },
      { key: 'MIMO', value: '2x2' },
      { key: 'Power Supply', value: '802.3af PoE' },
    ]
  },
  'ASC-1200L': {
    id: 'ASC-1200L',
    title: 'APOLLO ASC-1200L 2x2 AC1200 Dual-Band AP',
    category: 'Wireless / Indoor AP (AC)',
    imageUrl: 'https://placehold.co/600x600/008080/ffffff?text=ASC-1200L',
    shortDescription: 'Entry-level dual-band AC AP for standard network connectivity in low-density environments.',
    longDescription: ["Reliable workhorse AP, easy to deploy and manage, ideal for background connectivity and basic client needs."],
    features: [
      'Standard 802.11ac Support',
      'Dual-Band Wireless',
      'Integrated Internal Antenna',
      'Simple Web-UI Management',
    ],
    specifications: [
      { key: 'Wi-Fi Standard', value: '802.11ac' },
      { key: 'Max Throughput', value: '1167 Mbps' },
      { key: 'MIMO', value: '2x2' },
      { key: 'Power Supply', value: '802.3af PoE' },
    ]
  },
  'ASC-1200': {
    id: 'ASC-1200',
    title: 'APOLLO ASC-1200 2x2 AC1200 High-Performance AP',
    category: 'Wireless / Indoor AP (AC)',
    imageUrl: 'https://placehold.co/600x600/008080/ffffff?text=ASC-1200',
    shortDescription: 'Enhanced AC Wave 2 AP with improved radio sensitivity for better range and throughput.',
    longDescription: ["Designed for medium-density venues, the ASC-1200 provides consistent performance even when supporting a higher number of simultaneous clients."],
    features: [
      'Advanced 802.11ac Wave 2 (MU-MIMO)',
      'Optimized Radio Frequency Tuning',
      'Gigabit Ethernet Uplink',
      'Supports Fast Roaming Protocols',
    ],
    specifications: [
      { key: 'Wi-Fi Standard', value: '802.11ac Wave 2' },
      { key: 'Max Throughput', value: '1167 Mbps' },
      { key: 'MIMO', value: '2x2' },
      { key: 'Power Supply', value: '802.3at PoE+' },
    ]
  },

  // --- APOLLO AXC Series (Wi-Fi 6 / 802.11ax APs) ---
  'AXC-1800L': {
    id: 'AXC-1800L',
    title: 'APOLLO AXC-1800L Wi-Fi 6 AX1800 Lite AP',
    category: 'Wireless / Indoor AP (AX)',
    imageUrl: 'https://placehold.co/600x600/009688/ffffff?text=AXC-1800L',
    shortDescription: 'Cost-effective entry into Wi-Fi 6, ideal for upgrading networks with improved efficiency and battery life for client devices.',
    longDescription: ["The AXC-1800L utilizes Wi-Fi 6 technologies like OFDMA to efficiently handle multiple devices simultaneously, reducing latency and improving overall network experience."],
    features: [
      'Wi-Fi 6 (802.11ax) Technology',
      'AX1800 Dual-Band Performance',
      'OFDMA and TWT Support',
      '1 x Gigabit Ethernet Uplink (PoE)',
    ],
    specifications: [
      { key: 'Wi-Fi Standard', value: '802.11ax' },
      { key: 'Max Throughput', value: '1775 Mbps' },
      { key: 'MIMO', value: '2x2' },
      { key: 'Power Supply', value: '802.3af PoE' },
    ]
  },
  'AXC-1800': {
    id: 'AXC-1800',
    title: 'APOLLO AXC-1800 Wi-Fi 6 AX1800 AP',
    category: 'Wireless / Indoor AP (AX)',
    imageUrl: 'https://placehold.co/600x600/009688/ffffff?text=AXC-1800',
    shortDescription: 'Standard Wi-Fi 6 AP with reliable coverage and capacity for general business and hospitality needs.',
    longDescription: ["A balanced approach to performance and cost, offering full Wi-Fi 6 capability without unnecessary complexity."],
    features: [
      'Full Wi-Fi 6 Feature Set',
      'Supports WPA3 Security',
      'High-Efficiency OFDMA Scheduling',
      'Built-in Network Controller compatibility',
    ],
    specifications: [
      { key: 'Wi-Fi Standard', value: '802.11ax' },
      { key: 'Max Throughput', value: '1775 Mbps' },
      { key: 'MIMO', value: '2x2' },
      { key: 'Power Supply', value: '802.3af PoE' },
    ]
  },
  'AXC-3000L': {
    id: 'AXC-3000L',
    title: 'APOLLO AXC-3000L High-Capacity Wi-Fi 6 AP',
    category: 'Wireless / Indoor AP (AX)',
    imageUrl: 'https://placehold.co/600x600/00bfa5/ffffff?text=AXC-3000L',
    shortDescription: 'Designed for high-density environments, featuring faster speeds and greater client handling capacity than 1800 models.',
    longDescription: ["The AXC-3000L breaks the throughput barrier for typical enterprise APs, utilizing advanced 4x4 MIMO on the 5GHz band to double the effective speed."],
    features: [
      'AX3000 Performance (Wi-Fi 6)',
      '4x4 MIMO on 5 GHz Band',
      '2.5 Gigabit Ethernet Uplink (Multi-Gig)',
      'High-Density Client Support',
    ],
    specifications: [
      { key: 'Wi-Fi Standard', value: '802.11ax' },
      { key: 'Max Throughput', value: '2976 Mbps' },
      { key: 'Uplink Port', value: '2.5G BASE-T (PoE+)' },
      { key: 'MIMO', value: '2x2 (2.4GHz) / 4x4 (5GHz)' },
    ]
  },
  'AXC-3600': {
    id: 'AXC-3600',
    title: 'APOLLO AXC-3600 High-Capacity Wi-Fi 6 AP',
    category: 'Wireless / Indoor AP (AX)',
    imageUrl: 'https://placehold.co/600x600/00bfa5/ffffff?text=AXC-3600',
    shortDescription: 'Flagship dual-band Wi-Fi 6 AP built for the most congested and demanding public venues and large enterprises.',
    longDescription: ["With powerful processing and advanced radio design, the AXC-3600 ensures a seamless experience even during peak usage periods, making it suitable for auditoriums and large public areas."],
    features: [
      'AX3600 Performance (Wi-Fi 6)',
      'Superior Radio Coverage and Range',
      'Dual 2.5 Gigabit Ethernet Uplinks for redundancy',
      'Advanced Beamforming Technology',
    ],
    specifications: [
      { key: 'Wi-Fi Standard', value: '802.11ax' },
      { key: 'Max Throughput', value: '3550 Mbps' },
      { key: 'Uplink Port', value: '2 x 2.5G BASE-T (PoE++)' },
      { key: 'MIMO', value: '4x4' },
    ]
  },
  'AXC-7800': {
    id: 'AXC-7800',
    title: 'APOLLO AXC-7800 Tri-Band Wi-Fi 6 AP',
    category: 'Wireless / Tri-Band Enterprise',
    imageUrl: 'https://placehold.co/600x600/00c4a7/ffffff?text=AXC-7800',
    shortDescription: 'The ultimate enterprise AP, featuring Tri-Band technology for massive client capacity and extreme performance.',
    longDescription: ["Leveraging an additional 5 GHz radio, the AXC-7800 effectively triples the available capacity, making it perfect for stadiums, massive conference halls, and mission-critical networks."],
    features: [
      'AX7800 Tri-Band (2.4 GHz + two 5 GHz)',
      'Future-proof Multi-Gigabit Uplink (5G/10G)',
      '8x8 MIMO Capability',
      'Support for High-Power Injectors',
    ],
    specifications: [
      { key: 'Wi-Fi Standard', value: '802.11ax Tri-Band' },
      { key: 'Max Throughput', value: '7770 Mbps' },
      { key: 'Uplink Port', value: '5G/10G BASE-T (PoE++)' },
      { key: 'MIMO', value: '8x8' },
    ]
  },
};

export default productDatabase;