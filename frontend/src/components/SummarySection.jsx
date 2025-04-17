import React from "react";
import { UserButton } from "@clerk/clerk-react";
import { GrSync } from "react-icons/gr";
import usePRStore from "../../store/prdata.store";
import PRCard from "./PRCard";

const SummarySection = () => {
  const { PRList } = usePRStore();

  // Helper to extract importance from summary
  const extractImportance = (summary) => {
    const match = summary?.match(/PR_IMPORTANCE:(\d)/);
    return match ? parseInt(match[1]) : 1;
  };

  return (
    <div className="w-full h-screen bg-[#1d1e30] p-3">
      <div className="w-full h-full bg-[#131420] rounded-xl flex flex-col">
        {/* Header */}
        <div className="flex justify-end py-4 px-6">
          <div className="flex gap-4 items-center">
            <GrSync className="text-white cursor-pointer" />
            <UserButton />
          </div>
        </div>

        {/* PR Cards */}
        <div className="text-white p-5 w-full flex-1 overflow-auto space-y-6">
          {PRList && PRList.length > 0 ? (
            PRList.map((pr, index) => (
              <PRCard
                key={index}
                title={pr.title}
                prNumber={pr.prNumber}
                additions={pr.additions}
                deletions={pr.deletions}
                commits={pr.commits}
                changedFiles={pr.changedFiles}
                diffSummary={pr.diffSummary}
                importance={extractImportance(pr.diffSummary)}
              />
            ))
          ) : (
            <p className="text-gray-400">No PR summaries available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummarySection;
