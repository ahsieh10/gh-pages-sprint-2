let mockedData = new Map<String, Array<Array<string>>>()

export function getData(filepath:String){
    if(mockedData.has(filepath)){
        return mockedData.get(filepath)!
    }
    else{
        return null
    }
}