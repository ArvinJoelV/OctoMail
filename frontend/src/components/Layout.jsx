import Sidebar from "./SideBar";

function Layout({children}){
    return (
        <div className="app-container">
            <Sidebar />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
}

export default Layout;
