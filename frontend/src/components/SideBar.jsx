import useAuth from "../context/useAuth";
import { NavLink } from "react-router-dom";

function Sidebar(){
    const { user, isAuthenticated, login, logout } = useAuth();

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="sidebar-logo-icon">✉</div>
                <div className="sidebar-brand-title">OctoMail</div>
            </div>

            <nav className="sidebar-nav">
                <NavLink 
                    to="/" 
                    className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                    end
                >
                    <span>📊</span>
                    <span>Dashboard</span>
                </NavLink>

                <NavLink 
                    to="/emails" 
                    className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                >
                    <span>📬</span>
                    <span>Emails</span>
                </NavLink>

                <NavLink 
                    to="/copilot" 
                    className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                >
                    <span>🤖</span>
                    <span>AI Copilot</span>
                </NavLink>

                <NavLink 
                    to="/notification" 
                    className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                >
                    <span>📈</span>
                    <span>Analytics</span>
                </NavLink>
            </nav>

            <div className="sidebar-user">
                <span className="sidebar-user-badge">
                    {isAuthenticated ? "Signed In" : "Guest Mode"}
                </span>

                {isAuthenticated ? (
                    <>
                        <div className="sidebar-user-name">{user?.name || "User"}</div>
                        <div className="sidebar-user-email">{user?.email || ""}</div>
                        <button className="sidebar-auth-btn" onClick={logout}>Sign Out</button>
                    </>
                ) : (
                    <>
                        <div className="sidebar-user-name">Demo User</div>
                        <div className="sidebar-user-email">guest@octomail.ai</div>
                        <button className="sidebar-auth-btn login-btn" onClick={login}>
                            Sign In with Google
                        </button>
                    </>
                )}
            </div>
        </aside>
    );
}

export default Sidebar;
