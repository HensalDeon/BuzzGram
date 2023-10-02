import { useEffect } from "react";
import "./BottomBar.scss"

function BottomBar() {
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
                <input id="tab-1" type="radio" name="group" defaultChecked={true}  />
                <input id="tab-2" type="radio" name="group" />
                <input id="tab-3" type="radio" name="group" />
                <input id="tab-4" type="radio" name="group" />

                <div className="buttons">
                    <label className="material-symbols-outlined" htmlFor="tab-1">
                        Home
                    </label>
                    <label className="material-symbols-outlined" htmlFor="tab-2">
                        chat
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
        </aside>
    );
}

export default BottomBar;
