import { BarChart2, Users, Eye, Clock, Smartphone, Monitor, Tablet, ExternalLink } from "lucide-react";

const GA_URL = "https://analytics.google.com/analytics/web/#/p524687355/reports/intelligenthome";

const cards = [
  {
    icon: <Users className="text-green-600" size={28} />,
    title: "Realtime Users",
    desc: "Number of users currently active on the website",
    bg: "bg-green-50",
    border: "border-green-200",
    action: "realtime",
  },
  {
    icon: <Eye className="text-blue-600" size={28} />,
    title: "Page Views",
    desc: "Track which pages are viewed the most",
    bg: "bg-blue-50",
    border: "border-blue-200",
    action: "pages",
  },
  {
    icon: <Clock className="text-purple-600" size={28} />,
    title: "Session Duration",
    desc: "Average time users spend on the website",
    bg: "bg-purple-50",
    border: "border-purple-200",
    action: "engagement",
  },
  {
    icon: <BarChart2 className="text-orange-600" size={28} />,
    title: "Traffic Sources",
    desc: "Where your website traffic is coming from",
    bg: "bg-orange-50",
    border: "border-orange-200",
    action: "acquisition",
  },
  {
    icon: <Monitor className="text-teal-600" size={28} />,
    title: "Device Breakdown",
    desc: "Distribution of visitors across mobile, desktop, and tablet",
    bg: "bg-teal-50",
    border: "border-teal-200",
    action: "tech-overview",
  },
  {
    icon: <Users className="text-red-600" size={28} />,
    title: "Audience Insights",
    desc: "User locations including countries and cities",
    bg: "bg-red-50",
    border: "border-red-200",
    action: "user-attributes-overview",
  },
];

export default function Insights() {
  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="bg-white rounded-3xl shadow-xl border border-green-100 p-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-green-800 mb-1">📊 Website Insights</h2>
            <p className="text-gray-500 text-sm">
              View live analytics data from Google Analytics. Click any card below to open the detailed report.
            </p>
          </div>
          <a
            href={GA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition font-bold shadow-md"
          >
            <ExternalLink size={18} />
            Open Full Dashboard
          </a>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <a
            key={i}
            href={GA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`${card.bg} border-2 ${card.border} rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group`}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm group-hover:shadow-md transition">
                {card.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-base mb-1">{card.title}</h3>
                <p className="text-gray-500 text-sm">{card.desc}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-gray-400 group-hover:text-gray-600 transition">
              <ExternalLink size={12} />
              View in Google Analytics
            </div>
          </a>
        ))}
      </div>

      {/* Info Box */}
      <div className="bg-white rounded-2xl border border-green-100 shadow p-6">
        <h3 className="font-bold text-green-800 mb-4 text-lg">📌 What to Check in Google Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex gap-3 items-start">
            <span className="text-green-500 font-bold mt-0.5">→</span>
            <div>
              <span className="font-semibold text-gray-800">Realtime:</span> See how many users are currently active and which pages they are viewing
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-green-500 font-bold mt-0.5">→</span>
            <div>
              <span className="font-semibold text-gray-800">Reports → Acquisition:</span> Analyze traffic sources such as Google search, direct visits, and social media
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-green-500 font-bold mt-0.5">→</span>
            <div>
              <span className="font-semibold text-gray-800">Reports → Engagement:</span> Identify the most popular pages on your website
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-green-500 font-bold mt-0.5">→</span>
            <div>
              <span className="font-semibold text-gray-800">Reports → Demographics:</span> View user locations including cities and countries
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-green-500 font-bold mt-0.5">→</span>
            <div>
              <span className="font-semibold text-gray-800">Reports → Tech:</span> Compare usage across mobile, desktop, and tablet devices
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-green-500 font-bold mt-0.5">→</span>
            <div>
              <span className="font-semibold text-gray-800">Home:</span> Get an overview of performance over the last 7, 28, or 90 days
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}