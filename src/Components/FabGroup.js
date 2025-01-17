// FabGroup.js
import React from 'react';
import { FAB, Portal, Provider as PaperProvider } from 'react-native-paper';
import { View, StyleSheet } from 'react-native'

const FabGroup = ({ actions, icon }) => {
  const [state, setState] = React.useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });

  const { open } = state;

  return (
    <PaperProvider>
      <Portal>
        <FAB.Group
          open={open}
          visible
          icon={icon || (open ? 'calendar-today' : 'plus')}
          actions={actions}
          onStateChange={onStateChange}
          onPress={() => {
            if (open) {
              // Optional: Handle additional actions when FAB is open
            }
          }}
        />
      </Portal>
    </PaperProvider>
  );
};

export default FabGroup;



// const styles = StyleSheet.create({
//     fab: {
//       width:40,
//       height:40,   
//       position: "absolute",
//       // margin: 16,
//       left:50,
//      top:-150,
//     //  bottom:150,
//       // backgroundColor: "#96214e",
//       color: "white",
//       backgroundColor:"blue"
//     },
//   });