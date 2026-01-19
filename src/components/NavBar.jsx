import "./NavBar.css";

function NavBar() {
    return (
        <nav className="nav-bar">
            <div className="logo">elliot</div>
            <div className="nav-links">
                <a href="/">home</a>
                <a href="/blogs">blogs</a>
                <a href="/projects">projects</a>
                <a href="/about">about</a>
            </div>
        </nav>
    );
}

export default NavBar;