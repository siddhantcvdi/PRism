import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";

// Helper to style importance levels
const getImportanceColor = (importance) => {
  switch (importance) {
    case 1:
      return "#f25858"; // Red
    case 2:
      return "#f5a623"; // Orange
    case 3:
      return "#f7e500"; // Yellow
    case 4:
      return "#4caf50"; // Green
    case 5:
      return "#0d47a1"; // Blue
    default:
      return "#cfd1e2"; // Neutral Gray
  }
};

const PRCard = ({
  title,
  prNumber,
  additions,
  deletions,
  commits,
  changedFiles,
  diffSummary,
  importance, // new prop
}) => {
  console.log(importance);
  
  const [expanded, setExpanded] = useState(false);
  const toggle = () => setExpanded((v) => !v);

  return (
    <div
      onClick={toggle}
      className="
        bg-[#303350] 
        border border-gray-800 
        rounded-lg 
        px-4 py-3 
        mx-4 
        shadow-sm 
        cursor-pointer 
        hover:bg-[#2e2f44] 
        transition-colors 
        duration-200
      "
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-base font-medium text-[#fafafc]">{title}</h3>
          <span className="bg-gray-100 border border-gray-200 rounded-full px-3 py-0.5 text-xs text-gray-600">
            #{prNumber}
          </span>
        </div>
        <motion.div
          className="text-white"
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {expanded ? <FaChevronUp /> : <FaChevronDown />}
        </motion.div>
      </div>

      {/* Stats Row */}
      <div className="flex gap-4 flex-wrap mb-2">
        {[
          { label: "Additions", value: `+${additions}`, color: "#58f258" },
          { label: "Deletions", value: `-${deletions}`, color: "#f25858" },
          { label: "Commits", value: commits, color: "#fafafc" },
          { label: "Changed Files", value: changedFiles, color: "#fafafc" },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex flex-col gap-1">
            <span className="text-xs text-[#cfd1e2]">{label}</span>
            <span className="text-sm font-semibold" style={{ color }}>
              {value}
            </span>
          </div>
        ))}

        {/* Importance Bars */}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-[#cfd1e2]">Importance</span>
          <div className="flex gap-1 items-end h-5">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className="w-1 rounded-sm"
                style={{
                  height: "80%",
                  backgroundColor:
                    level <= importance
                      ? getImportanceColor(importance)
                      : "#4a4c6a",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Expandable Summary */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: expanded ? 1 : 0,
          height: expanded ? "auto" : 0,
        }}
        transition={{ duration: 0.4 }}
        style={{ overflow: "hidden" }}
      >
        {expanded && (
          <div className="mt-4 prose prose-invert max-w-none border-t border-gray-700 pt-3">
            <ReactMarkdown>
              {diffSummary?.replace(/PR_IMPORTANCE:\d+/, "").trim() || "No summary available."}
            </ReactMarkdown>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PRCard;
