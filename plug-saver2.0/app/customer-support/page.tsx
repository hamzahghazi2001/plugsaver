"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import Link from "next/link";

export default function CustomerSupport() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const supportTopics = [
    "Connectivity Issues",
    "Energy Monitoring Inaccuracies",
    "Notifications and Alerts",
    "Firmware and Updates",
    "Account and Data Issues",
    "Statistics and Reports",
    "Rewards and Incentives",
    "Others",
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      {/* Header with gradient */}
      <div className="w-full bg-gradient-to-r from-[#FF5B7E] to-[#FF9F5A] p-6 rounded-b-[32px] shadow-lg mb-8">
        <div className="w-full max-w-4xl mx-auto flex items-center">
          <button
            onClick={() => router.push("/settings")}
            className="text-white p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          <h1 className="text-2xl font-semibold text-white text-center flex-1 -ml-9">Support</h1>
        </div>
      </div>

      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl px-6">
        <p className="text-center text-[#FF7E5F] text-xl font-medium mb-8">How can we help?</p>

        {/* Search input with icon */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search Support Topics"
            className="w-full pl-12 py-4 border border-gray-200 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Support topics list */}
        <div className="w-full bg-white rounded-2xl divide-y divide-gray-100">
          {supportTopics
            .filter((topic) => topic.toLowerCase().includes(search.toLowerCase()))
            .map((topic, index) => (
              <Link
                key={index}
                href={`/customer-support/${topic.toLowerCase().replace(/\s+/g, "-")}`}
                className="px-4 py-5 hover:bg-gray-50 cursor-pointer flex justify-between items-center transition-colors"
              >
                <span className="text-gray-800 text-base">{topic}</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
