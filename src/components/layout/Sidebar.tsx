"use client";

import React, { useState } from "react";

import { RxHamburgerMenu } from "react-icons/rx";

import { v4 as uuidv4 } from "uuid";

const dummyTitles: Titles = [
  { id: uuidv4(), title: "Welcome to the Chat!" },
  { id: uuidv4(), title: "Getting Started" },
  { id: uuidv4(), title: "Tips and Tricks" },
  { id: uuidv4(), title: "Frequently Asked Questions" },
  { id: uuidv4(), title: "User Guide" },
  { id: uuidv4(), title: "Contact Support" },
  { id: uuidv4(), title: "Community Guidelines" },
  { id: uuidv4(), title: "Feature Updates" },
  { id: uuidv4(), title: "Feedback and Suggestions" },
  { id: uuidv4(), title: "Privacy Policy" },
];

export default function Sidebar() {
  const [isExtended, setIsExtended] = useState<boolean>(true);

  const width = isExtended ? `w-80` : "w-16";

  const sidebarToggleHandler = () => {
    setIsExtended((prev) => !prev);
  };

  return (
    <aside
      className={`${width} bg-[#272626] p-4 h-full flex-shrink-0 transition-all duration-300 ease-in-out`}
    >
      <div className="flex flex-col space-y-4 border-b-2 border-white w-full h-10">
        <button onClick={sidebarToggleHandler}>
          <RxHamburgerMenu size={24} />
        </button>
        {/* Chat history items will go here */}
      </div>
    </aside>
  );
}
