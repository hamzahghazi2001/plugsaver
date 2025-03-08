"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";

const supportDetails = {
  "connectivity-issues": "Connectivity Issues",
  "energy-monitoring-inaccuracies": "Energy Monitoring Inaccuracies",
  "notifications-and-alerts": "Notifications and Alerts",
  "firmware-and-updates": "Firmware and Updates",
  "account-and-data-issues": "Account and Data Issues",
  "statistics-and-reports": "Statistics and Reports",
  "rewards-and-incentives": "Rewards and Incentives",
  "others": "Other Issues",
};

export default function SupportTopicPage({ params }: { params: { topic: string } }) {
  const router = useRouter();
  const topicTitle = supportDetails[params.topic as keyof typeof supportDetails] || "Support";
  const [issue, setIssue] = useState("");

  const handleSubmit = () => {
    if (issue.trim().length === 0) {
      alert("Please describe your issue before submitting.");
      return;
    }
    router.push("/ticket-submitted");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      {/* Header with gradient */}
      <div className="w-full bg-gradient-to-r from-[#FF5B7E] to-[#FF9F5A] p-6 rounded-b-[32px] shadow-lg mb-8">
        <div className="w-full max-w-4xl mx-auto flex items-center">
          <button
            onClick={() => {
              try {
                router.push("/customer-support");
              } catch {
                window.location.href = "/customer-support";
              }
            }}
            className="text-white p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          <h1 className="text-2xl font-semibold text-white text-center flex-1 -ml-9">Support</h1>
        </div>
      </div>

      <div className="w-full max-w-md md:max-w-lg lg-max-w-xl px-6 text-center">
        <h2 className="text-[#FF7E5F] text-2xl font-medium mb-2">{topicTitle}</h2>
        <p className="text-gray-600 mb-6">Describe Your Issue</p>

        {/* Issue description textarea */}
        <textarea
          className="w-full h-40 border border-gray-300 rounded-lg p-4 text-gray-800 focus:ring-2 focus:ring-[#FF7E5F]"
          placeholder="Maximum 150 Words"
          maxLength={150}
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
        />

        {/* Submit Ticket Button */}
        <button
          className="mt-6 px-6 py-3 bg-[#FF007F] text-white font-medium rounded-full shadow-lg hover:bg-[#E60073] transition"
          onClick={handleSubmit}
        >
          Submit Ticket
        </button>
      </div>
    </div>
  );
}
