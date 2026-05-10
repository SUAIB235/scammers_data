import { useEffect, useState } from "react";
import { db } from "./firebase";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  doc,
  deleteDoc,
  updateDoc,
  increment,
  getDoc,
  setDoc,
} from "firebase/firestore";

import toast, { Toaster } from "react-hot-toast";

import { FaRocket, FaCopy, FaKey } from "react-icons/fa";
import { BsActivity, BsDownload, BsX, BsTrash, BsPencil } from "react-icons/bs";
import { MdReport } from "react-icons/md";
import { TbArrowsExchange2 } from "react-icons/tb";
import { LiaDonateSolid } from "react-icons/lia";

export default function App() {
  const [accessKey, setAccessKey] = useState("");
  const [showKeySetup, setShowKeySetup] = useState(true);

  const [number, setNumber] = useState("");
  const [data, setData] = useState([]);
  const [services, setServices] = useState([]);

  const [totalViews, setTotalViews] = useState(0);
  const [showViews, setShowViews] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  // 🔑 LOAD KEY FROM LOCAL STORAGE
  useEffect(() => {
    const savedKey = localStorage.getItem("accessKey");
    if (savedKey) {
      setAccessKey(savedKey);
      setShowKeySetup(false);
    }
  }, []);

  // 📊 LOAD RECORDS
  useEffect(() => {
    if (!accessKey) return;

    const q = query(
      collection(db, "keys", accessKey, "records"),
      orderBy("createdAt", "desc"),
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setData(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsub();
  }, [accessKey]);

  // 📦 LOAD SERVICES
  useEffect(() => {
    if (!accessKey) return;

    const q = query(
      collection(db, "keys", accessKey, "services"),
      orderBy("createdAt", "desc"),
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setServices(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsub();
  }, [accessKey]);

  // 👁 VIEW COUNTER
  useEffect(() => {
    const run = async () => {
      const ref = doc(db, "analytics", "global");

      try {
        await updateDoc(ref, { views: increment(1) });
        const snap = await getDoc(ref);
        setTotalViews(snap.data().views);
      } catch {
        await setDoc(ref, { views: 1 });
        setTotalViews(1);
      }
    };

    run();
  }, []);

  // 🔑 SAVE KEY
  const saveKey = async () => {
    if (!accessKey.trim()) {
      return toast.error("Enter valid key");
    }

    localStorage.setItem("accessKey", accessKey);
    setShowKeySetup(false);

    toast.success("Key saved");
  };

  // ➕ ADD RECORD
  const handleSubmit = async () => {
    if (!number.trim()) return toast.error("Enter number");

    await setDoc(
      doc(db, "keys", accessKey),
      { createdAt: serverTimestamp() },
      { merge: true },
    );

    await addDoc(collection(db, "keys", accessKey, "records"), {
      number,
      createdAt: serverTimestamp(),
    });

    setNumber("");
    toast.success("Added");
  };

  // ❌ DELETE
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "keys", accessKey, "records", id));
    toast.success("Deleted");
  };

  const handleViewClick = () => {
    setShowViews(true);
    setTimeout(() => setShowViews(false), 3000);
  };

  // 🔑 KEY SETUP UI
  if (showKeySetup) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#eef6f1]">
        <div className="bg-white p-6 rounded-2xl shadow w-[90%] max-w-sm">
          {/* 🔐 ICON */}
          <div className="flex justify-center mb-3">
            <div className="bg-green-100 p-3 rounded-full">
              <FaKey className="text-green-600 text-xl" />
            </div>
          </div>

          {/* 🧠 UPDATED TITLE */}
          <h2 className="mb-2 font-semibold text-center text-lg text-gray-800">
            Secure Access Key
          </h2>

          {/* 📝 INSTRUCTION */}
          <p className="text-sm text-gray-500 text-center mb-4 leading-relaxed">
            Enter your unique key to access your private data space. Same key =
            same data.
          </p>

          <input
            value={accessKey}
            onChange={(e) => setAccessKey(e.target.value)}
            placeholder="e.g. my-secret-key"
            className="border px-3 py-3 rounded-lg w-full mb-4 focus:ring-2 focus:ring-green-500 outline-none"
          />

          <button
            onClick={saveKey}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition active:scale-95"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  // 🧩 MAIN UI
  return (
    <div className="min-h-screen bg-[#eef6f1] flex items-center justify-center p-4">
      <Toaster />

      {/* PREMIUM FLOATING MENU */}
      <div className="fixed top-4 right-4 z-[9999]">
        {/* MENU BUTTON */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className={`group relative w-11 h-11 rounded-2xl backdrop-blur-2xl border border-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center justify-center transition-all duration-300 ${
            showMenu ? "bg-[#00bc7d] scale-105" : "bg-white/80 hover:scale-105"
          }`}
        >
          <div className="flex flex-col gap-1">
            <span
              className={`w-4 h-[2px] rounded-full transition-all duration-300 ${
                showMenu ? "rotate-45 translate-y-2 bg-white" : "bg-[#00bc7d]"
              }`}
            />

            <span
              className={`w-4 h-[2px] rounded-full transition-all duration-300 ${
                showMenu ? "opacity-0" : "bg-[#00bc7d]"
              }`}
            />

            <span
              className={`w-4 h-[2px] rounded-full transition-all duration-300 ${
                showMenu ? "-rotate-45 -translate-y-2 bg-white" : "bg-[#00bc7d]"
              }`}
            />
          </div>
        </button>

        {/* MENU PANEL */}
        <div
          className={`absolute top-16 right-0 w-60 transition-all duration-300 origin-top-right ${
            showMenu
              ? "opacity-100 scale-100 visible"
              : "opacity-0 scale-95 invisible"
          }`}
        >
          <div className="overflow-hidden rounded-2xl border border-white/40 bg-white/80 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
            {/* HEADER */}
            <div className="px-4 py-3 bg-gradient-to-r from-[#00bc7d] to-emerald-400 text-white">
              <p className="text-sm opacity-90">Quick Access</p>

              <h3 className="text-lg font-bold mt-1">Dashboard Menu</h3>
            </div>

            {/* MENU ITEMS */}
            <div className="p-3 space-y-2">
              {/* SUPPORT */}
              <button
                onClick={() => {
                  navigate("/support");
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-[#f4fffa] transition group"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#e8fff5] flex items-center justify-center group-hover:scale-110 transition">
                  <LiaDonateSolid className="text-xl text-[#00bc7d]" />
                </div>

                <div className="text-left">
                  <p className="font-semibold text-slate-800">Support</p>

                  <p className="text-xs text-slate-500">Help the community</p>
                </div>
              </button>

              {/* VISITORS */}
              <button
                onClick={handleViewClick}
                className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-[#f4fffa] transition group"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#e8fff5] flex items-center justify-center group-hover:scale-110 transition">
                  <BsActivity className="text-xl text-[#00bc7d]" />
                </div>

                <div className="text-left">
                  <p className="font-semibold text-slate-800">Visitors</p>

                  <p className="text-xs text-slate-500">
                    {showViews
                      ? `${totalViews} total visitors`
                      : "View analytics"}
                  </p>
                </div>
              </button>

              {/* DOWNLOAD */}
              <button
                onClick={() => {
                  window.open(
                    "https://drive.google.com/file/d/174yAsyTZWD-6cdUycCsPGtWpvGcSLnEQ/view?usp=drive_link",
                    "_blank",
                  );

                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-[#f4fffa] transition group"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#e8fff5] flex items-center justify-center group-hover:scale-110 transition">
                  <BsDownload className="text-xl text-[#00bc7d]" />
                </div>

                <div className="text-left">
                  <p className="font-semibold text-slate-800">Download</p>

                  <p className="text-xs text-slate-500">Get resources</p>
                </div>
              </button>

              {/* SERVICES */}
              <button
                onClick={() => {
                  navigate("/");
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-[#f4fffa] transition group"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#e8fff5] flex items-center justify-center group-hover:scale-110 transition">
                  <TbArrowsExchange2 className="text-xl text-[#00bc7d]" />
                </div>

                <div className="text-left">
                  <p className="font-semibold text-slate-800">More Services</p>

                  <p className="text-xs text-slate-500">Explore tools</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="w-full max-w-2xl bg-white rounded-3xl p-4 sm:p-6 shadow-lg">
        <h1 className="text-center text-xl font-bold mb-3">
          <FaRocket className="inline text-green-600" /> Quick Data Manager
        </h1>

        {/* KEY DISPLAY */}
        <div className="flex justify-center items-center gap-2 mb-4">
          <p className="text-sm text-gray-500">Key: {accessKey}</p>

          <button
            onClick={() => setShowKeySetup(true)}
            className="text-green-600"
          >
            <BsPencil />
          </button>
        </div>

        {/* INPUT + BUTTON (MOBILE FRIENDLY) */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="flex-1 border px-4 py-3 rounded-xl text-base focus:ring-2 focus:ring-green-500"
            placeholder="Enter Number"
          />

          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium active:scale-95"
          >
            Add
          </button>
        </div>

        {/* DATA LIST */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {data.map((item, i) => (
            <div
              key={item.id}
              className="bg-gray-50 p-4 rounded-xl flex justify-between items-center shadow-sm"
            >
              <div>
                <p className="text-xs text-gray-400">#{i + 1}</p>
                <p>{item.number}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(item.number);
                    toast.success("Copied!");
                  }}
                  className="bg-green-500 text-white px-3 py-2 rounded-lg active:scale-95"
                >
                  <FaCopy />
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 text-white px-3 py-2 rounded-lg active:scale-95"
                >
                  <BsTrash />
                </button>
              </div>
            </div>
          ))}
        </div>

        {data.length === 0 && (
          <p className="text-center text-gray-400 mt-4">No records yet</p>
        )}
      </div>
    </div>
  );
}
