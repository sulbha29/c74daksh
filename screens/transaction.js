import React from 'react';

import {StyleSheet, Text, View,TextInput,TouchableOpacity, Image, Alert,KeyboardAvoidingView,ToastAndroid} from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions'
import firebase from 'firebase'
import db from '../config'
export default class Transaction_screen extends React.Component{
    constructor(){
        super();
        this.state={HasCameraPermission:null,
            scanned:false,
            scannedData:'',
            buttonstate:'normal',scannedBookID:"",scanStudentID:"",transactionmsg:''}
    }

        
    getcamperm=async(ID)=>{
const {status}=await Permissions.askAsync(Permissions.CAMERA);
this.setState({
HasCameraPermission:status==="granted",
buttonstate:ID,scanned:false

})
    }
    handlebarcodescanner=async({type,data})=>{
        const{buttonstate}=this.state
        if(buttonstate==='BookID'){

            this.setState({
                scanned:true,
                scannedBookID:data,
                buttonstate:'normal'
            })            

        }
        else if(buttonstate==='StudentID'){

        this.setState({
            scanned:true,
            scanStudentID:data,
            buttonstate:'normal'
        })
    }}
    handletransaction=async()=>{
     var transactiontype=await this.checkbookavalibitlity()
     if (!transactiontype){

Alert.alert("book could not be found :/")
this.setState({scannedBookID:"",scanStudentID:""})

     }
     else if(transactiontype==="issue"){
         
        var studenteligable=await this.checkstudenteligibilityforbookissue()
        if(studenteligable){

this.initiateBookIssue()
Alert.alert("book issued to student")
        }

     }

else {

var studenteligable=await this.checkstudenteligibilityforbookreturn()
if(studenteligable){

this.initiateBookReturn()
Alert.alert("Book has returned")
}

}

      

    }
    initiateBookIssue=async()=>{
        db.collection("transactions").add({
            StudentID:this.state.scanStudentID,
            bookID:this.state.scannedBookID,
            date:firebase.firestore.Timestamp.now().toDate(),
            transactiontype:"issue"
        })
        db.collection("Books").doc(this.state.scannedBookID).update({

            bookavailability:false

        })
        db.collection("students").doc(this.state.scanStudentID).update({

            NumberBooksIssued:firebase.firestore.FieldValue.increment(1)
           

        })
        Alert.alert("Book issued!")

this.setState({
    scannedBookID:"",scanStudentID:""
})

    }

initiateBookReturn=async()=>{ db.collection("transactions").add({
    StudentID:this.state.scanStudentID,
    bookID:this.state.scannedBookID,
    date:firebase.firestore.Timestamp.now().toDate(),
    transactiontype:"return"
})
db.collection("Books").doc(this.state.scannedBookID).update({

    bookavailability:true

})
db.collection("students").doc(this.state.scanStudentID).update({

    NumberBooksIssued:firebase.firestore.FieldValue.increment(-1)
   

})

this.setState({
scannedBookID:"",scanStudentID:""
})}
checkstudenteligibilityforbookissue=async()=>{

const studentref=await db.collection("students").where("StudentID",'==',this.state.scanStudentID).get()
var studenteligable=""
if(studentref.docs.length==0){
    this.setState({scannedBookID:"",scanStudentID:""})
    studenteligable=false
    Alert.alert("OOPS cant find the person")
}
else{

studentref.docs.map((doc)=>{
var student=doc.data()
if(student.NumberBooksIssued<2){

studenteligable=true

}
else{


studenteligable=false
Alert.alert("student has taken MAX ammount of book RETURN one to take another")
this.setState({scannedBookID:"",scanStudentID:""})




}
})

}

return studenteligable

}

checkstudenteligibilityforbookreturn=async()=>{

const transactioinref=await db.collection("transactions").where("bookID","==",this.state.scannedBookID).limit(1).get()
var studenteligable=""
transactioinref.docs.map((doc)=>{

var lastbooktransaction=doc.data()
if (lastbooktransaction.StudentID==this.state.scanStudentID){

studenteligable=true

}


else{

studenteligable=false
Alert.alert("book wasnt taken by same student")
this.setState({scannedBookID:"",scanStudentID:""})

}

})
return studenteligable
}
checkbookavalibitlity=async()=>{
   const bookref=await db.collection("Books").where("bookID","==",this.state.scannedBookID).get()
    var transactiontype=""
    if(bookref.docs.length==0){
        transactiontype=false
        console.log(bookref.docs.length)
    }
    else{
        bookref.docs.map((doc)=>{
            var book = doc.data()
            if(book.bookavailability){
                transactiontype="issue"
            }
            else{
                transactiontype="return"
            }
        })
    }
    return transactiontype
}
    render(){
        const scanned=this.state.scanned;
        const buttonstate=this.state.buttonstate;
        const HasCameraPermission=this.state.HasCameraPermission
        if(buttonstate !=="normal"&&HasCameraPermission){
return(
<BarCodeScanner onBarCodeScanned={scanned?undefined:this.handlebarcodescanner}style={StyleSheet.absoluteFillObject}/>
)

        }
        else if(buttonstate==="normal"){
return(
    <KeyboardAvoidingView style={styles.container}>
    <View>

 <View>

<Image source={require("../assets/booklogo.jpg")}style={{width:100,height:100,borderColor:"black"}}/>
<Text>READ LEARN SUCESS</Text>

 </View>
    <View style={styles.inputView}>

<TextInput style={styles.inputBox}placeholder="Book ID" 
onChangeText={
    text=>this.setState({
        scannedBookID:text
    })
}
value={this.state.scannedBookID}/>
<TouchableOpacity onPress={()=>{

this.getcamperm('BookID')

}}>

<Text>scan</Text>

</TouchableOpacity>

    </View>
    <View style={styles.inputView}>

<TextInput style={styles.inputBox}placeholder="Student ID"
onChangeText={
    text=>this.setState({
        scanStudentID:text
    })}

value={this.state.scanStudentID}/>
<TouchableOpacity onPress={()=>{

this.getcamperm('StudentID')

}}>

<Text>scan</Text>

</TouchableOpacity>

    </View>
    <Text style={styles.transactionAlert}>{this.state.transactionmsg}</Text>
    <TouchableOpacity style={styles.submitButton}onPress={async()=>{var transactionmsg= this.handletransaction()
 
    
    
    }}>

<Text style={styles.submitButtonText}>

submit

</Text>

    </TouchableOpacity>
    </View>
    </KeyboardAvoidingView>
)


        }
        

    }
    
}


const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
 displayText:{ fontSize: 15, textDecorationLine: 'underline' },
  scanButton:{ backgroundColor: '#2196F3', padding: 10, margin: 10 }, 
  buttonText:{ fontSize: 15, textAlign: 'center', marginTop: 10 },
   inputView:{ flexDirection: 'row', margin: 20 },
   inputBox:{ width: 200, height: 40, borderWidth: 1.5, borderRightWidth: 0, fontSize: 20 },
    scanButton:{ backgroundColor: '#66BB6A', width: 50, borderWidth: 1.5, borderLeftWidth: 0 } ,
    submitButton:{ backgroundColor: '#FBC02D', width: 100, height:50 }, 
    submitButtonText:{ padding: 10, textAlign: 'center', fontSize: 20, fontWeight:"bold", color: 'white' }});





