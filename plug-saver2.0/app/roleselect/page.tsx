"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// List of all countries
const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
  "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Côte d'Ivoire", "Cabo Verde",
  "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)",
  "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini (fmr. Swaziland)", "Ethiopia", "Fiji", "Finland",
  "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Holy See", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica",
  "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia",
  "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands",
  "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (formerly Burma)",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
  "Oman", "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
  "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands",
  "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela",
  "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

export default function RoleSelectionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email"); // Get email from query params
  const [selectedRole, setSelectedRole] = useState<"manager" | "member" | null>(null);
  const [householdCode, setHouseholdCode] = useState("");
  const [isRoleConfirmed, setIsRoleConfirmed] = useState(false);
  const [isProfileSetup, setIsProfileSetup] = useState(false); // New state for profile setup
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [user, setUser] = useState<{ avatar: string | null }>({ avatar: null });
  const [username, setUsername] = useState("Username");
  const [country, setCountry] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(""); // New state for date of birth

  // Redirect if email is missing
  useEffect(() => {
    if (!email) {
      alert("Email not found. Please complete registration.");
      router.push("/register");
    }
  }, [email, router]);

  useEffect(() => {
    const fetchHouseholdCode = async () => {
      try {
        const storedHouseholdCode = localStorage.getItem("household_code");
        if (!storedHouseholdCode && email) {
          const response = await fetch(`/api/auth/get_household_code?email=${encodeURIComponent(email)}`);
          const data = await response.json();
  
          if (data.success) {
            localStorage.setItem("household_code", data.household_code);
            setHouseholdCode(data.household_code); // Update state
          } else {
            console.error("Failed to fetch household code:", data.message);
          }
        }
      } catch (error) {
        console.error("Error fetching household code:", error);
      }
    };
  
    fetchHouseholdCode();
  }, [email]);

  const generateHouseholdCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 7; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setHouseholdCode(code);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(householdCode);
    alert("Code copied to clipboard!");
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (/^[A-Za-z0-9]{7}$/.test(text)) {
        setHouseholdCode(text);
      } else {
        alert("Invalid code! Please ensure it's a 7-digit/letter code.");
      }
    } catch (err) {
      alert("Failed to read from clipboard. Please paste manually.");
    }
  };

  const handleContinueClick = async () => {
    if (!email) {
      alert("Email not found. Please try again.");
      return;
    }

    if (selectedRole === "manager" && householdCode) {
      try {
        const response = await fetch("/api/auth/create_household", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, household_code: householdCode }),
        });

        const data = await response.json();

        if (data.success) {
          localStorage.setItem("household_code", householdCode); 
          setIsProfileSetup(true); // Move to profile setup
        } else {
          alert(data.message || "Failed to create household.");
        }
      } catch (err) {
        alert("An error occurred. Please try again.");
      }
    } else if (selectedRole === "member" && householdCode) {
      try {
        const response = await fetch("/api/auth/join_household", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, household_code: householdCode }),
        });

        const data = await response.json();

        if (data.success) {
          localStorage.setItem("household_code", householdCode);
          setIsProfileSetup(true); // Move to profile setup
        } else {
          alert(data.message || "Failed to join household.");
        }
      } catch (err) {
        alert("An error occurred. Please try again.");
      }
    } else {
      alert("Please complete the required steps.");
    }
  };

  const handleConfirmRole = () => {
    if (selectedRole) {
      setIsRoleConfirmed(true);
    }
  };

  const handleBackToRoleSelection = () => {
    setIsRoleConfirmed(false);
    setIsProfileSetup(false); // Reset profile setup
    setSelectedRole(null);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      alert("No file selected.");
      return;
    }
  
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("User ID not found. Please log in again.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", userId); // Ensure user_id is sent as a form field
  
    try {
      const response = await fetch("/api/auth/profile_pic", {
        method: "POST",
        body: formData,
      });
  
      const result = await response.json();
      console.log("POST Response:", result);
  
      if (!result.success) {
        throw new Error(result.message);
      }
  
      // Update the local state with the new avatar URL
      setUser((prev) => ({ ...prev, avatar: result.avatar_url }));
      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("An error occurred while uploading the avatar.");
    }
  };

  useEffect(() => {
    const fetchProfilePicture = async () => {
      const userId = localStorage.getItem("user_id");
      if (!userId) return;
  
      try {
        const response = await fetch(`/api/auth/profile_pic?user_id=${encodeURIComponent(userId)}`);
        const result = await response.json();
  
        if (result.success && result.avatar_url) {
          // Update the local state with the fetched avatar URL
          setUser((prev) => ({ ...prev, avatar: result.avatar_url }));
  
          // Debug: Log the fetched avatar URL
          console.log("Fetched Avatar URL:", result.avatar_url);
        } else {
          console.error("Error fetching profile picture:", result);
        }
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    };
  
    fetchProfilePicture();
  }, []);

  const handleConfirmProfile = async () => {
    try {
      const response = await fetch("/api/auth/setup_profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: localStorage.getItem("user_id"), // Assuming you store user_id in localStorage
          username,
          date_of_birth: dateOfBirth,
          country,
        }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        // Store the profile information in localStorage
        localStorage.setItem("username", username);
        localStorage.setItem("date_of_birth", dateOfBirth);
        localStorage.setItem("country", country);
  
        // Redirect to the next page
        router.push("/devices");
      } else {
        alert(data.message || "Failed to setup profile.");
      }
    } catch (err) {
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center p-4"
      style={{
        background: "linear-gradient(to top, #4ADE80, #22D3EE, #3B82F6)",
        fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* Progress Bar Container */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          {/* Progress Step 1 */}
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
              ✓
            </div>
            <div className="text-sm text-gray-600 mt-2">Sign Up</div>
          </div>

          {/* Progress Step 2 */}
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                selectedRole ? "bg-blue-600" : isRoleConfirmed ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              {isRoleConfirmed ? "✓" : "2"}
            </div>
            <div className="text-sm text-gray-600 mt-2">Role</div>
          </div>

          {/* Progress Step 3 */}
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                householdCode ? "bg-blue-600" : isProfileSetup ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              {isProfileSetup ? "✓" : "3"}
            </div>
            <div className="text-sm text-gray-600 mt-2">Household</div>
          </div>

          {/* Progress Step 4 */}
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                isProfileSetup ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              {isProfileSetup ? "✓" : "4"}
            </div>
            <div className="text-sm text-gray-600 mt-2">Profile</div>
          </div>
        </div>
      </div>

      {/* Dynamic Content */}
      <div className="flex-1 flex items-center justify-center w-full">
        {!isRoleConfirmed ? (
          // Role Selection Card
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Select Your Role</h1>

            {/* Role Selection Cards */}
            <div className="flex flex-col md:flex-row justify-between gap-6">
              {/* Manager Role Card */}
              <div
                className={`flex-1 p-6 rounded-lg shadow-md cursor-pointer transition-all duration-200 ${
                  selectedRole === "manager"
                    ? "bg-blue-600"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
                onClick={() => setSelectedRole("manager")}
              >
                <img
                  src="https://via.placeholder.com/150" // Replace with your external manager image URL
                  alt="Manager Role"
                  className="w-20 h-20 mx-auto mb-4 rounded-lg object-cover"
                />
                <div
                  className={`text-lg font-bold ${
                    selectedRole === "manager" ? "text-white" : "text-gray-800"
                  }`}
                >
                  Manager
                </div>
              </div>

              {/* Member Role Card */}
              <div
                className={`flex-1 p-6 rounded-lg shadow-md cursor-pointer transition-all duration-200 ${
                  selectedRole === "member"
                    ? "bg-blue-600"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
                onClick={() => setSelectedRole("member")}
              >
                <img
                  src="https://via.placeholder.com/150" // Replace with your external member image URL
                  alt="Member Role"
                  className="w-20 h-20 mx-auto mb-4 rounded-lg object-cover"
                />
                <div
                  className={`text-lg font-bold ${
                    selectedRole === "member" ? "text-white" : "text-gray-800"
                  }`}
                >
                  Member
                </div>
              </div>
            </div>

            {/* Confirm Button */}
            <button
              className={`w-full mt-8 py-3 rounded-lg text-white font-bold transition-all duration-200 ${
                selectedRole ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
              }`}
              onClick={handleConfirmRole}
              disabled={!selectedRole || loading}
            >
              {loading ? "Loading..." : "Confirm"}
            </button>
          </div>
        ) : selectedRole === "manager" && !isProfileSetup ? (
          // Household Manager Card
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl text-center relative">
            {/* Back Button */}
            <button
              className="absolute top-4 left-4 text-gray-600 hover:text-gray-800"
              onClick={handleBackToRoleSelection}
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Household</h1>

            {/* House Emoji/Image */}
            <img
              src="https://via.placeholder.com/150" // Replace with your external house image URL
              alt="House"
              className="w-20 h-20 mx-auto mb-6 rounded-lg object-cover"
            />

            {/* Generate Code Button */}
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200"
              onClick={generateHouseholdCode}
            >
              Generate Household Code
            </button>

            {/* Household Code and Copy Button */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <input
                type="text"
                placeholder="Household Code"
                value={householdCode}
                readOnly
                className="w-40 p-2 border border-gray-300 rounded-lg text-center"
              />
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200"
                onClick={copyToClipboard}
              >
                Copy
              </button>
            </div>

            {/* Continue Button */}
            <button
              className={`w-full mt-6 py-3 rounded-lg text-white font-bold transition-all duration-200 ${
                householdCode ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
              }`}
              onClick={handleContinueClick}
              disabled={!householdCode || loading}
            >
              {loading ? "Loading..." : "Continue"}
            </button>
          </div>
        ) : selectedRole === "member" && !isProfileSetup ? (
          // Household Member Card
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl text-center relative">
            {/* Back Button */}
            <button
              className="absolute top-4 left-4 text-gray-600 hover:text-gray-800"
              onClick={handleBackToRoleSelection}
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            <h1 className="text-2xl font-bold text-gray-800 mb-6">Join Household</h1>

            {/* House Emoji/Image */}
            <img
              src="https://via.placeholder.com/150" // Replace with your external house image URL
              alt="House"
              className="w-20 h-20 mx-auto mb-6 rounded-lg object-cover"
            />

            {/* Household Code Input and Paste Button */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <input
                type="text"
                placeholder="Enter Household Code"
                value={householdCode}
                onChange={(e) => setHouseholdCode(e.target.value)}
                className="w-48 p-2 border border-gray-300 rounded-lg text-center"
                maxLength={7}
              />
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200"
                onClick={handlePaste}
              >
                Paste
              </button>
            </div>

            {/* Continue Button */}
            <button
              className={`w-full mt-6 py-3 rounded-lg text-white font-bold transition-all duration-200 ${
                householdCode ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
              }`}
              onClick={handleContinueClick}
              disabled={!householdCode || loading}
            >
              {loading ? "Loading..." : "Continue"}
            </button>
          </div>
        ) : (
          // Profile Setup Card (for both manager and member)
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl text-center relative">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile Setup</h1>

            {/* Profile Picture */}
            <div className="flex flex-col items-center gap-4 mb-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src= {`${user.avatar}`}  />
                <AvatarFallback>{username[0]}</AvatarFallback>
              </Avatar>

              <label
                htmlFor="avatar-upload"
                className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                <span>Upload Photo</span>
                <Input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </label>
            </div>

            {/* Username */}
            <div className="space-y-2 mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Email (Read-only) */}
            <div className="space-y-2 mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                id="email"
                value={email || ""}
                readOnly
                className="w-full bg-gray-100"
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2 mb-4">
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <Input
                id="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Country Selection */}
            <div className="space-y-2 mb-6">
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {countries.map((countryName) => (
                    <SelectItem key={countryName} value={countryName}>
                      {countryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Confirm Button */}
            <Button
              className="w-full mt-6 py-3 rounded-lg text-white font-bold transition-all duration-200 bg-blue-600 hover:bg-blue-700"
              onClick={handleConfirmProfile}
            >
              Confirm
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}