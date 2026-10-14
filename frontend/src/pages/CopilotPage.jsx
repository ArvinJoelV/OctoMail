import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { askCopilot } from "../services/copilotServices";

function CopilotPage(){
    const [searchParams] = useSearchParams();
    const emailId = searchParams.get("emailId");
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hi, I'm your OctoMail AI Copilot. Ask me anything about your emails, pending tasks, deadlines, or let me draft replies for you!" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSend(){
        if (!input.trim() || loading) return;
        
        const query = input;
        setInput("");
        setLoading(true);

        try {
            const userMessage = { role: "user", content: query };
            setMessages(previous => [...previous, userMessage]);
            
            const response = await askCopilot(query, emailId);
            const assistantMessage = { 
                role: "assistant", 
                content: response.answer || "No response received.",
                sources: response.sources
            };
            setMessages(previous => [...previous, assistantMessage]);
        } catch (err) {
            setMessages(previous => [
                ...previous, 
                { role: "assistant", content: "Sorry, I encountered an error while processing your request." }
            ]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="copilot-container">
            <div className="page-header" style={{ marginBottom: "16px" }}>
                <h1 className="page-title">OctoMail AI Copilot</h1>
                <p className="page-subtitle">
                    {emailId ? "Focused on single email context" : "Context-aware AI assistant powered by Groq & Gemini"}
                </p>
            </div>

            <div className="copilot-messages">
                {messages.map((message, index) => (
                    <div 
                        key={index} 
                        className={`chat-bubble ${message.role === "user" ? "user" : "assistant"}`}
                    >
                        <div className="chat-role-label">
                            {message.role === "user" ? "You" : "OctoMail Copilot"}
                        </div>
                        <p>{message.content}</p>

                        {message.sources?.length > 0 && (
                            <div style={{ marginTop: "12px", borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: "8px", fontSize: "12px" }}>
                                <strong>Sources:</strong>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
                                    {message.sources.map((source, sIndex) => (
                                        <span key={sIndex} className="badge badge-category">
                                            {source.subject || "Email reference"}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                {loading && (
                    <div className="chat-bubble assistant">
                        <div className="chat-role-label">OctoMail Copilot</div>
                        <p>Thinking and analyzing emails...</p>
                    </div>
                )}
            </div>

            <div className="copilot-input-bar">
                <input 
                    className="input-text"
                    placeholder="Ask a question or request a summary..."
                    value={input} 
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                    disabled={loading}
                />
                <button 
                    className="btn btn-primary" 
                    onClick={handleSend} 
                    disabled={loading || !input.trim()}
                >
                    {loading ? "Thinking..." : "Send"}
                </button>
            </div>
        </div>
    );
}

export default CopilotPage;
