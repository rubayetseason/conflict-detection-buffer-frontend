"use client";
import { useEffect, useState } from "react";

const BaseLoader = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3 * 1000); // 5 seconds

    return () => clearTimeout(timer); // cleanup
  }, []);

  if (!visible) return null;

  return (
    <div className="bg-gray-200 dark:bg-black flex justify-center items-center fixed top-0 left-0 w-dvw h-dvh z-50">
      <div className="scale-150 three-body">
        <div className="three-body__dot"></div>
        <div className="three-body__dot"></div>
        <div className="three-body__dot"></div>
      </div>
    </div>
  );
};

export default BaseLoader;
