function EmailCard({ email, onclick }){
    const priorityClass = 
        email?.priority?.toLowerCase() === "high" 
            ? "badge-high" 
            : email?.priority?.toLowerCase() === "medium" 
            ? "badge-medium" 
            : "badge-low";

    return (
        <div className="email-card" onClick={onclick}>
            <div className="email-card-header">
                <h3 className="email-card-subject">{email.subject || "No Subject"}</h3>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    {email.category && (
                        <span className="badge badge-category">{email.category}</span>
                    )}
                    <span className={`badge ${priorityClass}`}>
                        {email.priority || "Normal"}
                    </span>
                </div>
            </div>

            <div className="email-card-meta">
                <span className="email-card-sender">From: {email.sender}</span>
                {email.tasks?.length > 0 && (
                    <span>📋 {email.tasks.length} task{email.tasks.length > 1 ? "s" : ""}</span>
                )}
                {email.deadlines?.length > 0 && (
                    <span>⏰ {email.deadlines.length} deadline{email.deadlines.length > 1 ? "s" : ""}</span>
                )}
            </div>

            {email.summary && (
                <p className="email-card-summary">{email.summary}</p>
            )}
        </div>
    );
}

export default EmailCard;