"use client";

import { useRouter } from "next/navigation";

export default function TicketSubmittedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      {/* Header with gradient */}
      <div className="w-full bg-gradient-to-r from-[#FF5B7E] to-[#FF9F5A] p-8 rounded-b-[32px] shadow-lg text-center">
        <h1 className="text-3xl font-semibold text-white">Support</h1>
      </div>

      <div className="w-full max-w-md md:max-w-lg lg-max-w-xl px-6 text-center flex flex-col justify-center flex-grow">
        <p className="text-gray-800 text-3xl font-bold mb-12">
          Your ticket has been submitted to the support team.
        </p>

        {/* Done Button - Now only navigates to Customer Support */}
        <button
          className="px-6 py-3 bg-[#FF007F] text-white font-medium rounded-full shadow-lg hover:bg-[#E60073] transition"
          onClick={() => router.replace("/customer-support")} // ✅ Now stays in Customer Support
        >
          Done
        </button>
      </div>
    </div>
  );
}
