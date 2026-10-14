import {Route, Routes} from "react-router-dom";
import DashboardPage from "../pages/DashboardPage";
import EmailsPage from "../pages/EmailsPage";
import CopilotPage from "../pages/CopilotPage";
import EmailDetailPage from "../pages/EmailDetailPage";
import NotificationPage from "../pages/NotificationPage";

function AppRoutes(){

    return (
        <Routes>
            <Route
                path="/"
                element={<DashboardPage></DashboardPage>}
            />
            <Route 
            path="/emails"
            element={<EmailsPage></EmailsPage>}
            />
            <Route 
            path="/copilot"
            element={<CopilotPage></CopilotPage>}
            />
            <Route 
            path="/emails/:id"
            element={<EmailDetailPage></EmailDetailPage>}
            />
            <Route 
            path="/notification"
            element={<NotificationPage></NotificationPage>}
            />


        </Routes>
    );
}

export default AppRoutes;