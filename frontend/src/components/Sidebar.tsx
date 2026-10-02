function Sidebar() {
    return (
        <aside className="sidebar">
            <h2 className="sidebar-logo">
                JobTrack
            </h2>

            <button
            type="button"
            className="sidebar-add-button"
            >
                + Add application
            </button>

            <nav className="sidebar-nav">
                <button 
                    type="button"
                    className="sidebar-nav-button"
                >
                    Dashboard
                </button>

                <button 
                    type="button"
                    className="sidebar-nav-button"
                >
                    Applications
                </button>

                <button 
                    type="button"
                    className="sidebar-nav-button"
                >
                    Kanban
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