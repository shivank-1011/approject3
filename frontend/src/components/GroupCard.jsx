import React from "react";
import { useNavigate } from "react-router-dom";

export default function GroupCard({ group }) {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleCardClick = () => {
    navigate(`/groups/${group.id}`);
  };

  return (
    <div className="group-card" onClick={handleCardClick}>
      <div className="group-card-header">
        <h3 className="group-name">{group.name}</h3>
        <span className="member-count">
          {group._count?.members || group.members?.length || 0} members
        </span>
      </div>
      
      <div className="group-card-body">
        <div className="group-info">
          <span className="info-label">Created by:</span>
          <span className="info-value">
            {group.createdByUser?.name || "Unknown"}
          </span>
        </div>
        
        <div className="group-info">
          <span className="info-label">Created on:</span>
          <span className="info-value">{formatDate(group.createdAt)}</span>
        </div>
      </div>
      
      <div className="group-card-footer">
        <button className="btn-view" onClick={handleCardClick}>
          View Details
        </button>
      </div>
    </div>
  );
}