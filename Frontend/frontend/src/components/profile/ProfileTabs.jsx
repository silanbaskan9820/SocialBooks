const ProfileTabs = ({ activeTab, setActiveTab }) => {
    return (
        <div className="tabs tabs-boxed justify-center mt-8">

    <button
        className={`tab ${
            activeTab === "wall"
                ? "tab-active"
                : ""
        }`}
        onClick={() => setActiveTab("wall")}
    >
        📰 Wall
    </button>

    <button
        className={`tab ${
            activeTab === "reading"
                ? "tab-active"
                : ""
        }`}
        onClick={() => setActiveTab("reading")}
    >
        📖 Reading
    </button>

    <button
        className={`tab ${
            activeTab === "wishlist"
                ? "tab-active"
                : ""
        }`}
        onClick={() => setActiveTab("wishlist")}
    >
        ⭐ Wishlist
    </button>

    <button
        className={`tab ${
            activeTab === "library"
                ? "tab-active"
                : ""
        }`}
        onClick={() => setActiveTab("library")}
    >
        📚 Library
    </button>

</div>
    )
}

export default ProfileTabs;