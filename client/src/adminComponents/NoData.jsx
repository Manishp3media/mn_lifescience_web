import React from 'react';
import { Inbox } from 'lucide-react';

const NoData = ({ name }) => {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-[400px] bg-gray-50">
      <div className="flex flex-col items-center justify-center p-8 space-y-6 text-center bg-white rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-100 rounded-full opacity-70 animate-ping"></div>
          <Inbox className="relative w-24 h-24 text-blue-500 animate-bounce" />
        </div>
        <span className="text-3xl font-bold text-gray-800 transition-colors duration-300 ease-in-out hover:text-blue-600">
          No {name} Found
        </span>
        <p className="text-lg text-gray-600 max-w-md">
          It looks like there are currently no {name.toLowerCase()} to display.
        </p>
        <button className="px-6 py-2 text-white bg-blue-500 rounded-full hover:bg-blue-600 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          Refresh
        </button>
      </div>
    </div>
  );
};

export default NoData;