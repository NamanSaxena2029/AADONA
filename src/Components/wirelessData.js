// src/data/wirelessData.js
import asw1200 from '../assets/ProductsImg/Wireless/IO/asw-1200.png';
import aix3000 from '../assets/ProductsImg/Wireless/IO/AIX-3000 .png';
// ... import all other images

export const wirelessProducts = [
  {
    id: 1,
    model: 'ASW-1200',
    fullName: 'ASW-1200 Indoor In-Wall Access Point',
    category: 'Indoor',
    segment: 'Business',
    series: 'APOLLO Series',
    speed: '1200 Mbps',
    standard: 'Wi-Fi 5',
    description: 'Compact and powerful 11ac Wave2 indoor access point designed for seamless in-wall installation.',
    imageUrl: asw1200,
    overview: "The ASW-1200 is a high-performance indoor in-wall access point...",
    features: [
      { title: 'Dual-Band 1200Mbps', description: 'Simultaneous 2.4GHz and 5GHz operation.' },
      { title: 'PoE Powered', description: 'Simplifies installation via Ethernet.' }
    ],
    specifications: {
      'Hardware': { 'Interface': '1x GE Port', 'Power': '802.3af/at' },
      'Wireless': { 'Frequency': '2.4GHz & 5GHz', 'MIMO': '2x2' }
    }
  },
  {
    id: 2,
    model: 'ASC-1200L-V2',
    fullName: 'ASC-1200L V2 Indoor Ceiling Mount Access Point',
    category: 'Indoor',
    segment: 'Business',
    series: 'APOLLO Series',
    speed: '1200 Mbps',
    standard: 'Wi-Fi 5',
    description: 'Reliable ceiling-mounted solution for high-density indoor coverage.',
    imageUrl: aix3000, // Replace with correct import
    overview: "Advanced ceiling AP for business environments...",
    features: [{ title: 'Ceiling Mount', description: 'Easy aesthetic mounting' }],
    specifications: { 'Hardware': { 'Power': 'PoE' } }
  },
  {
    id: 3,
    model: 'AXW-3000',
    fullName: 'ASC-1200L V2 Indoor Ceiling Mount Access Point',
    category: 'Indoor',
    segment: 'Business',
    series: 'APOLLO Series',
    speed: '1200 Mbps',
    standard: 'Wi-Fi 5',
    description: 'Reliable ceiling-mounted solution for high-density indoor coverage.',
    imageUrl: aix3000, // Replace with correct import
    overview: "Advanced ceiling AP for business environments...",
    features: [{ title: 'Ceiling Mount', description: 'Easy aesthetic mounting' }],
    specifications: { 'Hardware': { 'Power': 'PoE' } }
  },
  // ... Add all other 24 products here following the same object keys
];