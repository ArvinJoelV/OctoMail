function StatCard({ title, value }){
    return (
        <div className="stat-card">
            <span className="stat-card-title">{title}</span>
            <span className="stat-card-value">{value}</span>
        </div>
    );
}

export default StatCard;
