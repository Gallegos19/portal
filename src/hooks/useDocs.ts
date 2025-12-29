import { useState } from "react";
import { useLocation } from "react-router-dom";

const useDocs = () => {
    const location = useLocation();
    const [currentTab, setCurrentTab] = useState<number>(location.pathname.includes('academicos') ? 1 : location.pathname.includes('personales') ? 0 : 0);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    return {
        currentTab,
        setCurrentTab,
        handleTabChange
    }
}

export default useDocs;
