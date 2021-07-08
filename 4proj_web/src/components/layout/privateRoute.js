import React, { useEffect, useState } from "react";
import { getInLocalStorage, read } from "./../../common/requests/requests";

export default function PrivateRoute({ children }) {
  const [BodyContent, setBodyContent] = useState("...");
  const [User, setUser] = useState({});
  const getBodyContent = async ({ children }) => {
    const auth = await getInLocalStorage("auth");
    if (auth !== "true") {
      window.location.href = "/";
    } else {
      setBodyContent(children);
      const user = await read("/auth/" + (await getInLocalStorage("userId")));
      if (user.status === 200) {
        setUser(user.message);
      }
    }
  };
  useEffect(() => {
    getBodyContent({ children });
  }, [children]);

  return <div user={User}>{BodyContent}</div>;
}
