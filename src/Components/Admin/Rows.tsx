import React from "react";
import { IAdminUserInfo } from "../../types/admin.types";
import SingleRow from "./SingleRow";

interface props {
    data: IAdminUserInfo[];
    onOperationSuccess: () => void;
}

const Rows : React.FC<props> = ({data, onOperationSuccess}) => {
    return (
      <>
        {data.map((user, idx) => (
          <SingleRow
            user={user}
            key={idx}
            onOperationSuccess={onOperationSuccess}
          />
        ))}
      </>
    );

}

export default Rows;