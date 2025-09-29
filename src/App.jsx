import { usePersonal } from "./store";
import "./styles/App.css";

function App() {
    const { name, setPersonName } = usePersonal();

    return (
        <>
            <div>
                name: {name} <br />
                <button
                    className="bg-pink-500 rounded-xl p-2 cursor-pointer"
                    onClick={() => {
                        setPersonName("Judah123");
                    }}
                >
                    Click Me
                </button>
            </div>
        </>
    );
}

export default App;
