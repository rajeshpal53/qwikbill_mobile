

import * as React from 'react';
import { ToggleButton } from 'react-native-paper';
import { View, Text, TouchableOpacity } from 'react-native';

const CustomToggleButton = ({ options, value, onChange,t }) => {
  return (
    <View style={{ flexDirection: 'row' }}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          onPress={() => onChange(option.value)}
          style={{
            paddingHorizontal: 10,
            paddingVertical: 8,
            paddingTop:10,
            backgroundColor: value === option.value ?
            // '#6200ee'
            '#0c3b73'
            : '#ddd',
            margin: 5,
            borderRadius: 5,
          }}
        >
          <Text style={{ color: value === option.value ? '#fff' : '#000', fontFamily:"Poppins-Regular" }}>
            {t(option.label)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default CustomToggleButton;


// import * as React from 'react';
// import { ToggleButton } from 'react-native-paper';

// const CustomToggleButton = ({ options, value, onChange }) => {
//   return (
//     <ToggleButton.Row onValueChange={onChange} value={value}>
//       {options.map((option) => (
//         <ToggleButton key={option.value} icon={option.icon} value={option.value} />
//       ))}
//     </ToggleButton.Row>
//   );
// };

// export default CustomToggleButton;



// import * as React from 'react';
// import { Text, ToggleButton } from 'react-native-paper';

// const CustomToggleButton = ({ options, value, onChange }) => {
//   return (
//     <ToggleButton.Row onValueChange={onChange} value={value}>
//       {options.map((option) => (
//           <ToggleButton key={option.value} value={option.value}>
//           <Text>{option.label}</Text>
//         </ToggleButton>
//       ))}
//     </ToggleButton.Row>
//   );
// };

// export default CustomToggleButton;



