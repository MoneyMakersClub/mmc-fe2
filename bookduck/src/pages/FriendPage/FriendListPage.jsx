import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NavigationHeader from "../../components/common/NavigationHeader";
import TabBarComponent from "../../components/common/TabBarComponent";
import CurrentFriendComponent from "../../components/FriendPage/CurrentFriendComponent";
import FriendRequestComponent from "../../components/FriendPage/FriendRequestComponent";
const FriendListPage = () => {
  const [tab, setTab] = useState("친구");
  const location = useLocation();

  useEffect(() => {
    if (location.state?.activeTab) {
      setTab(location.state.activeTab);
    }
  }, [location.state]);
  return (
    <div>
      <NavigationHeader title="친구 목록" edit={false} />
      <TabBarComponent
        tabs={["친구", "요청"]}
        activeTab={tab}
        onTabClick={setTab}
        size="small"
        borderWidth="3rem"
      />
      <div className="h-3"></div>
      {tab === "친구" && <CurrentFriendComponent />}
      {tab === "요청" && <FriendRequestComponent />}
    </div>
  );
};

export default FriendListPage;
