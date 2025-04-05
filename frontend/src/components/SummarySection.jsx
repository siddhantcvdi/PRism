import { UserButton } from "@clerk/clerk-react";
import React from "react";
import PRCard from "./PRCard";

const SummarySection = () => {
  return (
    <div className="w-full h-screen bg-[#1d1e30] p-3">
      <div className="w-full h-full bg-[#131420] rounded-xl">
        <div className="flex w-full py-4 px-6 justify-end">
          <UserButton />
        </div>
      </div>
    </div>
  );
};

export default SummarySection;
