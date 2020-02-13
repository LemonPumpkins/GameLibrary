if(process.env.NODE_ENV === "production"){
   module.exports={
    //mongo server connection
    mongoURI:"mongodb+srv://Lemon:Lemon@cluster0-zl3cf.mongodb.net/test?retryWrites=true&w=majority"
   }
}else{

    module.exports ={
        mongoURI:"mongodb://localhost:27017/gameentries"
    }

}
