import { useState } from "react";
import { BsShieldLock } from "react-icons/bs";
import { FaCopy, FaCheck, FaHeart } from "react-icons/fa";

export default function Support() {
  const [copied, setCopied] = useState("");

  const data = [
    {
      label: "Binance Pay ID",
      sub: "Fast & Easy",
      address: "381708407",
      qr: "https://i.ibb.co.com/x8YmSLWd/binance-payqr.jpg",
    },
    {
      label: "TRC20 USDT",
      sub: "Tron Network",
      address: "TLHTBqusNhNHpvZTQMLNbiCn8EeA7nifGJ",
    },
    {
      label: "BEP20 USDT",
      sub: "BNB Chain",
      address: "0xf8fc2579f7b8553a221cf3a8009566c16b2d5c9a",
    },
    {
      label: "Bitcoin",
      sub: "BTC Network",
      address: "1AhXJgQ8uvUE36TSyHjWKqLKzYDCSLZzgk",
    },
  ];

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(""), 1500);
  };

  return (
    <div className="min-h-screen bg-[#eef6f1] text-slate-800 px-4 py-6">

      {/* HEADER */}
      <div className="text-center mb-6">
        <div className="flex justify-center mb-3">
          <div className="bg-white p-3 rounded-full shadow">
            <FaHeart className="text-[#00bc7d] text-xl" />
          </div>
        </div>

        <h1 className="text-xl font-bold text-slate-900">
          Support Creator
        </h1>

        <p className="text-sm text-gray-500">
          Buy me a coffee or support via crypto
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto mb-5">
        <div className="bg-white rounded-xl p-3 text-center shadow-sm">
          <p className="font-bold text-lg text-[#00bc7d]">
            {data.length}
          </p>
          <p className="text-xs text-gray-500">Methods</p>
        </div>

        <div className="bg-white rounded-xl p-3 text-center shadow-sm">
          <p className="font-bold text-lg text-[#00bc7d]">
            Crypto
          </p>
          <p className="text-xs text-gray-500">Supported</p>
        </div>
      </div>

      {/* LIST */}
      <div className="max-w-md mx-auto space-y-4">
        {data.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-4 shadow-md border border-gray-100"
          >
            {/* TITLE */}
            <div className="mb-2">
              <h3 className="font-semibold text-slate-900 text-sm">
                {item.label}
              </h3>
              <p className="text-xs text-gray-500">
                {item.sub}
              </p>
            </div>

            {/* QR */}
            {item.qr && (
              <img
                src={item.qr}
                alt="qr"
                className="w-36 mx-auto mb-3 rounded-xl border"
              />
            )}

            {/* ADDRESS + COPY */}
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2 border">
              <span className="text-xs text-gray-600 truncate flex-1">
                {item.address}
              </span>

              <button
                onClick={() => copyText(item.address)}
                className={`px-3 py-2 rounded-lg text-white text-xs flex items-center gap-1 transition ${
                  copied === item.address
                    ? "bg-green-600"
                    : "bg-[#00bc7d] hover:bg-green-600"
                }`}
              >
                {copied === item.address ? <FaCheck /> : <FaCopy />}
                {copied === item.address ? "Done" : "Copy"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="text-center text-xs text-gray-400 mt-8 flex items-center justify-center gap-1">
        <BsShieldLock className="text-[#00bc7d]" />
        Secure & anonymous transactions
      </div>
    </div>
  );
}