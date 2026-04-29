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
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center p-4">
      <Toaster position="top-right" />

      <div className="w-full max-w-3xl bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl p-6 border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-red-600 mb-6">
          🚨 Scammer Report Database
        </h1>

        {/* Search Section */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by number, username, bank, or reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Form Section */}
        <div className="space-y-4 mb-6">
          <select
            value={reportType}
            onChange={(e) => {
              setReportType(e.target.value);
              setValue("");
            }}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="number">Report by Number</option>
            <option value="username">Report by Username</option>
            <option value="bank">Report by Bank</option>
          </select>

          {reportType === "number" && (
            <input
              type="text"
              placeholder="Enter scammer number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          )}

          {reportType === "username" && (
            <input
              type="text"
              placeholder="Enter scammer username"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          )}

          {reportType === "bank" && (
            <input
              type="text"
              placeholder="Enter scammer bank info"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          )}

          <textarea
            placeholder="Enter reason / scam details"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 h-28 resize-none"
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-red-600 text-white rounded-xl py-3 hover:bg-red-700 transition font-semibold"
          >
            Add Scammer Report
          </button>
        </div>

        {/* Data List */}
        <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
          {filteredData.map((item, index) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-lg transition"
            >
              <div className="space-y-2">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Serial:</span> {index + 1}
                </p>

                <p className="text-sm text-gray-700 capitalize">
                  <span className="font-semibold">Type:</span> {item.type}
                </p>

                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Reported Value:</span> {item.value}
                </p>

                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Reason:</span> {item.reason}
                </p>
              </div>

              <div className="flex gap-2 mt-4 flex-wrap">
                <button
                  onClick={() => copyText(item.value)}
                  className="px-3 py-2 bg-slate-200 rounded-lg hover:bg-slate-300 text-sm"
                >
                  Copy
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredData.length === 0 && (
          <p className="text-center text-gray-400 mt-6">
            No scammer reports found
          </p>
        )}
      </div>
    </div>
  );
}
