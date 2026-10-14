function DigestCard({ digest }){
    return (
        <div className="digest-card">
            <div className="digest-card-header">
                <div className="digest-card-title">
                    <span>⚡</span>
                    <span>Daily AI Digest</span>
                </div>
                {digest?.date && (
                    <span className="digest-card-date">
                        {new Date(digest.date).toLocaleDateString(undefined, { dateStyle: "medium" })}
                    </span>
                )}
            </div>
            <p className="digest-card-content">{digest?.content}</p>
        </div>
    );
}

export default DigestCard;
