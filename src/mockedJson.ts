let mockedParseData = new Map<string, Array<Array<string>>>()
let mockedQueryData = new Map<string, Array<Array<string>>>()


const file1 = [
    ["1", "2", "3", "4", "5"],
    ["The", "song", "remains", "the", "same."]
]

const oneColumnFile = [
    ["1"],
    ["2"],
    ["3"],
    ["4"],
]


mockedParseData.set("file1", file1)
mockedParseData.set("oneColumnFile", oneColumnFile)

export function getData(filepath:string){
    if(mockedParseData.has(filepath)){
        return mockedParseData.get(filepath)!
    }
    else{
        return null
    }
}

export function getSearch(column: string, value: string){
}