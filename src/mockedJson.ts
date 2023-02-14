let mockedData = new Map<String, Array<Array<String>>>()

export function getData(filepath:String){
    if(mockedData.has(filepath)){
        return mockedData.get(filepath)!
    }
    else{
        return null
    }
}