interface SidebarProps {
  onNavigate: (
    view: "add" | "dashboard" | "applications" | "cv" | "kanban" | "contacts"
    ) => void
}

function Sidebar({
    onNavigate,
}: SidebarProps) {
    return (
        <aside className="sidebar">
            <h2 className="sidebar-logo">
                JobTrack
            </h2>

            <button
                type="button"
                className="sidebar-add-button"
                onClick={() => onNavigate("add")}
            >
                Add application
            </button>

            <nav className="sidebar-nav">
                <button 
                    type="button"
                    className="sidebar-nav-button"
                    onClick={() => onNavigate("dashboard")}
                >
                    Dashboard
                </button>

                <button 
                    type="button"
                    className="sidebar-nav-button"
                    onClick={() => onNavigate("applications")}
                >
                    Applications
                </button>

                <button 
                    type="button"
                    className="sidebar-nav-button"
                    onClick={() => onNavigate("cv")}
                >
                    CV / Resume
                </button>

                <button 
                    type="button"
                    className="sidebar-nav-button"
                    onClick={() => onNavigate("kanban")}
                >
                    Kanban
                </button>

                <button 
                    type="button"
                    className="sidebar-nav-button"
                    onClick={() => onNavigate("contacts")}
                >
                    Contacts
                </button>            
                
            </nav>

            <div className="sidebar-bottom">
                <button type="button">
                    Settings
                </button>
            </div>
            
            <button type="button">
                Log out
            </button>
        </aside>
    )
}

export default Sidebar;