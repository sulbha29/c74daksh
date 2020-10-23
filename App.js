
import React from 'react';
import Transaction_screen from './screens/transaction'
import Search_Screen from './screens/search'
import { StyleSheet, Text, View, Image } from 'react-native';
import   { createAppContainer }from 'react-navigation'
import { createBottomTabNavigator }from 'react-navigation-tabs'

export default class App extends React.Component{
  render(){
  return (
   <AppContainer/>    
  );
}}
const TabNavigator=createBottomTabNavigator({
  transactions:{screen:Transaction_screen},
  search:{screen:Search_Screen}
},

{

  defaultNavigationOptions:({navigation})=>({

tabBarIcon:({})=>{

const routeName=navigation.state.routeName
if(routeName ==='transactions'){

return(<Image source={require('./assets/book.png')} style={{width:30,height:30,borderColor:"black"}}/>)

}
else if(routeName ==='search'){

return(<Image source={require('./assets/searchingbook.png')}style={{width:30,height:30,borderColor:"black"}}/>)

}

}

  })

}

)
 const AppContainer=createAppContainer(TabNavigator)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
