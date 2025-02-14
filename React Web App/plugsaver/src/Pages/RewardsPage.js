import React, { useState, useEffect } from "react";
import "../App.css";
import PointsSection from "../Components/PointsSection";
import ProgressBar from "../Components/ProgressBar";
import FilterTabs from "../Components/FilterTabs";
import Leaderboard from "../Components/Leaderboard";
import BadgesSection from "../Components/BadgesSection";
import BottomNav from "../Components/BottomNav";
import DesktopLayout from "../Components/DesktopLayoutRP";

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

const RewardsPageMobile = ({
  leaderboardData,
  milestones,
  currentPoints,
  leaderboardType,
  setLeaderboardType,
}) => (
  <div className="rewards-container">
    <div className="rewards-card">
      <div className="rewards-header">
        <h1>Rewards</h1>
      </div>
      <PointsSection currentPoints={currentPoints} />
      <ProgressBar milestones={milestones} currentPoints={currentPoints} />
      <FilterTabs leaderboardType={leaderboardType} setLeaderboardType={setLeaderboardType} />
      <Leaderboard leaderboardData={leaderboardData} />
      <BadgesSection />
      <BottomNav isDesktop={false} />
    </div>
  </div>
);

const RewardsPageDesktop = ({
  leaderboardData,
  milestones,
  currentPoints,
  leaderboardType,
  setLeaderboardType,
}) => (
  <DesktopLayout headerContent={<h1>Rewards</h1>}>
    <div className="desktop-left">
      <PointsSection currentPoints={currentPoints} />
      <ProgressBar milestones={milestones} currentPoints={currentPoints} />
      <FilterTabs leaderboardType={leaderboardType} setLeaderboardType={setLeaderboardType} />
      <BadgesSection />
    </div>
    <div className="desktop-right">
      <Leaderboard leaderboardData={leaderboardData} />
    </div>
    <BottomNav isDesktop={true} />
  </DesktopLayout>
);

const RewardsPage = () => {
  const { width } = useViewport();
  const breakpoint = 1024;

  const [leaderboardType, setLeaderboardType] = useState("household");
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [milestones, setMilestones] = useState(defaultMilestones);
  const [currentPoints, setCurrentPoints] = useState(0);

  useEffect(() => {
    // Update the endpoint to match your backend
    fetch(`/api/rewards?leaderboardType=${leaderboardType}`)
      .then((res) => res.json())
      .then((data) => {
        setLeaderboardData(data.leaderboardData || []);
        setMilestones(
          data.milestones && data.milestones.length ? data.milestones : defaultMilestones
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
};

export default RewardsPage;
