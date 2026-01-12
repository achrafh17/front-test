import React, { useState } from "react"
import TopBar from "./TopBar"
import UsersDefaultRSB from "../RightSideBars/UsersDefaultRSB"
import useRSB from "../../hooks/useRSB";
import { useEffect } from "react"
import UsersList from "./UsersList"
import useAuth from "../../hooks/useAuth"
import { IUserSingle, userPrivilegesStripped } from "../../types/api.types"
import "../../styles/Users.css"
import AddUserDialog from "./AddUserDialog"
import useStore from "../../store/store";
import { useNavigate } from "react-router-dom";

interface props {

}

const Main :  React.FC<props> = () => {
    const {setRsbVariant} = useRSB()
    const {userInfo} = useAuth();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("")
    const [users, setUsers] = useState<IUserSingle[]>([]);
    const [isOpen, setIsOpen] = useState(false)
    const setErrorMsg = useStore(state => state.setErrorMsg)

    useEffect(()=>{
      if(! userInfo || userInfo.parentId !== null){
        setErrorMsg("Vous n'avez pas les privilèges nécessaires pour gérer les utilisateurs.")
        setTimeout(()=>{
          navigate("/devices")
        }, 1000)
      }
    }, [setErrorMsg, userInfo, navigate])

    const onAddUserPress = () => {
      setIsOpen(true)
    }

    const fetchUsers = async (sessionId: string) => {
      try{
        var res = await fetch("https://www.powersmartscreen.com/get-users?sessionId="+sessionId);
        var resJson = await res.json();

        if(resJson.success){
          var result = resJson.result as IUserSingle[]
          setUsers(result)
        }
      }catch(e){}
    }

    const removeUser = (userId: number) => {
      setUsers((old) => old.filter((u) => u.userId !== userId));
      setRsbVariant({
        name: "USERS_DEFAULT",
        renderComponent: () => (
          <UsersDefaultRSB onAddUserPress={onAddUserPress} />
        ),
      });
    }

    const updatePrivileges = (userIdx: number, newPrivileges: userPrivilegesStripped) => {
      setUsers(old => {
        var newUsers = [...old];
        newUsers[userIdx].privileges = newPrivileges;
        return newUsers;
      })
    }

    useEffect(()=>{
      setRsbVariant({
        name: "USERS_DEFAULT",
        renderComponent: () => (
          <UsersDefaultRSB onAddUserPress={onAddUserPress} />
        ),
      });
    }, [setRsbVariant])

    useEffect(()=>{
      if(userInfo?.sessionId){
        fetchUsers(userInfo.sessionId);
      }
    }, [userInfo?.sessionId])



    return (
      <div className="main-screen">
        <TopBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onAddUserPress={onAddUserPress}
        />
        <UsersList
          users={users}
          searchTerm={searchTerm}
          onAddUserPress={onAddUserPress}
          removeUser={removeUser}
          updatePrivileges={updatePrivileges}
        />
        {isOpen && (
          <AddUserDialog
            open={isOpen}
            onClose={() => {
              setIsOpen(false);
            }}
            onSave={(newUser: IUserSingle) => {
              setUsers((old) => [...old, newUser]);
            }}
          />
        )}
      </div>
    );
}

export default Main;