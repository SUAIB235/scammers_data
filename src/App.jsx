import { useEffect, useState } from "react";
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

import {
  FaSearch,
  FaUserShield,
  FaPhone,
  FaUniversity,
  FaExclamationTriangle,
} from "react-icons/fa";

export default function App() {
  const [reportType, setReportType] = useState("number");
  const [value, setValue] = useState("");
  const [reason, setReason] = useState("");
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "scammers"),
      orderBy("createdAt", "desc")
    );

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

    toast.success("Report submitted");
  };

  const filteredData = data.filter((item) => {
    const searchLower = search.toLowerCase();
    return (
      item.value?.toLowerCase().includes(searchLower) ||
      item.reason?.toLowerCase().includes(searchLower) ||
      item.type?.toLowerCase().includes(searchLower)
    );
  });

  const totalCount = data.length;

  const getTypeIcon = (type) => {
    if (type === "number") return <FaPhone />;
    if (type === "username") return <FaUserShield />;
    if (type === "bank") return <FaUniversity />;
    return <FaExclamationTriangle />;
  };

  const getAlertColor = (reason) => {
    if (reason?.toLowerCase().includes("fraud")) return "text-red-500";
    return "text-yellow-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-black">
      <Toaster position="top-right" />

      {/* Navbar */}
      <div className="bg-white shadow-sm px-4 py-3 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto">

          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-2.5 text-gray-400 text-sm" />

            <input
              type="text"
              placeholder="Search scam reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-full pl-9 pr-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-5xl mx-auto p-4">

        {/* Header */}
        {!search && (
          <div className="text-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold mb-1">
              Report Scam Activity
            </h2>

            <p className="text-gray-500 text-sm">
              Submit and search scam reports
            </p>

            <div className="mt-2 text-sm font-semibold">
              Total Reports:
              <span className="ml-2 text-red-500">
                {totalCount}
              </span>
            </div>
          </div>
        )}

        {/* Form */}
        {!search && (
          <div className="bg-white border rounded-lg p-4 mb-6 space-y-3 shadow-sm">

            <div className="relative">
              <FaPhone className="absolute left-3 top-2.5 text-gray-400 text-sm" />
              <select
                value={reportType}
                onChange={(e) => {
                  setReportType(e.target.value);
                  setValue("");
                }}
                className="w-full border rounded-md pl-9 pr-3 py-2 text-sm bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="number">Phone Number</option>
                <option value="username">Username</option>
                <option value="bank">Bank Info</option>
              </select>
            </div>

            <div className="relative">
              {getTypeIcon(reportType)}
              <input
                type="text"
                placeholder="Enter value..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <textarea
              placeholder="Enter reason..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm h-24 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-semibold hover:bg-blue-700"
            >
              Submit Report
            </button>
          </div>
        )}

        {/* Results */}
        <div className="space-y-3">

          {filteredData.map((item, index) => (

            <div
              key={item.id}
              className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >

              <div className="flex gap-3">

                <div className={`text-lg ${getAlertColor(item.reason)}`}>
                  {getTypeIcon(item.type)}
                </div>

                <div className="text-sm flex-1">

                  <p className="font-semibold text-gray-800">
                    #{index + 1} • {item.type}
                  </p>

                  <p className="text-gray-600">
                    {item.value}
                  </p>

                  <p className="text-gray-500 text-xs mt-1">
                    {item.reason}
                  </p>

                </div>

              </div>

            </div>

          ))}

          {filteredData.length === 0 && (
            <div className="text-center text-gray-400 mt-10 flex flex-col items-center gap-2">
              <FaExclamationTriangle className="text-3xl text-yellow-500" />
              No scammer reports found
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
