import React, {FC, PropsWithChildren} from "react";

const CallLayout: FC<PropsWithChildren> = ({children}) => {
  return <div className="h-screen bg-black">{children}</div>;
};

export default CallLayout;
