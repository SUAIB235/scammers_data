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

    toast.success("Report submitted successfully");
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

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Toaster position="top-right" />

      {/* Navbar */}
      <div className="bg-white shadow-md border-b px-4 py-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Search */}
          <div className="relative w-full md:w-80">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />

            <input
              type="text"
              placeholder="Search reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-5xl mx-auto p-4 md:p-8">

        {/* Header Center */}
        <div className="text-center mb-8">

          <h2 className="text-3xl font-bold mb-2">
            Report Scam Activity
          </h2>

          <p className="text-gray-600">
            Submit and search scammer numbers,
            usernames, and bank details.
          </p>

          {/* Total Count */}
          <div className="mt-4 text-lg font-semibold">

            Total Reports:

            <span className="ml-2 text-red-600">
              {totalCount}
            </span>

          </div>

        </div>

        {/* Form */}
        <div className="bg-white border shadow-sm rounded-xl p-6 mb-8 space-y-4">

          {/* Type */}
          <select
            value={reportType}
            onChange={(e) => {
              setReportType(e.target.value);
              setValue("");
            }}
            className="w-full border rounded-lg px-4 py-3 bg-blue-50 text-blue-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="number">
              Phone Number
            </option>

            <option value="username">
              Username
            </option>

            <option value="bank">
              Bank Info
            </option>
          </select>

          {/* Value */}
          <input
            type="text"
            placeholder={
              reportType === "number"
                ? "Enter phone number"
                : reportType === "username"
                ? "Enter username"
                : "Enter bank details"
            }
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />

          {/* Reason */}
          <textarea
            placeholder="Enter report reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
          />

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Submit Report
          </button>

        </div>

        {/* Records */}
        <div className="space-y-4">

          {filteredData.map((item, index) => (

            <div
              key={item.id}
              className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition"
            >

              <div className="flex items-start gap-4">

                {/* Icon */}
                <div className="text-blue-600 text-xl mt-1">
                  {getTypeIcon(item.type)}
                </div>

                {/* Content */}
                <div className="flex-1 text-sm">

                  <p className="font-semibold mb-1">

                    Serial:
                    <span className="ml-2">
                      {index + 1}
                    </span>

                  </p>

                  <p>
                    <span className="font-semibold">
                      Type:
                    </span>

                    <span className="ml-2 capitalize text-blue-700">
                      {item.type}
                    </span>

                  </p>

                  <p>
                    <span className="font-semibold">
                      Reported:
                    </span>

                    <span className="ml-2">
                      {item.value}
                    </span>

                  </p>

                  <p>
                    <span className="font-semibold">
                      Reason:
                    </span>

                    <span className="ml-2 text-gray-700">
                      {item.reason}
                    </span>

                  </p>

                </div>

              </div>

            </div>

          ))}

          {filteredData.length === 0 && (

            <div className="text-center text-gray-400 mt-10 flex flex-col items-center gap-2">

              <FaExclamationTriangle className="text-2xl" />

              No scammer reports found

            </div>

          )}

        </div>

      </div>
    </div>
  );
}
