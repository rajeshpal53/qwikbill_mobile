
// import React from 'react';
// import { View, useWindowDimensions ,Text } from 'react-native';
// import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
// import ResolvedQueries from './ResolvedQueries';
// import PendingQueries from './PendingQueries';
// import { useTranslation } from 'react-i18next'; 

// const renderScene = SceneMap({
//   first: PendingQueries,
//   second: ResolvedQueries,
// });

// const AllQuerysAndSupport = () => {
//   const { t } = useTranslation(); 
//   const layout = useWindowDimensions();
//   const [index, setIndex] = React.useState(0);

//   const routes = [
//     { key: 'first', title: t('Pending') },
//     { key: 'second', title: t('Resolved') },
//   ];

//   return (
//     <TabView
//       navigationState={{ index, routes }}
//       renderScene={renderScene}
//       renderTabBar={(props) => (
//         <TabBar
//           {...props}
//           indicatorStyle={{ backgroundColor: "#0c3b73", height: 3 }}
//           style={{ backgroundColor: "white" }}
//           inactiveColor="black"
//         />
//       )}
//       onIndexChange={setIndex}
//       initialLayout={{ width: layout.width }}
//       style={{ backgroundColor: "#fff" }}
//     />
//   );
// };

// export default AllQuerysAndSupport;






import React, { useState } from 'react';
import { View, useWindowDimensions, Text } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import ResolvedQueries from './ResolvedQueries';
import PendingQueries from './PendingQueries';
import { useTranslation } from 'react-i18next';

const AllQuerysAndSupport = () => {
  const { t } = useTranslation();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const routes = [
    { key: 'pending', title: t('Pending') },
    { key: 'resolved', title: t('Resolved') },
  ];

  
  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'pending':
        return <PendingQueries />;
      case 'resolved':
        return <ResolvedQueries />;
      default:
        return null;
    }
  };

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: "#0c3b73", height: 3 }}
          style={{ backgroundColor: "white" }}
          activeColor='#0c3b73'
          inactiveColor="black"
        />
      )}
      onIndexChange={(newIndex) => {
        console.log("Tab Changed To:", newIndex);
        setIndex(newIndex);
      }}
      initialLayout={{ width: layout.width }}
      style={{ backgroundColor: "#fff" }}
    />
  );
};

export default AllQuerysAndSupport;
