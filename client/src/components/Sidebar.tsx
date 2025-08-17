import { useState } from "react";
import { MicIcon, Upload, Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden p-4 bg-white border-b border-gray-300">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 focus:outline-none">
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar for Desktop */}
      <div className="hidden md:flex flex-col border-r border-gray-300 bg-white w-1/6 min-h-screen">
        <div className="p-8">
          <h1 className="text-3xl text-blue-600 font-bold">Brivio</h1>
        </div>

        <nav className="flex-1 font-bold">
          <ul className="flex flex-col gap-y-6">
            <li>
              <NavLink
                to="/all"
                className={({ isActive }) =>
                  `flex items-center p-2 mx-auto w-4/5 rounded-md transition-colors ${isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"
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
                  `flex items-center p-2 mx-auto w-4/5 rounded-md transition-colors ${isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"
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

      {/* Mobile Sidebar Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-gray-500 bg-opacity-75 md:hidden">
          <div className="flex flex-col bg-white h-full w-3/4 shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl text-blue-600 font-bold">Brivio</h1>
              <button onClick={() => setIsMenuOpen(false)} className="text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 font-bold">
              <ul className="flex flex-col gap-y-4">
                <li>
                  <NavLink
                    to="/all"
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center p-3 rounded-md transition-colors ${isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"
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
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center p-3 rounded-md transition-colors ${isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"
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
        </div>
      )}
    </>
  );
}

export default Sidebar;
