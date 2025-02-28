import React from "react";

const FilterTabs = ({ leaderboardType, setLeaderboardType }) => (
  <div className="filter-tabs">
    <button
      className={`tab ${leaderboardType === "global" ? "active" : ""}`}
      onClick={() => setLeaderboardType("global")}
    >
      Global
    </button>
    <button
      className={`tab ${leaderboardType === "local" ? "active" : ""}`}
      onClick={() => setLeaderboardType("local")}
    >
      Local
    </button>
    <button
      className={`tab ${leaderboardType === "household" ? "active" : ""}`}
      onClick={() => setLeaderboardType("household")}
    >
      Household
    </button>
  </div>
);

export default FilterTabs;
