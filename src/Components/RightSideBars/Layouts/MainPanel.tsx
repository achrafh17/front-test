import Box from "@mui/material/Box";
import React from "react";
import TabHeader from "./Tabs/TabHeader";
import SettingsTab from "./Tabs/SettingsTab";
import ActionsTab from "./Tabs/ActionsTab";
import LayersTab from "./Tabs/LayersTab";


const TABS = [
  {
    id: "0",
    label: "Paramètres",
  },
  {
    id: "1",
    label: "Calques",
  },
  {
    id: "2",
    label: "Actions",
  },
];


const MainPanel: React.FC<{}> = () => {

  const [activeTab, setActiveTab] = React.useState(TABS[0].id);

  return (
    <Box style={{ flex: 1, width: "100%" }}>
      <TabHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        TABS={TABS}
      />
      {activeTab === "0" ? (
        <SettingsTab />
      ) : activeTab === "1" ? (
        <LayersTab />
      ) : (
        <ActionsTab />
      )}
    </Box>
  );
};

export default MainPanel;