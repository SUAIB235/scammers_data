import { useEffect, useRef, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import { FaSearch } from "react-icons/fa";

export default function App() {
  const [reportType, setReportType] = useState("number");
  const [value, setValue] = useState("");
  const [reason, setReason] = useState("");
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);

  const submitRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, "scammers"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (s) =>
      setData(s.docs.map((d) => ({ id: d.id, ...d.data() }))),
    );
  }, []);

  const submit = async () => {
    if (!value || !reason) return toast.error("Fill all fields");

    await addDoc(collection(db, "scammers"), {
      type: reportType,
      value,
      reason,
      createdAt: serverTimestamp(),
    });

    setValue("");
    setReason("");
    toast.success("Submitted");
  };

  const scrollToSubmit = () => {
    submitRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const scrollToSearch = () => {
    searchRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const filtered = data.filter((i) =>
    [i.type, i.value, i.reason].some((v) =>
      v?.toLowerCase().includes(search.toLowerCase()),
    ),
  );

  const stats = [
    { n: data.length, t: "Total Reports" },
    { n: filtered.length, t: "Matches Found" },
    { n: "24/7", t: "Live Search" },
    { n: "100%", t: "Community Driven" },
  ];

  return (
    <div className="min-h-screen bg-[#f5faf6] text-slate-800">
      <Toaster position="top-right" />
      
     {/* ✅ APP DOWNLOAD BUTTON (RESTORED) */}
      <div className="fixed top-5 left-4 z-50">
        <a
          href="https://drive.google.com/file/d/1tT9eLOoWFW9UemD65WAgtCKaBddbH742/view?usp=drivesdk"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          <button className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-xl hover:scale-105 transition">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
              alt="Drive"
              className="w-7 h-7"
            />
            <div className="text-left">
              <p className="text-xs text-gray-600">Get the app</p>
              <p className="font-semibold text-gray-800">Download APK</p>
            </div>
          </button>
        </a>
      </div>
      
      {/* HERO */}
      <section className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-emerald-600 font-semibold mb-3">
            Community Protection Platform
          </p>

          <h1 className="text-5xl font-bold leading-tight">
            Report Scammers{" "}
            <span className="text-emerald-500">With Confidence</span>
          </h1>

          <p className="mt-4 text-slate-500">
            Search suspicious numbers, usernames, and bank details. Help others
            stay safe by submitting reports instantly.
          </p>

          {/* MOBILE BUTTONS ONLY */}
          <div className="mt-6 flex gap-3 md:hidden">
            <button
              onClick={scrollToSubmit}
              className="bg-emerald-500 text-white px-5 py-3 rounded-lg w-full"
            >
              Submit Report
            </button>

            <button
              onClick={scrollToSearch}
              className="border px-5 py-3 rounded-lg w-full"
            >
              Search Now
            </button>
          </div>
        </div>

        {/* DESKTOP SUBMIT FORM */}
        <div
          ref={submitRef}
          className="hidden md:block bg-white rounded-2xl shadow-xl p-6 space-y-4"
        >
          <h3 className="font-bold text-xl">Create Scam Report</h3>

          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full border rounded-lg p-3"
          >
            <option value="number">Phone Number</option>
            <option value="username">Username</option>
            <option value="bank">Bank Info</option>
          </select>

          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={
              reportType === "number"
                ? "Enter Number"
                : reportType === "username"
                  ? "Enter Username"
                  : "Enter Bank"
            }
            className="w-full border rounded-lg p-3"
          />

          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason"
            className="w-full border rounded-lg p-3 h-28"
          />

          <button
            onClick={submit}
            className="w-full bg-emerald-500 text-white py-3 rounded-lg font-semibold"
          >
            Submit Now
          </button>
        </div>
      </section>

      {/* MOBILE SUBMIT FORM */}
      <section className="px-4 pb-6 md:hidden">
        <div
          ref={submitRef}
          className="bg-white rounded-2xl shadow-xl p-6 space-y-4"
        >
          <h3 className="font-bold text-xl">Create Scam Report</h3>

          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full border rounded-lg p-3"
          >
            <option value="number">Phone Number</option>
            <option value="username">Username</option>
            <option value="bank">Bank Info</option>
          </select>

           <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={
              reportType === "number"
                ? "Enter Number"
                : reportType === "username"
                  ? "Enter Username"
                  : "Enter Bank"
            }
            className="w-full border rounded-lg p-3"
          />

          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason"
            className="w-full border rounded-lg p-3 h-28"
          />

          <button
            onClick={submit}
            className="w-full bg-emerald-500 text-white py-3 rounded-lg font-semibold"
          >
            Submit Now
          </button>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-white py-8 border-y">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="text-3xl font-bold">{s.n}</div>
              <div className="text-sm text-slate-500">{s.t}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SEARCH */}
      <section ref={searchRef} className="max-w-6xl mx-auto px-4 py-10">
        <div className="relative max-w-xl mb-8">
          <FaSearch className="absolute left-4 top-4 text-slate-400" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reports..."
            className="w-full bg-white rounded-full border pl-11 pr-4 py-3 shadow-sm"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border p-5 shadow-sm"
            >
              <div className="font-semibold capitalize">{item.type}</div>
              <div className="text-lg mt-1">{item.value}</div>
              <div className="text-slate-500 text-sm mt-2">{item.reason}</div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center text-slate-400 py-10">
            No reports found
          </div>
        )}
      </section>
    </div>
  );
}
