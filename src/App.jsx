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

import { FaSearch, FaPlus } from "react-icons/fa";
import { BsActivity, BsDownload, BsX } from "react-icons/bs";
import { TbArrowsExchange2 } from "react-icons/tb";
import { LiaDonateSolid } from "react-icons/lia";

export default function App() {
  const [reportType, setReportType] = useState("number");
  const [totalViews, setTotalViews] = useState(0);
  const [value, setValue] = useState("");
  const [reason, setReason] = useState("");
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [showViews, setShowViews] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();

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
    if (!value || !reason) {
      return toast.error("Fill all fields");
    }

    await addDoc(collection(db, "scammers"), {
      type: reportType,
      value,
      reason,
      createdAt: serverTimestamp(),
    });

    setValue("");
    setReason("");

    toast.success("Submitted");

    setShowForm(false);
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
    <div className="min-h-screen bg-gradient-to-br from-[#f8fffb] via-[#eefaf3] to-[#e9f7ef] text-slate-800 relative">
      <Toaster position="top-right" />

      {/* TOP RIGHT ICONS */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
        <button
          onClick={() => navigate("/support")}
          className="text-[#00bc7d] transition hover:scale-110 bg-white p-2 rounded-full shadow"
        >
          <LiaDonateSolid className="text-2xl" />
        </button>

        <button
          onClick={handleViewClick}
          className="text-[#00bc7d] transition hover:scale-110 bg-white p-2 rounded-full shadow"
        >
          {showViews ? (
            <span className="text-sm">{totalViews}</span>
          ) : (
            <BsActivity className="text-2xl" />
          )}
        </button>

        <button
          onClick={() =>
            window.open(
              "https://drive.google.com/file/d/1tT9eLOoWFW9UemD65WAgtCKaBddbH742/view?usp=drivesdk",
              "_blank",
            )
          }
          className="text-[#00bc7d] transition hover:scale-110 bg-white p-2 rounded-full shadow"
        >
          <BsDownload className="text-2xl" />
        </button>

        <button
          onClick={() => navigate("/copypaste")}
          className="text-[#00bc7d] transition hover:scale-110 bg-white p-2 rounded-full shadow"
        >
          <TbArrowsExchange2 className="text-2xl" />
        </button>
      </div>

      {/* FLOATING PLUS BUTTON */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed right-5 top-1/2 -translate-y-1/2 z-50 bg-[#00bc7d] text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition"
      >
        <FaPlus className="text-xl" />
      </button>

      {/* SEARCH */}
      <section className="max-w-6xl py-17 mx-auto px-4 pb-6">
        <div className="relative max-w-xl mb-8">
          <FaSearch className="absolute left-4 top-4 text-slate-400" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reports..."
            className="w-full bg-white rounded-full border border-slate-200 pl-11 pr-4 py-3 shadow-md focus:outline-none focus:ring-2 focus:ring-[#00bc7d]"
          />
        </div>
      </section>

      {/* STATS */}
      <section className="pb-10">
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

      {/* REPORT LIST */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
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

      {/* POPUP FORM */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative animate-[fadeIn_.2s_ease]">
            {/* CLOSE */}
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-red-500"
            >
              <BsX className="text-3xl" />
            </button>

            <p className="text-[#00bc7d] text-sm font-semibold mb-2">
              Create Report
            </p>

            <h3 className="font-bold text-2xl text-slate-900 mb-5">
              Submit Scam Report
            </h3>

            <div className="space-y-4">
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
                className="w-full bg-[#00bc7d] text-white py-3 rounded-xl font-semibold shadow-lg hover:scale-[1.02] transition"
              >
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
