

import * as React from 'react';
import { Searchbar } from 'react-native-paper';
import { useState,useEffect } from 'react';

const SearchBarComp = () => {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    console.log(searchQuery);
  }, [searchQuery])

  React.useState

  return (
    <Searchbar
      placeholder="Search"
      onChangeText={setSearchQuery}
      value={searchQuery}
      mode='bar'
    />
  );
};

export default SearchBarComp;