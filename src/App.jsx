import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import { FaCopy, FaSearch } from "react-icons/fa";
import { BsActivity, BsDownload, BsX } from "react-icons/bs";
import { TbArrowsExchange2 } from "react-icons/tb";

export default function App() {
  const [reportType, setReportType] = useState("number");
  const [totalViews, setTotalViews] = useState(0);
  const [showServices, setShowServices] = useState(false);
  const [value, setValue] = useState("");
  const [reason, setReason] = useState("");
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [showViews, setShowViews] = useState(false);
  const navigate = useNavigate();

  const submitRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, "scammers"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (s) =>
      setData(s.docs.map((d) => ({ id: d.id, ...d.data() }))),
    );
  }, []);

  useEffect(() => {
    const countVisit = async () => {
      const ref = doc(db, "analytics", "global");

      const snap = await getDoc(ref);

      if (snap.exists()) {
        await updateDoc(ref, {
          views: increment(1),
        });

        setTotalViews(snap.data().views + 1);
      } else {
        await setDoc(ref, {
          views: 1,
        });

        setTotalViews(1);
      }
    };

    countVisit();
  }, []);

  const handleViewClick = () => {
    setShowViews(true);

    setTimeout(() => {
      setShowViews(false);
    }, 3000);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-[#f8fffb] via-[#eefaf3] to-[#e9f7ef] text-slate-800">
      <Toaster position="top-right" />

      {/* 👁 VIEW + DOWNLOAD (TOP LEFT) */}
      <div className="absolute top-3 right-4 z-50 flex items-center gap-3">
        {/* VIEW BUTTON */}
        <button
          onClick={handleViewClick}
          className="text-[#00bc7d] font-semibold transition hover:scale-105"
        >
          {showViews ? (
            <span className="text-sm bg-white/70 backdrop-blur-md px-3 py-1 rounded-full shadow-md border border-white">
              Total Visitors: {totalViews}
            </span>
          ) : (
            <BsActivity className="text-2xl drop-shadow-sm" />
          )}
        </button>

        {/* DOWNLOAD BUTTON */}
        <button
          onClick={() =>
            window.open(
              "https://drive.google.com/file/d/1tT9eLOoWFW9UemD65WAgtCKaBddbH742/view?usp=drivesdk",
              "_blank",
            )
          }
          className="text-[#00bc7d] transition hover:scale-105"
        >
          <BsDownload className="text-2xl drop-shadow-sm" />
        </button>

        {/* MORE SERVICES */}
        <button
          onClick={() => navigate("/copypaste")}
          className="text-[#00bc7d] transition hover:scale-105"
        >
          <TbArrowsExchange2 className="text-2xl drop-shadow-sm" />
        </button>
      </div>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-[#00bc7d] font-semibold mb-3 tracking-wide">
            Community Protection Platform
          </p>

          <h1 className="text-5xl font-bold leading-tight text-slate-900">
            Report Scammers{" "}
            <span className="text-[#00bc7d]">With Confidence</span>
          </h1>

          <p className="mt-4 text-slate-500 leading-relaxed">
            Search suspicious numbers, usernames, and bank details. Help others
            stay safe by submitting reports instantly.
          </p>

          {/* MOBILE BUTTONS ONLY */}
          <div className="mt-6 flex gap-3 md:hidden">
            <button
              onClick={scrollToSubmit}
              className="bg-[#00bc7d] text-white px-5 py-3 rounded-xl w-full shadow-lg hover:scale-105 transition"
            >
              Submit Report
            </button>

            <button
              onClick={scrollToSearch}
              className="bg-white border border-slate-200 px-5 py-3 rounded-xl w-full shadow-md hover:scale-105 transition"
            >
              Search Now
            </button>
          </div>
        </div>

        {/* DESKTOP SUBMIT FORM */}
        <div
          ref={submitRef}
          className="hidden md:block bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white p-6 space-y-4"
        >
          <h3 className="font-bold text-xl text-slate-900">
            Create Scam Report
          </h3>

          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#00bc7d]"
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
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#00bc7d]"
          />

          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 h-28 focus:outline-none focus:ring-2 focus:ring-[#00bc7d]"
          />

          <button
            onClick={submit}
            className="w-full bg-[#00bc7d] text-white py-3 rounded-xl font-semibold shadow-lg hover:scale-[1.02] transition"
          >
            Submit Now
          </button>
        </div>
      </section>

      {/* MOBILE SUBMIT FORM */}
      <section className="px-4 pb-6 md:hidden">
        <div
          ref={submitRef}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white p-6 space-y-4"
        >
          <h3 className="font-bold text-xl text-slate-900">
            Create Scam Report
          </h3>

          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
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
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
          />

          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 h-28"
          />

          <button
            onClick={submit}
            className="w-full bg-[#00bc7d] text-white py-3 rounded-xl font-semibold shadow-lg"
          >
            Submit Now
          </button>
        </div>
      </section>

      {/* STATS */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow-md border border-white"
            >
              <div className="text-3xl font-bold text-slate-900">{s.n}</div>
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
            className="w-full bg-white rounded-full border border-slate-200 pl-11 pr-4 py-3 shadow-md focus:outline-none focus:ring-2 focus:ring-[#00bc7d]"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-100 p-5 shadow-md hover:shadow-xl transition"
            >
              <div className="font-semibold capitalize text-[#00bc7d]">
                {item.type}
              </div>

              <div className="text-lg mt-1 font-semibold text-slate-900">
                {item.value}
              </div>

              <div className="text-slate-500 text-sm mt-3 italic border-l-4 border-[#00bc7d] pl-3">
                {item.reason}
              </div>
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
