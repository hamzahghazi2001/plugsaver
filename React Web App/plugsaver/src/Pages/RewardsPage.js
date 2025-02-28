"use client";

import React, { useState, useEffect } from "react";
import "../App.css"; // Where we'll place the matching CSS
import PointsSection from "../Components/PointsSection";
import ProgressBar from "../Components/ProgressBar";
import FilterTabs from "../Components/FilterTabs";
import Leaderboard from "../Components/Leaderboard";
import BadgesSection from "../Components/BadgesSection";
import BottomNav from "../Components/BottomNav";

// Hook to track window width
const useViewport = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleWindowResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);
  return { width };
};

const defaultMilestones = [25, 50, 100, 300, 500];

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   1) MOBILE REWARDS LAYOUT
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
const RewardsPageMobile = ({
  leaderboardData,
  milestones,
  currentPoints,
  leaderboardType,
  setLeaderboardType,
}) => {
  return (
    <div className="rewards-management-mobile">
      {/* Large rounded gradient header */}
      <div className="rewards-mobile-header">
        <h1>Rewards</h1>
        <p>Track your progress and earn badges</p>
      </div>

      {/* White card, pulled up under header, with bottom padding */}
      <div className="rewards-mobile-content">
        <PointsSection currentPoints={currentPoints} />
        <ProgressBar milestones={milestones} currentPoints={currentPoints} />
        <FilterTabs
          leaderboardType={leaderboardType}
          setLeaderboardType={setLeaderboardType}
        />
        <Leaderboard leaderboardData={leaderboardData} />
        <BadgesSection />
      </div>

      {/* Pinned bottom nav */}
      <BottomNav isDesktop={false} />
    </div>
  );
};

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   2) DESKTOP REWARDS LAYOUT
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   Similar gradient header, large bottom corners, 
   but a 2-column white card underneath.
*/
const RewardsPageDesktop = ({
  leaderboardData,
  milestones,
  currentPoints,
  leaderboardType,
  setLeaderboardType,
}) => {
  return (
    <div className="rewards-management-desktop">
      {/* Large rounded gradient header (same style as mobile) */}
      <div className="rewards-desktop-header">
        <h1>Rewards</h1>
        <p>Track your progress and earn badges</p>
      </div>

      {/* White card with negative margin + bottom padding, 2 columns inside */}
      <div className="rewards-desktop-content">
        <div className="desktop-left">
          <PointsSection currentPoints={currentPoints} />
          <ProgressBar milestones={milestones} currentPoints={currentPoints} />
          <FilterTabs
            leaderboardType={leaderboardType}
            setLeaderboardType={setLeaderboardType}
          />
          <BadgesSection />
        </div>
        <div className="desktop-right">
          <Leaderboard leaderboardData={leaderboardData} />
        </div>
      </div>

      {/* Pinned bottom nav */}
      <BottomNav isDesktop={true} />
    </div>
  );
};

export default function RewardsPage() {
  const { width } = useViewport();
  const breakpoint = 1024;

  const [leaderboardType, setLeaderboardType] = useState("household");
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [milestones, setMilestones] = useState(defaultMilestones);
  const [currentPoints, setCurrentPoints] = useState(0);

  useEffect(() => {
    fetch(`/api/rewards?leaderboardType=${leaderboardType}`)
      .then((res) => res.json())
      .then((data) => {
        setLeaderboardData(data.leaderboardData || []);
        setMilestones(
          data.milestones && data.milestones.length
            ? data.milestones
            : defaultMilestones
        );
        setCurrentPoints(data.currentPoints || 0);
      })
      .catch((err) => {
        console.error("Error fetching rewards data", err);
        setLeaderboardData([]);
        setMilestones(defaultMilestones);
        setCurrentPoints(0);
      });
  }, [leaderboardType]);

  // Switch between mobile vs. desktop layout
  return width >= breakpoint ? (
    <RewardsPageDesktop
      leaderboardData={leaderboardData}
      milestones={milestones}
      currentPoints={currentPoints}
      leaderboardType={leaderboardType}
      setLeaderboardType={setLeaderboardType}
    />
  ) : (
    <RewardsPageMobile
      leaderboardData={leaderboardData}
      milestones={milestones}
      currentPoints={currentPoints}
      leaderboardType={leaderboardType}
      setLeaderboardType={setLeaderboardType}
    />
  );
}
