import React from "react";

const PRCard = ({
  title,
  prNumber,
  additions,
  deletions,
  commits,
  changedFiles,
}) => {
  return (
    <div className="bg-[#303350] border border-gray-800 rounded-lg px-4 py-3 mx-4  shadow-sm">
      <div className="items-center  mb-4">
        <h3 className="text-base font-medium text-[#fafafc] flex-grow pr-4 inline-block">
          {title}
        </h3>
        <span className="bg-gray-100 border border-gray-200 rounded-full px-3 py-0.5 text-xs text-gray-600">
          #{prNumber}
        </span>
      </div>

      <div className="flex gap-4 flex-wrap">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-[#cfd1e2]">Additions</span>
          <span className="text-sm font-semibold text-[#58f258]">
            +{additions}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-[#cfd1e2]">Deletions</span>
          <span className="text-sm font-semibold text-[#f25858]">
            -{deletions}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-[#cfd1e2]">Commits</span>
          <span className="text-sm font-semibold text-[#fafafc]">
            {commits}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-[#cfd1e2]">Changed Files</span>
          <span className="text-sm font-semibold text-[#fafafc]">
            {changedFiles}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PRCard;
