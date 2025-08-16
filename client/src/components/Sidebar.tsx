import { MicIcon, Upload } from "lucide-react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-300 bg-white w-1/6">
      <h1 className="m-8 text-3xl text-blue-600 font-bold">Brivio</h1>

      <nav className="flex-1">
        <ul className="m-8 flex flex-col gap-y-4">
          <li>
            <NavLink
              to="/all"
              className={({ isActive }) =>
                `flex items-center p-2 w-3/4 rounded-md transition-colors ${isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <MicIcon className="mr-2 w-5 h-5" />
              All Recordings
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/new"
              className={({ isActive }) =>
                `flex items-center p-2 w-3/4 rounded-md transition-colors ${isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <Upload className="mr-2 w-5 h-5" />
              New Recording
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
