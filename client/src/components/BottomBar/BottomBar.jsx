import { useEffect, useState } from "react";
import "./BottomBar.scss";

function BottomBar() {
    const [selectedTab, setSelectedTab] = useState("Home");

    const handleTabChange = (tabName) => {
        console.log(tabName)
        setSelectedTab(tabName);
    };

    useEffect(() => {
        const BottomBar = document.querySelector(".bottombar");
        BottomBar.classList.add("initial");
        setTimeout(() => {
            BottomBar.classList.remove("initial");
        }, 100);
    }, []);
    return (
        <aside className="bottombar">
            <div className="tabs">
                <input
                    id="tab-1"
                    type="radio"
                    name="group"
                    defaultChecked={true}
                    onChange={() => handleTabChange("Home")}
                />
                <input
                    id="tab-2"
                    type="radio"
                    name="group"
                    onChange={() => handleTabChange("Chat")}
                />
                <input
                    id="tab-3"
                    type="radio"
                    name="group"
                    onChange={() => handleTabChange("Saved")}
                />
                <input
                    id="tab-4"
                    type="radio"
                    name="group"
                    onChange={() => handleTabChange("Profile")}
                />

                <div className="buttons">
                    <label className="material-symbols-outlined" htmlFor="tab-1">
                        Home
                    </label>
                    <label className="material-symbols-outlined" htmlFor="tab-2">
                        Chat
                    </label>
                    <label className="material-symbols-outlined" htmlFor="tab-3">
                        Bookmark
                    </label>
                    <label className="material-symbols-outlined" htmlFor="tab-4">
                        Person
                    </label>
                    <div className="underline"></div>
                </div>
            </div>

            {/* Render the content based on the selected tab */}
            {selectedTab === "Home" && <>heyyywe</>}
            {selectedTab === "Chat" && <>heyyy123</>}
            {selectedTab === "Bookmark" && <>heyyy21</>}
            {selectedTab === "Person" && <>heyyy5656</>}
        </aside>
    );
}

export default BottomBar;
