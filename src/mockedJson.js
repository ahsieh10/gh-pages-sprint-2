let mockedData = new Map();
export function getData(filepath) {
    if (mockedData.has(filepath)) {
        return mockedData.get(filepath);
    }
    else {
        return null;
    }
}
