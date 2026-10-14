import { useEffect } from "react";
import NotificationCard from "../components/NotificationCard";
import StatCard from "../components/StatCard";
import DigestCard from "../components/DigestCard";
import EmailCard from "../components/EmailCard";
import { useNavigate } from "react-router-dom";
import useDigest from "../hooks/useDigest";
import useNotifications from "../hooks/useNotifications";
import useEmails from "../hooks/useEmails";

function DashboardPage(){
    useEffect(()=>{
        console.log("Dashboard Loaded");
    },[]);

    const navigate = useNavigate();
    const { digest } = useDigest();
    const { notifications } = useNotifications();
    const { emails } = useEmails();

    const totalEmails = emails.length;
    const unreadNotification = notifications.filter(notification => !notification.read).length;
    const highPriorityEmails = emails.filter(email => email.priority === "High").length;
    const pendingTasks = emails.reduce((total, email) => total + (email.tasks?.length || 0), 0);
    
    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Dashboard</h1>
                <p className="page-subtitle">Overview of your inbox, pending actions, and AI daily briefings</p>
            </div>

            {digest && <DigestCard digest={digest} />}

            <h2 className="section-title">📊 Key Metrics</h2>
            <div className="stat-grid">
                <StatCard title="Total Emails" value={totalEmails} />
                <StatCard title="Unread Notifications" value={unreadNotification} />
                <StatCard title="High Priority" value={highPriorityEmails} />
                <StatCard title="Pending Tasks" value={pendingTasks} />
            </div>

            {notifications.length > 0 && (
                <>
                    <h2 className="section-title">🔔 Recent Alerts</h2>
                    <div className="cards-list">
                        {notifications.slice(0, 3).map(notification => (
                            <NotificationCard key={notification._id} {...notification} />
                        ))}
                    </div>
                </>
            )}

            <h2 className="section-title">📬 Latest Processed Emails</h2>
            <div className="cards-list">
                {emails.slice(0, 5).map(email => (
                    <EmailCard 
                        key={email._id} 
                        email={email} 
                        onclick={() => navigate(`/emails/${email._id}`)} 
                    />
                ))}
            </div>
        </div>
    );
}

export default DashboardPage;