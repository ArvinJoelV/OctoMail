function NotificationCard({ title, message, type }){
    return (
        <div className="notification-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h4 className="notification-card-title">{title}</h4>
                {type && <span className="notification-card-type">{type}</span>}
            </div>
            {message && <p className="notification-card-message">{message}</p>}
        </div>
    );
}

export default NotificationCard;
