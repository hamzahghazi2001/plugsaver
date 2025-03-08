import React from "react";

const Leaderboard = ({ leaderboardData }) => (
  <div className="leaderboard">
    <h2>Leaderboard</h2>
    {leaderboardData.map((item) => (
      <div
        key={item.rank}
        className={`leaderboard-item ${item.user === "You" ? "current-user" : ""}`}
      >
        <span>{item.rank}</span>
        <div className="user-avatar" />
        <span>{item.user}</span>
        <span>{item.points}</span>
      </div>
    ))}
  </div>
);

export default Leaderboard;
