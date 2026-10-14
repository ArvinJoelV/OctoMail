import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmailCard from "../components/EmailCard";
import useEmails from "../hooks/useEmails";
import api from "../services/api";
import { getSemanticSearch } from "../services/emailService";

function EmailsPage(){
    const [searchTerm,setSearchTerm]=useState("");
    const {emails , loading , error} = useEmails();
    const [semanticResults,setSemanticResults]=useState(null);
    const navigate=useNavigate();
    const [filters, setFilters]=useState({
        priority:"all",
        category:"all",
        sender:"all",
        hasTasks:false,
        hasDeadlines: false,
        today:false,
        lastWeek:false
    });
    const [sortBy,setSortBy]=useState("latest");
    const [syncing, setSyncing]=useState(false);

    if (loading){
        return (<h2>Loading...</h2>)

    }
    if (error){
        return (<h2>{error}</h2>)
    }
        const senders = [...new Set(emails.map(email=>email.sender))];
   // const filteredEmails= emails.filter(email=>
  //      email.subject.toLowerCase().includes(searchTerm.toLowerCase())
  //  );
  async function handleSemanticSearch(){
    if (searchTerm.trim()===""){
        setSemanticResults(null);
        return;
    }
    const data =await getSemanticSearch(searchTerm);
    setSemanticResults(data);
    
  }
  let displayedEmails= semanticResults ?? emails;
  displayedEmails=[...displayedEmails];
  if (filters.priority!=="all"){
    displayedEmails=displayedEmails.filter(email=>email.priority?.toLowerCase()===filters.priority);
  }
  if(
    filters.category !==
    "all"
){

    displayedEmails =
    displayedEmails.filter(

        email =>

        email.category
        ?.toLowerCase()

        ===

        filters.category

    );

}if(
    filters.sender !==
    "all"
){

    displayedEmails =
    displayedEmails.filter(

        email =>

        email.sender ===
        filters.sender

    );

}
if(
    filters.hasTasks
){

    displayedEmails =
    displayedEmails.filter(

        email =>

        email.tasks &&
        email.tasks.length > 0

    );

}
if(
    filters.hasDeadlines
){

    displayedEmails =
    displayedEmails.filter(

        email =>

        email.deadlines &&
        email.deadlines.length > 0

    );

}
if(
    filters.today
){

    const today =
    new Date()
    .toISOString()
    .split("T")[0];

    displayedEmails =
    displayedEmails.filter(

        email =>

        new Date(
            email.receivedAt
        )
        .toISOString()
        .split("T")[0]

        ===

        today

    );

}
if(
    filters.lastWeek
){

    const weekAgo =
    new Date();

    weekAgo.setDate(
        weekAgo.getDate()-7
    );

    displayedEmails =
    displayedEmails.filter(

        email =>

        new Date(
            email.receivedAt
        ) >= weekAgo

    );

}
if (sortBy === "latest"){
    displayedEmails.sort((a,b)=>new Date(b.receivedAt)- new Date(a.receivedAt));
}
if (sortBy === "oldest"){
    displayedEmails.sort((a,b)=>new Date(a.receivedAt)- new Date(b.receivedAt));
}
if(
    sortBy==="priority"
){

    const weight = {

        high:3,

        medium:2,

        low:1

    };

    displayedEmails.sort(

        (a,b)=>

        (
            weight[
                b.priority
                ?.toLowerCase()
            ]

            || 0
        )

        -

        (
            weight[
                a.priority
                ?.toLowerCase()
            ]

            || 0
        )

    );

}
    return (
        <div>
            <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                    <h1 className="page-title">Inbox & Emails</h1>
                    <p className="page-subtitle">Semantic search, priority filters, and automated task extraction</p>
                </div>
                <button 
                    className="btn btn-secondary"
                    disabled={syncing}
                    onClick={async ()=>{ 
                        setSyncing(true);
                        try {
                            const fetchRes = await api.get("/emails/fetch"); 
                            const processRes = await api.post("/ai/process");
                            alert(processRes.data.message || "Sync & AI Processing started successfully!");
                            window.location.reload();
                        } catch (err) {
                            console.error(err);
                            alert("Sync error: " + (err.response?.data?.error || err.message));
                        } finally {
                            setSyncing(false);
                        }
                    }}
                >
                    {syncing ? "⏳ Syncing..." : "🔄 Force Sync"}
                </button>
            </div>

            <div className="action-bar">
                <div className="search-input-wrap">
                    <input 
                        type="text"
                        className="input-text"
                        placeholder="Search emails intelligently with AI semantic search..."
                        value={searchTerm}
                        onChange={(event)=>setSearchTerm(event.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSemanticSearch(); }}
                    />
                    <button className="btn btn-primary" onClick={handleSemanticSearch}>Search</button>
                    {semanticResults && (
                        <button
                            className="btn btn-secondary"
                            onClick={()=>{
                                setSemanticResults(null);
                                setSearchTerm("");
                            }}
                        >
                            Clear
                        </button>
                    )}
                </div>

                <div className="filters-row">
                    <select
                        className="select-dropdown"
                        value={filters.priority}
                        onChange={(e)=>setFilters(prev=>({...prev, priority:e.target.value}))}
                    >
                        <option value="all">All Priorities</option>
                        <option value="high">High Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="low">Low Priority</option>
                    </select>

                    <select 
                        className="select-dropdown"
                        value={filters.category} 
                        onChange={(e)=>setFilters(prev=>({...prev, category: e.target.value}))}
                    >
                        <option value="all">All Categories</option>
                        <option value="placement">Placement</option>
                        <option value="academic">Academic</option>
                        <option value="coding">Coding</option>
                        <option value="shopping">Shopping</option>
                        <option value="finance">Finance</option>
                        <option value="newsletter">Newsletter</option>
                        <option value="social">Social</option>
                        <option value="other">Other</option>
                    </select>
                        
                    <select 
                        className="select-dropdown"
                        value={filters.sender}
                        onChange={(e)=>setFilters(prev=>({...prev, sender:e.target.value}))}
                    >
                        <option value="all">All Senders</option>
                        {senders.map(sender=>(
                            <option key={sender} value={sender}>{sender}</option>
                        ))}
                    </select>

                    <select
                        className="select-dropdown"
                        value={sortBy}
                        onChange={(e)=>setSortBy(e.target.value)}
                    >
                        <option value="latest">Sort: Latest</option>
                        <option value="oldest">Sort: Oldest</option>
                        <option value="priority">Sort: Priority</option>
                    </select>

                    <label className="checkbox-label">
                        <input 
                            type="checkbox" 
                            checked={filters.hasTasks} 
                            onChange={()=>setFilters(prev=>({...prev, hasTasks: !prev.hasTasks}))}
                        />
                        Has Tasks
                    </label>

                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={filters.hasDeadlines}
                            onChange={()=>setFilters(prev=>({...prev, hasDeadlines: !prev.hasDeadlines}))}
                        />
                        Has Deadlines
                    </label>

                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={filters.today}
                            onChange={()=>setFilters(prev=>({...prev, today: !prev.today}))}
                        />
                        Today
                    </label>
                </div>
            </div>

            <div style={{ marginBottom: "16px", color: "var(--text-muted)", fontSize: "14px", fontWeight: "500" }}>
                Showing {displayedEmails.length} email{displayedEmails.length === 1 ? "" : "s"}
                {semanticResults && " (AI Semantic Search Results)"}
            </div>

            <div className="cards-list">
                {displayedEmails.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-muted)", background: "white", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
                        <p style={{ fontSize: "16px", fontWeight: "500" }}>No emails match your filters</p>
                    </div>
                ) : (
                    displayedEmails.map(email=>(
                        <EmailCard 
                            key={email._id} 
                            email={email} 
                            onclick={()=>navigate(`/emails/${email._id}`)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default EmailsPage;
