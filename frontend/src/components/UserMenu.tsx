import { useState } from "react"

import type { User } from "../types/auth"


interface UserMenuProps {
  user: User
  onLogout: () => void
}


function UserMenu({
  user,
  onLogout
}: UserMenuProps) {

  const [isOpen, setIsOpen] = useState(false)

  const initials =
    `${user.first_name?.charAt(0) ?? ""}${user.last_name?.charAt(0) ?? ""}`
      .toUpperCase()

  return (
    <div className="user-menu">

      <button
        type="button"
        className="user-menu-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {initials || "NN"}
      </button>


      {isOpen && (
        <div className="user-menu-dropdown">

          <button
            type="button"
            onClick={() => {
              // Settings will be added later
              setIsOpen(false)
            }}
            
          >
            Settings
          </button>

          <button
            type="button"
            onClick={onLogout}
          >
            Log out
          </button>

        </div>
      )}

    </div>
  )
}


export default UserMenu