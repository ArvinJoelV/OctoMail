import useAnalytics from "../hooks/useAnalytics";
import StatCard from "../components/StatCard";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Cell
} from "recharts";

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

function NotificationPage(){
    const {
        totalEmails,
        highPriorityEmails,
        pendingTasks,
        overdueTasks,
        categoryData,
        activityData,
        priorityData,
        topSenders,
        taskDeadlineData
    } = useAnalytics();

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Analytics & Insights</h1>
                <p className="page-subtitle">Email volume trends, category breakdowns, and workload distributions</p>
            </div>

            {/* STAT CARDS */}
            <div className="stat-grid">
                <StatCard title="Total Emails" value={totalEmails} />
                <StatCard title="High Priority" value={highPriorityEmails} />
                <StatCard title="Pending Tasks" value={pendingTasks} />
                <StatCard title="Overdue Tasks" value={overdueTasks} />
            </div>

            {/* CHARTS GRID */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "24px", marginBottom: "28px" }}>
                {/* CATEGORY CHART */}
                <div className="analytics-chart-card">
                    <h2 className="section-title" style={{ margin: "0 0 16px 0" }}>Email Categories</h2>
                    <div style={{ width: "100%", height: "280px" }}>
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <BarChart data={categoryData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                                <YAxis stroke="#64748b" fontSize={12} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* ACTIVITY CHART */}
                <div className="analytics-chart-card">
                    <h2 className="section-title" style={{ margin: "0 0 16px 0" }}>Email Activity Trend</h2>
                    <div style={{ width: "100%", height: "280px" }}>
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <LineChart data={activityData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                                <YAxis stroke="#64748b" fontSize={12} />
                                <Tooltip />
                                <Line type="monotone" dataKey="count" stroke="#a855f7" strokeWidth={3} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* PRIORITY CHART */}
                <div className="analytics-chart-card">
                    <h2 className="section-title" style={{ margin: "0 0 16px 0" }}>Priority Distribution</h2>
                    <div style={{ width: "100%", height: "280px", display: "flex", justifyContent: "center" }}>
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <PieChart>
                                <Pie 
                                    data={priorityData} 
                                    dataKey="value" 
                                    nameKey="name" 
                                    cx="50%" 
                                    cy="50%" 
                                    outerRadius={90} 
                                    label
                                >
                                    {priorityData?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* TOP SENDERS */}
                <div className="analytics-chart-card">
                    <h2 className="section-title" style={{ margin: "0 0 16px 0" }}>Top Senders</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "280px", overflowY: "auto" }}>
                        {topSenders.map((sender, idx) => (
                            <div 
                                key={sender.sender}
                                style={{ 
                                    display: "flex", 
                                    justifyContent: "space-between", 
                                    alignItems: "center",
                                    padding: "10px 14px", 
                                    background: "#f8fafc", 
                                    borderRadius: "8px",
                                    border: "1px solid #e2e8f0" 
                                }}
                            >
                                <span style={{ fontWeight: "500", color: "#334155" }}>
                                    #{idx + 1} {sender.sender}
                                </span>
                                <span className="badge badge-category">
                                    {sender.count} email{sender.count > 1 ? "s" : ""}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* TASK TABLE */}
            <div className="analytics-chart-card">
                <h2 className="section-title" style={{ margin: "0 0 16px 0" }}>Tasks & Deadlines Schedule</h2>
                <div style={{ overflowX: "auto" }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Task Description</th>
                                <th>Deadline</th>
                                <th>Priority</th>
                                <th>Subject Reference</th>
                            </tr>
                        </thead>
                        <tbody>
                            {taskDeadlineData.length === 0 ? (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: "center", padding: "24px", color: "var(--text-muted)" }}>
                                        No pending tasks or deadlines scheduled.
                                    </td>
                                </tr>
                            ) : (
                                taskDeadlineData.map((task, index) => {
                                    const priorityBadge = 
                                        task.priority?.toLowerCase() === "high" ? "badge-high" :
                                        task.priority?.toLowerCase() === "medium" ? "badge-medium" : "badge-low";
                                    return (
                                        <tr key={index}>
                                            <td style={{ fontWeight: "500" }}>{task.task}</td>
                                            <td>
                                                <span style={{ color: "#b45309", fontWeight: "500" }}>
                                                    {task.deadline || "None"}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge ${priorityBadge}`}>
                                                    {task.priority || "Normal"}
                                                </span>
                                            </td>
                                            <td style={{ color: "var(--text-muted)" }}>{task.subject}</td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default NotificationPage;
