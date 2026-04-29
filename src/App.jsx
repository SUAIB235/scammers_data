import { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";

export default function App() {
  const [reportType, setReportType] = useState("number");
  const [value, setValue] = useState("");
  const [reason, setReason] = useState("");
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "scammers"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setData(list);
    });

    return () => unsub();
  }, []);

  const handleSubmit = async () => {
    if (!value || !reason) {
      toast.error("Please fill all fields");
      return;
    }

    await addDoc(collection(db, "scammers"), {
      type: reportType,
      value,
      reason,
      createdAt: serverTimestamp(),
    });

    setValue("");
    setReason("");

    toast.success("Scammer report added ✅");
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "scammers", id));
    toast.success("Deleted successfully ❌");
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied: " + text);
  };

  const filteredData = data.filter((item) => {
    const searchLower = search.toLowerCase();

    return (
      item.value?.toLowerCase().includes(searchLower) ||
      item.reason?.toLowerCase().includes(searchLower) ||
      item.type?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100 p-4 md:p-8">
      <Toaster position="top-right" />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🚨 Scammer Report Database
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            Search and report scammer numbers, usernames, and bank details.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white shadow-xl rounded-3xl border border-gray-100 p-6 md:p-8">
          {/* Search */}
          <div className="relative mb-6">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search by number, username, bank, or reason..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 transition"
            />
          </div>

          {/* Form */}
          <div className="space-y-4 mb-8">
            <select
              value={reportType}
              onChange={(e) => {
                setReportType(e.target.value);
                setValue("");
              }}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 transition"
            >
              <option value="number">📱 Report by Number</option>
              <option value="username">👤 Report by Username</option>
              <option value="bank">🏦 Report by Bank</option>
            </select>

            <input
              type="text"
              placeholder={
                reportType === "number"
                  ? "Enter scammer number"
                  : reportType === "username"
                  ? "Enter scammer username"
                  : "Enter bank information"
              }
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 transition"
            />

            <textarea
              placeholder="Enter scam details or reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 transition"
            />

            <button
              onClick={handleSubmit}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-2xl font-semibold shadow-md transition duration-200"
            >
              Add Scammer Report
            </button>
          </div>

          {/* Records */}
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {filteredData.map((item, index) => (
              <div
                key={item.id}
                className="bg-gray-50 border border-gray-100 rounded-2xl p-5 hover:shadow-md transition duration-200"
              >
                <div className="flex justify-between items-start gap-4 flex-wrap">
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>
                      <span className="font-semibold text-gray-900">Serial:</span>{" "}
                      {index + 1}
                    </p>

                    <p>
                      <span className="font-semibold text-gray-900">Type:</span>{" "}
                      <span className="capitalize">{item.type}</span>
                    </p>

                    <p>
                      <span className="font-semibold text-gray-900">Reported:</span>{" "}
                      {item.value}
                    </p>

                    <p>
                      <span className="font-semibold text-gray-900">Reason:</span>{" "}
                      {item.reason}
                    </p>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => copyText(item.value)}
                      className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm hover:bg-gray-100 transition"
                    >
                      Copy
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm hover:bg-red-200 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredData.length === 0 && (
            <p className="text-center text-gray-400 mt-8">
              No scammer reports found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
