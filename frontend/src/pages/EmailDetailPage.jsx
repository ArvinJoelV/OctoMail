import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useEmails from "../hooks/useEmails";
import { getEmailById, getSimilarEmails, processSingleEmail } from "../services/emailService";
import EmailCard from "../components/EmailCard";

function EmailDetailPage(){
    const { id } = useParams();
    const navigate = useNavigate();
    const { emails, loading: emailsLoading } = useEmails();
    
    const [currentEmail, setCurrentEmail] = useState(null);
    const [fetching, setFetching] = useState(true);
    const [showBody, setShowBody] = useState(false);
    const [similarEmails, setSimilarEmails] = useState([]);
    const [showSimilar, setShowSimilar] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);

    // Initial load: find from emails list or fetch from API
    useEffect(() => {
        let isMounted = true;
        setFetching(true);

        const found = emails.find(e => e._id === id);
        if (found) {
            setCurrentEmail(found);
            setFetching(false);
        } else {
            getEmailById(id)
                .then(data => {
                    if (isMounted) {
                        setCurrentEmail(data);
                        setFetching(false);
                    }
                })
                .catch(err => {
                    console.error("Failed to fetch email by ID:", err);
                    if (isMounted) setFetching(false);
                });
        }

        return () => { isMounted = false; };
    }, [id, emails]);

    // Handle single email processing / re-analysis
    async function handleAnalyzeEmail(){
        setAnalyzing(true);
        try {
            const res = await processSingleEmail(id);
            if (res?.email) {
                setCurrentEmail(res.email);
            } else {
                const refreshed = await getEmailById(id);
                setCurrentEmail(refreshed);
            }
        } catch (err) {
            console.error("Error analyzing email:", err);
            alert("Analysis error: " + (err.response?.data?.error || err.message));
        } finally {
            setAnalyzing(false);
        }
    }

    async function handleSimilarEmails(){
        if (showSimilar){
            setShowSimilar(false);
            return;
        }
        try {
            const data = await getSimilarEmails(id);
            setSimilarEmails(data);
            setShowSimilar(true);
        } catch (err) {
            console.error("Similar emails error:", err);
        }
    }

    if (fetching && emailsLoading){
        return (
            <div style={{ padding: "48px 0", textAlign: "center", color: "var(--text-muted)" }}>
                <h2>Loading email details...</h2>
            </div>
        );
    }

    if (!currentEmail){
        return (
            <div style={{ padding: "48px 0", textAlign: "center" }}>
                <h2>Email not found</h2>
                <button className="btn btn-primary" style={{ marginTop: "16px" }} onClick={() => navigate("/emails")}>
                    ← Back to Inbox
                </button>
            </div>
        );
    }

    const priorityClass = 
        currentEmail.priority?.toLowerCase() === "high" 
            ? "badge-high" 
            : currentEmail.priority?.toLowerCase() === "medium" 
            ? "badge-medium" 
            : "badge-low";

    const hasSummary = currentEmail.summary && currentEmail.summary.trim().length > 0;
    const hasTasks = currentEmail.tasks && currentEmail.tasks.length > 0;
    const hasDeadlines = currentEmail.deadlines && currentEmail.deadlines.length > 0;

    return (
        <div>
            <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button className="btn btn-secondary" onClick={() => navigate("/emails")}>
                    ← Back to Inbox
                </button>
                <button 
                    className="btn btn-primary" 
                    onClick={handleAnalyzeEmail} 
                    disabled={analyzing}
                >
                    {analyzing ? "⚡ Analyzing Email with AI..." : hasSummary ? "🔄 Re-analyze with AI" : "⚡ Generate AI Summary"}
                </button>
            </div>

            <div className="email-detail-container">
                <div className="email-detail-header">
                    <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "12px" }}>
                        <span className={`badge ${priorityClass}`}>
                            {currentEmail.priority ? `${currentEmail.priority.toUpperCase()} Priority` : "Unclassified Priority"}
                        </span>
                        <span className="badge badge-category">
                            {currentEmail.category || "General"}
                        </span>
                        {currentEmail.processed && (
                            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>✓ AI Processed</span>
                        )}
                    </div>
                    <h1 className="email-detail-subject">{currentEmail.subject || "(No Subject)"}</h1>
                    <div className="email-detail-meta-row">
                        <span><strong>From:</strong> {currentEmail.sender || "Unknown Sender"}</span>
                        {currentEmail.receivedAt && (
                            <span><strong>Date:</strong> {new Date(currentEmail.receivedAt).toLocaleString()}</span>
                        )}
                    </div>
                </div>

                {/* AI SUMMARY SECTION */}
                <div className="section-box" style={{ borderLeft: "4px solid var(--primary)", background: "var(--primary-light)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <div className="section-box-title" style={{ color: "var(--primary)", margin: 0 }}>
                            ✨ AI Executive Summary
                        </div>
                    </div>
                    {hasSummary ? (
                        <p style={{ fontSize: "15px", lineHeight: "1.6", color: "#1e293b" }}>
                            {currentEmail.summary}
                        </p>
                    ) : (
                        <div style={{ padding: "12px 0" }}>
                            <p style={{ color: "var(--text-muted)", marginBottom: "12px", fontSize: "14px" }}>
                                This email has not been summarized by OctoMail AI yet.
                            </p>
                            <button 
                                className="btn btn-primary" 
                                onClick={handleAnalyzeEmail} 
                                disabled={analyzing}
                            >
                                {analyzing ? "⚡ Generating Summary..." : "⚡ Generate AI Summary & Tasks Now"}
                            </button>
                        </div>
                    )}
                </div>

                {/* TASKS SECTION */}
                <div className="section-box">
                    <div className="section-box-title">📋 Extracted Action Items & Tasks</div>
                    {hasTasks ? (
                        <ul className="task-list">
                            {currentEmail.tasks.map((task, index) => (
                                <li key={index} className="task-item">
                                    <span>◻</span>
                                    <span>{task}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                            {currentEmail.processed 
                                ? "No actionable tasks detected in this email." 
                                : "Tasks will appear here once the email is analyzed by AI."}
                        </p>
                    )}
                </div>

                {/* DEADLINES SECTION */}
                <div className="section-box">
                    <div className="section-box-title">⏰ Important Deadlines & Dates</div>
                    {hasDeadlines ? (
                        <ul className="task-list">
                            {currentEmail.deadlines.map((deadline, index) => (
                                <li key={index} className="task-item" style={{ borderColor: "#fde68a", background: "#fffbeb" }}>
                                    <span>⚠️</span>
                                    <span style={{ fontWeight: "600", color: "#92400e" }}>{deadline}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                            {currentEmail.processed 
                                ? "No impending deadlines detected in this email." 
                                : "Deadlines will be highlighted here after AI analysis."}
                        </p>
                    )}
                </div>

                {/* QUICK ACTIONS */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", margin: "24px 0" }}>
                    <button className="btn btn-primary" onClick={() => navigate(`/copilot?emailId=${currentEmail._id}`)}>
                        🤖 Ask OctoMail Copilot About This Email
                    </button>
                    <button className="btn btn-secondary" onClick={handleSimilarEmails}>
                        🔍 {showSimilar ? "Hide Similar Emails" : "Find Similar Emails"}
                    </button>
                    <button className="btn btn-secondary" onClick={() => setShowBody(!showBody)}>
                        📄 {showBody ? "Hide Original Email Body" : "View Original Email Body"}
                    </button>
                </div>

                {showBody && (
                    <div style={{ marginTop: "16px" }}>
                        <h3 style={{ fontSize: "16px", marginBottom: "8px" }}>Original Email Body</h3>
                        <div className="body-preview">
                            {currentEmail.body || currentEmail.snippet || "No body content available."}
                        </div>
                    </div>
                )}

                {showSimilar && (
                    <div style={{ marginTop: "32px", borderTop: "1px solid var(--border-color)", paddingTop: "24px" }}>
                        <h3 className="section-title">Semantically Similar Emails</h3>
                        <div className="cards-list">
                            {similarEmails.length === 0 ? (
                                <p style={{ color: "var(--text-muted)" }}>No other similar emails found.</p>
                            ) : (
                                similarEmails.map(similarEmail => (
                                    <EmailCard 
                                        key={similarEmail._id} 
                                        email={similarEmail} 
                                        onclick={() => navigate(`/emails/${similarEmail._id}`)}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EmailDetailPage;
