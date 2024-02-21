export class NumberUtility {
    static comma(value: number | null): string {
        if(!value) return "0"

        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    static pyung(value: number): number {
        return Math.round(value / 3.3)
    }

    static won(_num: number, defaultUnit: number = 10000): string {
        var inputNumber = _num * defaultUnit
        var unitWords = ['', '만', '억', '조', '경']
        var splitUnit = 10000
        var splitCount = unitWords.length
        var resultArray: any[] = []
        var resultString = ''

        for (var i = 0; i < splitCount; i++) {
            var unitResult = (inputNumber % Math.pow(splitUnit, i + 1)) / Math.pow(splitUnit, i)
            unitResult = Math.floor(unitResult)
            if (unitResult > 0) {
                resultArray[i] = unitResult
            }
        }

        for (var i = 0; i < resultArray.length; i++) {
            if (!resultArray[i]) continue
            
            resultString = `${String(resultArray[i].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))}${unitWords[i]}${resultString ? ` ${resultString}` : ''}`
        }

        return resultString;
    }
}