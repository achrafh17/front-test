import React, { useState } from "react";
import AdminSignIn from "./AdminSignIn";
import AdminApp from "./AdminApp";

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  return (
    <>
      {isSignedIn ? (
        <AdminApp />
      ) : (
        <AdminSignIn
          onSuccess={() => {
            setIsSignedIn(true);
          }}
        />
      )}
    </>
  );

}

export default App;
