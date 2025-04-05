import { UserButton } from "@clerk/clerk-react";
import React from "react";
import PRCard from "./PRCard";
import { GrSync } from "react-icons/gr";

const SummarySection = () => {
  return (
    <div className="w-full h-screen bg-[#1d1e30] p-3">
      <div className="w-full h-full bg-[#131420] rounded-xl">
        <div className="flex w-full py-4 px-6 justify-end">
          <div className="flex gap-4 justify-center items-center">
            <GrSync className="text-white cursor-pointer" />
            <UserButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummarySection;
