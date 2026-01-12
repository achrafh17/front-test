import React from "react";
import Box from "@mui/material/Box";

interface props {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    TABS: { id: string; label: string }[];
}

const TabHeader: React.FC<props> = ({activeTab, setActiveTab, TABS}) => {

    return (
      <Box
        sx={{
          display: "flex",
          alignItems:"center",
          justifyContent: "space-between",
          gap: 1,
          px: 1,
          borderBottom: "1px solid #d9dfe0",
          height: 50
        }}
      >
        {TABS.map((tab) => {
          return (
            <Box
              key={tab.id}
              sx={{
                flex: 1,
              }}
            >
              {activeTab === tab.id && (
                <Box
                  sx={{ width: "100%", height: 4, backgroundColor: "#F00020" }}
                ></Box>
              )}
              <Box
                onClick={() => setActiveTab(tab.id)}
                sx={{
                  cursor: "pointer",
                  width: "100%",
                  py: 1.5,
                  fontSize: 16,
                  fontWeight: activeTab === tab.id ? "500" : "normal",
                  color: activeTab === tab.id ? "#000" : "##84898a",
                  marginTop: activeTab === tab.id ? "-3px" : "0",
                  textAlign: "center",
                }}
              >
                {tab.label}
              </Box>
            </Box>
          );
        })}
      </Box>
    );
}

export default TabHeader;