import { useState } from "react";
import { Link } from "react-router-dom";
import {
 
  DropdownMenuItem,
} from "../UI/DropDownMenu";
import { Button } from "../UI";

export function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <Button variant="outline" onClick={() => setIsOpen(!isOpen)}>
        👤
      </Button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-40 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <DropdownMenuItem>
                
              <Link to="/userprofile" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                User Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (window.confirm("Are you sure you want to logout?")) {
                  localStorage.clear();
                  window.location.href = "/login";
                }
              }}
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              Logout
            </DropdownMenuItem>
          </div>
        </div>
      )}
    </div>
  );
}
