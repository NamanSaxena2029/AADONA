import React, { useMemo, useRef, useEffect, useState } from "react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

/* ---------------- Reveal Animation ---------------- */

const Reveal = ({ children }) => {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setShow(true),
      { threshold: 0.1 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {children}
    </div>
  );
};

/* ---------------- ZFS Calculation Engine ---------------- */

function zfsCalc({ disks, spares, sizeTB, raid, width, reservePct }) {
  const usableDisks = Math.max(0, disks - spares);
  const parity =
    raid === "raidz1" ? 1 :
    raid === "raidz2" ? 2 :
    raid === "raidz3" ? 3 : 0;

  const vdevs = Math.floor(usableDisks / width);
  const dataPerVdev = raid === "mirror" ? 1 : width - parity;

  const raw = usableDisks * sizeTB;
  const usableBeforeOH = vdevs * dataPerVdev * sizeTB;

  const slop = usableBeforeOH * 0.03;
  const overhead = usableBeforeOH * 0.04;
  const reserve = usableBeforeOH * (reservePct / 100);

  const usable = usableBeforeOH - slop - overhead - reserve;
  const efficiency = (usable / raw) * 100;

  return {
    raw: raw.toFixed(2),
    usable: usable.toFixed(2),
    efficiency: efficiency.toFixed(1),
    vdevs,
    parity,
    dataPerVdev,
  };
}

/* ---------------- Component ---------------- */

const NetworkStorageCalculator = () => {
  const [cfg, setCfg] = useState({
    disks: 24,
    spares: 2,
    sizeTB: 16,
    raid: "raidz2",
    width: 6,
    reservePct: 3,
  });

  const res = useMemo(() => zfsCalc(cfg), [cfg]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Banner */}
      <div className="bg-gradient-to-r from-green-700 to-green-900 pt-32 pb-16 text-center">
        <h1 className="text-5xl font-bold text-white">
          Network Storage Calculator
        </h1>
        <p className="mt-6 text-green-100 text-xl max-w-3xl mx-auto">
          Plan your ZFS storage pools with accurate usable capacity and best practices.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-14 space-y-14">

        {/* Guide */}
        <Reveal>
          <p className="text-slate-600 text-lg text-center">
            Enter your disk configuration to calculate usable storage after RAID and ZFS overhead.
          </p>
        </Reveal>

        {/* Inputs */}
        <Reveal>
          <section className="bg-white shadow-lg rounded-2xl p-8 grid md:grid-cols-3 gap-6 border">
            <Input label="Total Disks" value={cfg.disks}
              onChange={(v)=>setCfg(s=>({...s,disks:v}))} />

            <Input label="Hot Spares" value={cfg.spares}
              onChange={(v)=>setCfg(s=>({...s,spares:v}))} />

            <Input label="Disk Size (TB)" value={cfg.sizeTB}
              onChange={(v)=>setCfg(s=>({...s,sizeTB:v}))} />

            <Select label="RAID Type" value={cfg.raid}
              onChange={(v)=>setCfg(s=>({...s,raid:v}))}
              options={["mirror","raidz1","raidz2","raidz3"]} />

            <Input label="VDEV Width" value={cfg.width}
              onChange={(v)=>setCfg(s=>({...s,width:v}))} />

            <Input label="Reservation %" value={cfg.reservePct}
              onChange={(v)=>setCfg(s=>({...s,reservePct:v}))} />
          </section>
        </Reveal>

        {/* Results */}
        <Reveal>
          <div>
            <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
              Calculation Result
            </h2>

            <section className="grid md:grid-cols-4 gap-6 text-center">
              <Card title="Raw Capacity (TB)" value={res.raw} />
              <Card title="Usable Capacity (TB)" value={res.usable} />
              <Card title="Efficiency" value={`${res.efficiency}%`} />
              <Card title="VDEVs Formed" value={res.vdevs} />
            </section>
          </div>
        </Reveal>

        {/* Recommendations */}
        <Reveal>
          <section className="bg-amber-50 border border-amber-200 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-amber-700 mb-4">
              Recommendations & Advice
            </h2>

            <ul className="space-y-3 text-slate-700">
              {(cfg.disks - cfg.spares) % cfg.width !== 0 && (
                <li>• Some disks are not used in any VDEV. Adjust VDEV width.</li>
              )}
              {cfg.raid === "raidz1" && (
                <li>• RAIDZ1 is risky for large disks. RAIDZ2 is safer.</li>
              )}
              {cfg.width > 10 && (
                <li>• Very wide VDEVs increase rebuild risk. Recommended width is 6–10.</li>
              )}
              {cfg.reservePct < 3 && (
                <li>• Keep at least 3–5% reservation for healthy ZFS pools.</li>
              )}
              <li>
                • Each VDEV uses <strong>{res.dataPerVdev}</strong> data disks and{" "}
                <strong>{res.parity}</strong> parity disk(s).
              </li>
            </ul>
          </section>
        </Reveal>

      </div>

      <Footer />
    </div>
  );
};

/* ---------------- Small UI Components ---------------- */

const Input = ({ label, value, onChange }) => (
  <div>
    <label className="block font-medium mb-1">{label}</label>
    <input
      type="number"
      value={value}
      onChange={(e)=>onChange(Number(e.target.value))}
      className="w-full border border-green-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none"
    />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div>
    <label className="block font-medium mb-1">{label}</label>
    <select
      value={value}
      onChange={(e)=>onChange(e.target.value)}
      className="w-full border border-green-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none"
    >
      {options.map(o=>(
        <option key={o} value={o}>{o.toUpperCase()}</option>
      ))}
    </select>
  </div>
);

const Card = ({ title, value }) => (
  <div className="border rounded-2xl p-6 shadow-md bg-white">
    <div className="text-gray-500 text-sm">{title}</div>
    <div className="text-2xl font-semibold mt-3 text-green-700">
      {value}
    </div>
  </div>
);

export default NetworkStorageCalculator;




