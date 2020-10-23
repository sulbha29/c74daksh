
import React from 'react';

import { StyleSheet, Text,  View ,FlatList,TextInput, TouchableOpacity } from 'react-native';

import db from '../config';
import firebase from 'firebase'
import {ScrollView}  from 'react-native-gesture-handler'
export default class Search_Screen extends React.Component{
    constructor(props){

super(props)
this.state={
alltransaction:[],LastVisibleTransaction:null,search:""
}

    }
    componentDidMount=async()=>{

const querry=await db.collection("transactions").limit(10).get()
querry.docs.map((doc)=>{
    
    this.setState({alltransaction:[...this.state.alltransaction,doc.data()],LastVisibleTransaction:doc})
})

    }

fetchmoretransaction=async()=>{
    var text = this.state.search
      var enteredText = text.split("")
      if (enteredText[0] ==='b'){
     
        const query = await db.collection("transactions").where("bookID","==",text).startAfter(this.state.LastVisibleTransaction).limit(10).get()
 query.docs.map((doc)=>{

this.setState({alltransaction:[...this.state.alltransaction,doc.data()],LastVisibleTransaction:doc})

 })
    }


else if(enteredText[0] === 's'){

    const query=await db.collection("transactions").where("StudentID","==",text).startAfter(this.state.LastVisibleTransaction).limit(10).get()
    query.docs.map((doc)=>{
        this.setState({alltransaction:[...this.state.alltransaction,doc.data()],LastVisibleTransaction:doc})
    })

}


}
searchTransactions=async(text)=>{
  
    var enteredText = text.split("")  
    if (enteredText[0] ==='b'){
    

const transaction=await db.collection("transactions").where("bookID","==",text).get()
transaction.docs.map((doc)=>{
    this.setState({alltransaction:[...this.state.alltransaction,doc.data()],LastVisibleTransaction:doc})
})

}
else if(enteredText[0] ==='s'){

    const transaction=await db.collection("transactions").where("StudentID","==",text).get()
    transaction.docs.map((doc)=>{
        this.setState({alltransaction:[...this.state.alltransaction,doc.data()],LastVisibleTransaction:doc})
    })

}


}

    render(){
        return(
            
            <View style = {styles.container}>
            <View style = {styles.searchbar}>
                <TextInput style = {styles.bar}placeholder = "enter id" 
                onChangeText = {(text)=>this.setState({search:text})}/>
                <TouchableOpacity style ={styles.searchbutton} 
                onPress = {()=>{this.searchTransactions(this.state.search)}}><Text>Search</Text></TouchableOpacity></View>

<FlatList
            data =  {this.state.alltransaction}
            renderItem = {({item})=>(
                    <View style={{borderBottomWidth:2}}>
                        <Text>{"bookid:"+item.bookID}</Text>
                        <Text>{"studentid:"+item.StudentID}</Text>
                        <Text>{"transactiontype:"+item.transactiontype}</Text>
                        <Text>{"date:"+item.date.toDate()}</Text></View>
            )}
            keyExtractor = {(item,index)=>index.toString()}
            onEndReached = {this.fetchmoretransaction}
            onEndReachedThreshold = {0.7}/>
            </View>
    )
}
}                


const styles = StyleSheet.create({ 
    container: { flex: 1, marginTop: 20 } ,
     searchBar:{ flexDirection:'row',
     height:40, width:'auto', borderWidth:0.5,
      alignItems:'center', backgroundColor:'grey',
     }, bar:{ borderWidth:2, height:30, width:300,
         paddingLeft:10, }, searchButton:{ borderWidth:1,
             height:30, width:50, alignItems:'center',
              justifyContent:'center',
 backgroundColor:'green' } })













