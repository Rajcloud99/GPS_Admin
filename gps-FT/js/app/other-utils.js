/**
 * Created by JA
 */

materialAdmin.factory('otherUtils', function () {
    let aGSTstates = [
        {"state": "Jammu and Kashmir", "first_two_txn": "01", "state_code": "JK"},
        {"state": "Himachal Pradesh", "first_two_txn": "02", "state_code": "HP"},
        {"state": "Punjab", "first_two_txn": "03", "state_code": "PB"},
        {"state": "Chandigarh", "first_two_txn": "04", "state_code": "CH"},
        {"state": "Uttarakhand", "first_two_txn": "05", "state_code": "UK"},
        {"state": "Haryana", "first_two_txn": "06", "state_code": "HR"},
        {"state": "Delhi", "first_two_txn": "07", "state_code": "DL"},
        {"state": "Rajasthan", "first_two_txn": "08", "state_code": "RJ"},
        {"state": "Uttar Pradesh", "first_two_txn": "09", "state_code": "UP"},
        {"state": "Bihar", "first_two_txn": "10", "state_code": "BH"},
        {"state": "Sikkim", "first_two_txn": "11", "state_code": "SK"},
        {"state": "Arunachal Pradesh", "first_two_txn": "12", "state_code": "AR"},
        {"state": "Nagaland", "first_two_txn": "13", "state_code": "NL"},
        {"state": "Manipur", "first_two_txn": "14", "state_code": "MN"},
        {"state": "Mizoram", "first_two_txn": "15", "state_code": "MI"},
        {"state": "Tripura", "first_two_txn": "16", "state_code": "TR"},
        {"state": "Meghalaya", "first_two_txn": "17", "state_code": "ME"},
        {"state": "Assam", "first_two_txn": "18", "state_code": "AS"},
        {"state": "West Bengal", "first_two_txn": "19", "state_code": "WB"},
        {"state": "Jharkhand", "first_two_txn": "20", "state_code": "JH"},
        {"state": "Odisha", "first_two_txn": "21", "state_code": "OR"},
        {"state": "Chattisgarh", "first_two_txn": "22", "state_code": "CT"},
        {"state": "Madhya Pradesh", "first_two_txn": "23", "state_code": "MP"},
        {"state": "Gujarat", "first_two_txn": "24", "state_code": "GJ"},
        {"state": "Daman and Diu", "first_two_txn": "25", "state_code": "DD"},
        {"state": "Dadra and Nagar Haveli", "first_two_txn": "26", "state_code": "DN"},
        {"state": "Maharashtra", "first_two_txn": "27", "state_code": "MH"},
        {"state": "Andhra Pradesh", "first_two_txn": "28", "state_code": "AP"},
        {"state": "Karnataka", "first_two_txn": "29", "state_code": "KA"},
        {"state": "Goa", "first_two_txn": "30", "state_code": "GA"},
        {"state": "Lakshadweep Islands", "first_two_txn": "31", "state_code": "LD"},
        {"state": "Kerala", "first_two_txn": "32", "state_code": "KL"},
        {"state": "Tamil Nadu", "first_two_txn": "33", "state_code": "TN"},
        {"state": "Pondicherry", "first_two_txn": "34", "state_code": "PY"},
        {"state": "Andaman and Nicobar Islands", "first_two_txn": "35", "state_code": "AN"},
        {"state": "Telangana", "first_two_txn": "36", "state_code": "TS"},
        {"state": "Andhra Pradesh (New)", "first_two_txn": "37", "state_code": "AD"},
        {"state": "Nepal", "first_two_txn": "00", "state_code": "Nepal"},
    ];

    let utils = {

        prepareQeuryParams: function (oQuery) {
            let sParam = oQuery.sort ? ("?sort=" + oQuery.sort) : "?sort=-1";
            for (let property in oQuery) {
                if (property!=="sort") {
                    sParam = sParam + "&" + property + "=" + oQuery[property];
                }
            }
            return sParam;
        },
        prepareQeury: function (oQuery) {
            let sParam = "?";
            for (let property in oQuery) {
                sParam = sParam + "&" + property + "=" + oQuery[property];
            }
            return sParam;
        },
        isEmptyObject: function isEmpty(obj) {
            for (let x in obj) {
                return false;
            }
            return true;
        },
        gstStateCode: function (shortStateCode) {
            let state_code;
            if (shortStateCode && typeof shortStateCode == "string") {
                for (let i = 0; i < aGSTstates.length; i++) {
                    if (shortStateCode.toUpperCase() == aGSTstates[i].state_code) {
                        state_code = aGSTstates[i].first_two_txn;
                    }
                }
            }
            return state_code;
        },
        getState: function () {

            return aGSTstates;
        },
        getKeyByValueInObject: function (value, oData) {
            let sKey;
            for (let key in oData) {
                if (oData[key] === value) {
                    sKey = key;
                }
            }
            return sKey;
        },
        hasAccess: function (allAccessData, toAccess, onKey) {
            let oAccess = allAccessData[toAccess];
            if (oAccess) {
                return oAccess ? oAccess[onKey] : false;
            } else {
                return false;
            }
        },
        parseOaddressToString: function (address) {
            let parsedAddress = "";
            if (address && (address.line1 || address.street_address)) {
                parsedAddress += (address.line1 || address.street_address + ", ");
            }
            if (address && address.line2) {
                parsedAddress += (address.line2 + ", ");
            }
            if (address && address.city) {
                if (address.district == address.city) {
                    delete address.district;
                }
                parsedAddress += (address.city + ", ");
            }
            if (address && address.district) {
                parsedAddress += (address.district + ", ");
            }
            if (address && address.state) {
                parsedAddress += (address.state + ", ");
            }
            if (address && address.pincode) {
                parsedAddress += (address.pincode + ", ");
            }
            if (address && address.country) {
                parsedAddress += address.country;
            }
            return parsedAddress;
        },

        getDD_MM_YYYY: function (date_) {
            let date;
            if (date_) {
                date = new Date(date_);
            } else {
                date = new Date();
            }
            let dMonth, dDate;
            if (date.getMonth() < 9) {
                dMonth = "0" + (date.getMonth() + 1).toString();
            } else {
                dMonth = (date.getMonth() + 1).toString();
            }
            if (date.getDate() < 10) {
                dDate = "0" + date.getDate().toString();
            } else {
                dDate = date.getDate().toString();
            }
            return dDate + "-" + dMonth + "-" + date.getFullYear().toString();
        },

        removeAngularObject: function (obj) {
            let newObj = {};

            for(let key in obj){
                if(obj.hasOwnProperty(key) && key[0] !== '$')
                    newObj[key] = obj[key];
            }

            return newObj;
        },

        removeAllFn: function (obj) {
            let newObj = {};

            for(let key in obj){
                if(obj.hasOwnProperty(key) && (typeof obj[key] !== 'function'))
                    newObj[key] = obj[key];
            }

            return newObj;
        },

        sanitizeObj: function (obj) {
            return this.removeAllFn(this.removeAngularObject(obj));
        },

        sanitizeAndAssign: function (obj,toAssign) {
            return Object.assign(obj, this.removeAllFn(this.removeAngularObject(toAssign)));
        },

        // receive an expression array and return and postfix converted array
        // return message string in case of something goes wrong
        infixToPostfixExpression: function(exp){

            if(!Array.isArray(exp))
                return false;

            let pofx=[], stack=['#'];
            // validation variable's
            let validator = 0,
                isInvalid = false,
                parenthesesCounter = 0;

            exp.forEach(function(str){

                if(isInvalid)
                    return;

                if(str == '('){
                    stack.push(str);
                    parenthesesCounter++;
                }else if(isOperand(str)){
                    pofx.push(str);
                    validator++;
                }else if(str == ')'){
                    while(stack[stack.length-1] != '('){
                        pofx.push(stack.pop());
                        if(!stack.length){
                            isInvalid = true;
                            break;
                        }
                    }
                    stack.pop();
                    parenthesesCounter--;
                }else{
                    while(isOperator(stack[stack.length-1]) >= isOperator(str) )
                        pofx.push(stack.pop());
                    stack.push(str);
                    validator--;
                }
            });

            while(stack[stack.length-1] != '#'){
                pofx.push(stack.pop());
                if(!stack.length){
                    isInvalid = true;
                    break;
                }
            }

            if(isInvalid || validator !== 1 || parenthesesCounter != 0)
                return false;

            return pofx;

            // helper function's

            // It check that the string is operator and return its priority else return false
            function isOperator(elem){
                switch(elem){
                    case '#': return 0;
                    case ')': return -1;
                    case '(': return 1;
                    case '+':
                    case '-': return 2;
                    case '*':
                    case '/': return 3;
                    default : return false;
                }
            }

            // all non-operator is operand
            function isOperand(elem){
                let val = isOperator(elem);
                if(typeof val === 'boolean' && !val){
                    return true;
                }else
                    return false;
            }
        }
    };

    return utils;
});

materialAdmin.factory('NumberUtil', function(){
    return {
        max: function(...param){
            return Math.max(...param);
        },
        ceil: function(num){

            num = Number(num);

            if(isNaN(num))
                return false;

            return Math.round(num);
        },
        toFixed: function (num) {
            num = typeof num == 'number' && num || 0;
            return Math.round(num * 100)/100;
        }
    };
});

materialAdmin.filter('NumberUtilFilter', ['NumberUtil', function(NumberUtil){
    return function(utilName, ...param){
        if(typeof NumberUtil[utilName] !== 'function')
            return false;
        return NumberUtil[utilName](...param);
    };
}]);

materialAdmin.factory('dateUtils', function () {

    let milliSec = 1000,
        sec = 1000 * 60,
        min = 1000 * 60 * 60,
        hour = 1000 * 60 * 60,
        day = 1000 * 60 * 60 * 24,
        month = 1000 * 60 * 60 * 24 * 30,
        year = 1000 * 60 * 60 * 24 * 30 * 12;

    return {
        add: add,
        calDays: calDays,
        toDateObj: toDateObj,
        addDate: addDate,
        setHours: setHours,
        setHoursFromDate: setHoursFromDate,
        setDate: setDate,
        calDetentionDays: calDetentionDays
    };

    function add(date, duration, str='days') {
        return moment(date).add(duration, str).toDate();
    }

    function calDays(toDate, fromDate) {

        if(!(toDate instanceof Date && fromDate instanceof Date))
            return false;

        toDate = setHours(toDate, 0, 0, 0);
        fromDate = setHours(fromDate, 0, 0, 0);

        if(!(toDate instanceof Date && fromDate instanceof Date))
            return 'Invalid Date';

        return Math.round((toDate - fromDate)/day);
    }

    function addDate(date, noOfDays) {
        date = date ? new Date(date) : new Date();

        noOfDays = noOfDays * day;

        return new Date(date.getTime() + noOfDays);

    }

    function toDateObj(str) {
        return new Date(str).toString() === "Invalid Date" ? undefined : new Date(str);
    }

    function setHours(date, hour, minutes, second){
        return new Date(new Date(date).setHours(hour, minutes, second))
    }

    function setHoursFromDate(setTodate, setFromDate){

        setTodate = setTodate ? new Date(setTodate) : new Date();
        setFromDate = setFromDate ? new Date(setFromDate) : new Date();

        return setHours(setTodate, setFromDate.getHours(), setFromDate.getMinutes(), setFromDate.getSeconds());
    }

    function setDate(date, fromat='DD/MM/YYYY') {
        return moment(date, fromat).toDate();
    }

    function calDetentionDays(toDate, fromDate) {

        if(!(toDate instanceof Date && fromDate instanceof Date))
            return false;
        let totday = (toDate - fromDate)/day;

        if(totday > 0 && totday <= 1)
            totday -= 1;

        return Math.floor(Math.abs(totday));
    }
});

materialAdmin.filter('otherUtilsFilt', ['otherUtils', function (otherUtils) {
    return function (utilName, ...param) {
        if(typeof otherUtils[utilName] != 'function')
            return false;

        return otherUtils[utilName](...param);
    }
}]);

materialAdmin.filter('dateUtilsFilt', ['dateUtils', function (dateUtils) {
    return function (utilName, ...param) {
        if(typeof dateUtils[utilName] != 'function')
            return false;

        return dateUtils[utilName](...param);
    }
}]);

materialAdmin.factory('objToCsv', function () {

    return function (ReportTitle, Header, JSONData) {
        //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
        var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

        var CSV = '';
        //Set Report title in first row or line

        if(ReportTitle)
            CSV += ReportTitle + '\r\n\n';

        //This condition will generate the Label/Header
        CSV += Header.join(',') + '\r\n';

        //1st loop is to extract each row
        arrData.forEach( a => {
            CSV += a.join(',') + '\r\n';
        });

        if (CSV == '') {
            return;
        }

        //Generate a file name
        var fileName = ReportTitle && (ReportTitle.replace(/ /g,"_")+"_"+moment().format("DD/MM/YYYY")) || moment().format("DD/MM/YYYY");

        //Initialize file format you want csv or xls
        var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

        // Now the little tricky part.
        // you can use either>> window.open(uri);
        // but this will not work in some browsers
        // or you will not get the correct file extension

        //this trick will generate a temp <a /> tag
        var link = document.createElement("a");
        link.href = uri;

        //set the visibility hidden so it will not effect on your web-layout
        link.style = "visibility:hidden";
        link.download = fileName + ".csv";

        //this part will append the anchor tag and remove it after automatic click
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    // 	$(document).ready(function(){
    // 		$('button').click(function(){
    // 			var data = $('#txt').val();
    // 			if(data == '')
    // 				return;
    //
    // 		});
    // 	});
    //
    // 	//function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel)
    // }

});


materialAdmin.filter('propsFilter', function () {
    return function (items, props) {
        let out = [];

        if (angular.isArray(items)) {
            items.forEach(function (item) {
                let itemMatches = false;

                let keys = Object.keys(props);
                for (let i = 0; i < keys.length; i++) {
                    let prop = keys[i];
                    let text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    }
});

materialAdmin.factory('clientConfig', function ($localStorage) {
    return {
        getFeatureValue: function (featureName, featureKey) {
            if ($localStorage && $localStorage.ft_data && $localStorage.ft_data.client_config && $localStorage.ft_data.client_config[featureName] && $localStorage.ft_data.client_config[featureName][featureKey]) {
                return $localStorage.ft_data.client_config[featureName][featureKey];
            }
        },
        getFeature: function (feature, featureKey) {
            if ($localStorage && $localStorage.ft_data && $localStorage.ft_data.configs && $localStorage.ft_data.configs[feature] && $localStorage.ft_data.configs[feature][featureKey]) {
                return $localStorage.ft_data.configs[feature][featureKey];
            }
        },
        getAcl: function (feature, featureKey) {
            if ($localStorage && $localStorage.ft_data && $localStorage.ft_data.access_control && $localStorage.ft_data.access_control[feature] && $localStorage.ft_data.access_control[feature][featureKey]) {
                return $localStorage.ft_data.access_control[feature][featureKey];
            }
        },
    };
});

/*
* UI Date Picker */
materialAdmin.factory('DatePicker', function () {

    let datePickerObj = {};

    // Default current date
    datePickerObj.newDate = new Date();
    // Open Date Picker
    datePickerObj.openDatePicker = openDatePicker;
    // Default DatePicker settings
    datePickerObj.dateSettings = {
        formatYear: 'yy',
        startingDay: 1
    };
    // Date picker Formats
    datePickerObj.formats = ['dd/MM/yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];

    return datePickerObj;

    function openDatePicker($this, $event, opened) {
        $event.preventDefault();
        $event.stopPropagation();
        opened += ' = true';
        $this.$eval(opened);
    }
});

/*
* Paginatin Default Object
* Pagination Object to control -
* Number of page to get from backend at a time
* Number of page to show user at a time
* Number of pages tab to show user at a time
* */
materialAdmin.factory('Pagination', function () {
    let pagination = {};
    pagination.currentPage = 1;
    pagination.maxSize = 3;
    pagination.items_per_page = 15;
    return pagination;
});

/*
* it convert array of string to string by concatenating all array value with delimiter between them
* Params : Array of string, delimiter
* returns: string*/
materialAdmin.filter('mergeString', function () {
    return function (input, delimiter=',') {

        let temp = [];

        Array.isArray(input) && input.map(function (value) {
            if (value)
                temp.push(value);
        });

        if (temp.length)
            temp = temp.join(delimiter);
        else
            temp = '';
        return temp;
    }
});

/*
* it convert Object to string by concatenating all keys with delimiter between them
* Params : Object, delimiter
* returns: string*/
materialAdmin.filter('formatAddress', function ($filter) {
    return function (input, delimiter) {

        if(input)
            return $filter('mergeString')([input.city,input.state,input.country], delimiter);
        else
            return '';
    }
});


/*
* it check which tax is applid on bill and add the tax on the given amount
* Params : Amount on which tax will be applied, an Object which contain CGST/SGST/IGST keys
* returns: calculated amount*/
materialAdmin.filter('applyTax', function () {
    return function (input, taxObj) {

        if (!input || !taxObj)
            return false;

        if(taxObj.iGST !== 0)
            return input + taxObj.iGST;
        else if(taxObj.cGST !== 0 && taxObj.sGST !== 0){
            return input + taxObj.cGST + taxObj.sGST;
        }else
            return input;
    }
});


/*
* it extract object element (form array of object) and transform it to array of string
* Params: Array of object, element to be extracted, returnString if element is not found in object*/
materialAdmin.filter('arrayOfObjectToArray', function () {
    return function (input, ele, returnFalseString) {
        if (Array.isArray(input))
            return input.map(obj => obj ? obj[ele]:[]);
        else
            return typeof returnFalseString !== 'undefined' ? returnFalseString : 'NA';
    };
});

materialAdmin.filter('filterUnique', function(){
    return function (input) {
        if (!Array.isArray(input))
            return false;

        let arr = [];
        return input.filter(str => {

            if(arr.indexOf(str) === -1){
                arr.push(str);
                return true;
            }

            return false;
        });
    }
});


materialAdmin.filter('arrayOfStringDate', function () {
    return function (input, ele, returnFalseString) {
        let returnDate;

        if(Array.isArray(input))
            returnDate = (input.map(o => moment(o.ele).format("DD-MM-YYYY")).join(' ,'));
        else if(input)
            returnDate = moment(input).format("DD-MM-YYYY");
        else
            returnDate = typeof returnFalseString !== 'undefined' ? returnFalseString : 'NA';

        return returnDate;
    };
});

materialAdmin.filter('arrayOfString', function () {
    return function (input, ele, returnFalseString) {
        let returnObj;

        if (Array.isArray(input))
            returnObj = (input.map(obj => obj[ele]) || []).filter( o => !!o).join(', ');
        else
            returnObj = typeof returnFalseString !== 'undefined' ? returnFalseString : 'NA';

        return returnObj;
    };
});

materialAdmin.filter('sumOfAllBillCharges', function () {
    return function (charges) {

        let sum = 0;
        for(let c in charges){
            if(['damage', 'advance'].indexOf(c) > -1)
                sum-=charges[c];
            else
                sum+=charges[c];
        }

        return sum;
    }
});

/*
* it extract object element (form array of object) and transform it to array of string
* Params: Array of object, element to be extracted, returnString if element is not found in object*/
materialAdmin.filter('arrayOfGrToString', function () {
    return function (input) {
        let returnObj;
        if (Array.isArray(input))
            returnObj = (input.map(obj => obj['grNumber']) || []).join(', ');
        else
            returnObj = typeof returnFalseString !== 'undefined' ? returnFalseString : 'NA';

        return returnObj;
    };
});


/*
* it filters array from an array based on single key
* Params: mainArray, mainArrayKey(string), arrayToFilter, arrayToFilterKey(string)
* return: Array
*/
materialAdmin.filter('filterArrayFromArray', function (
    $parse
) {
    return function (mainArray, mainArrayKey, arrayToFilter, arrayToFilterKey) {

        if (!Array.isArray(mainArray) || !Array.isArray(arrayToFilter))
            return [];

        return mainArray.filter(obj => {
            let flag = true;
            arrayToFilter.map(obj2 => {

                if(mainArrayKey && arrayToFilterKey && $parse(arrayToFilterKey)(obj2) === $parse(mainArrayKey)(obj))
                    flag = false;
                else if(mainArrayKey && $parse(mainArrayKey)(obj) === obj2)
                    flag = false;
                else if(arrayToFilterKey && $parse(arrayToFilterKey)(obj2) === obj)
                    flag = false;
                else if(obj === obj2)
                    flag = false;

            });

            return flag;
        });
    };
});

/*
* take input in date sting and convert it to date format
* */
materialAdmin.filter('stringToDate', function () {
    return function (input) {
        if (!input)
            return false;

        return (new Date(input));
    };
});


/*
* operation type => which of these operations ADD, UPDATE, SHOW
* Params: string(add, update, show), boolean
* return true/false
* it operates on ng-readonly
* for add it return false
* for update, if editable is true then it return true else it return false
* for show it return true
* */
materialAdmin.filter('operation', function () {
    return function (input, editable) {
        let returnObj;
        switch (input) {
            case 'add':
                returnObj = false;
                break;
            case 'update':
                returnObj = editable ? true : false;
                break;
            case 'show':
                returnObj = true;
                break;
            default:
                returnObj = true;
        }
        return returnObj;
    }
});

materialAdmin.filter('getNumber', function () {
    return function (input) {
        return (input > 0) ? (new Array(input).fill({text: 'hii'})) : [];
    }
});

/*
* return typeof
* and if second param is provided then it matches it and return bool
* */
materialAdmin.filter('typeOfFilter', function () {
    return function (input, type) {
        if (!type)
            return typeof input;

        if (typeof input === type)
            return true;
        else
            return false;
    }
});

/*
* return Formatted Vehicle number and its type : number(Type)
* */
materialAdmin.filter('getFormattedNumber', function () {
    return function (input) {
        if (!input || typeof input !== 'object' || !input[0])
            return false;

        return (input.map(obj => ' ' + obj.number + (obj.type_of_container ? ('(' + obj.type_of_container + ')') : ''))).join();
    }
});

/*
* it calculate sum of elements in array
* params: array, element(whose sum is to be calculated)
* return: sum
* condition: if 2nd param is missing then this filter assumes that the array is array of number
* 			else 2nd param is the key
* */
materialAdmin.filter('getArrayElementSum', function () {
    return function (input, element) {
        if (!input || typeof input !== 'object')
            return false;

        if(element)
            return (input || []).map(obj => (typeof obj[element] === 'number' ? obj[element] : 0)).reduce((a,b) => a+b ,0);
        else
            return input.reduce( (a,b) => {
                return (typeof a === 'number' ? a : 0) + (typeof b === 'number' ? b : 0);
            }, 0 );
    }
});


/*
* it check is all object have same key value pair or not
* */
materialAdmin.filter('doAllObjectHaveSameKeyValuePair', function () {
    return function (input, element) {
        if (!input || typeof input !== 'object')
            return false;

        return input.filter(obj => obj.element !== input[0].element).length == 0 ? true : false;
    }
});

/*
* it fixed decimal to 2 decimal places
* */
materialAdmin.filter('roundOff', function () {
    return function (input, str = 0) {
        if (typeof input !== 'number')
            return str;

        return (Math.round(input * 100) / 100) || 0;
    }
});

materialAdmin.filter('toString', function () {
    return function (input) {
        if(!input)
            return false;
        return input.toString();
    }
});

/*
* mathematical ops
* */
materialAdmin.filter('subtract', function () {
    return function (input1,input2) {
        if (typeof input1 !== 'number'|| typeof input2 !== 'number')
            return false;

        return (input1-input2) > 0 ? (input1-input2) : '0';
    }
});


/*
* subtract from current date
* */
materialAdmin.filter('subtractCurrentDate', function () {
    return function (input) {
        if (!input)
            return false;

        return (new Date()).getTime() - input;
    }
});


materialAdmin.filter('numberToWords', function () {
    return function (input) {

        if (!input)
            return false;

        let junkVal = input;
        junkVal = Math.floor(junkVal);
        let obStr = new String(junkVal);
        numReversed = obStr.split("");
        actnumber = numReversed.reverse();

        if (Number(junkVal) >= 0) {
            //do nothing
        }
        else {
            alert('wrong Number cannot be converted');
            return false;
        }
        if (Number(junkVal) == 0) {
            document.getElementById('container').innerHTML = obStr + '' + 'Rupees Zero Only';
            return false;
        }
        if (actnumber.length > 9) {
            alert('Oops!!!! the Number is too big to covertes');
            return false;
        }

        let iWords = ["Zero", " One", " Two", " Three", " Four", " Five", " Six", " Seven", " Eight", " Nine"];
        let ePlace = ['Ten', ' Eleven', ' Twelve', ' Thirteen', ' Fourteen', ' Fifteen', ' Sixteen', ' Seventeen', ' Eighteen', ' Nineteen'];
        let tensPlace = ['dummy', ' Ten', ' Twenty', ' Thirty', ' Forty', ' Fifty', ' Sixty', ' Seventy', ' Eighty', ' Ninety'];

        let iWordsLength = numReversed.length;
        let totalWords = "";
        let inWords = new Array();
        let finalWord = "";
        j = 0;
        for (i = 0; i < iWordsLength; i++) {
            switch (i) {
                case 0:
                    if (actnumber[i] == 0 || actnumber[i + 1] == 1) {
                        inWords[j] = '';
                    }
                    else {
                        inWords[j] = iWords[actnumber[i]];
                    }
                    inWords[j] = inWords[j] + ' Only';
                    break;
                case 1:
                    tens_complication();
                    break;
                case 2:
                    if (actnumber[i] == 0) {
                        inWords[j] = '';
                    }
                    else if (actnumber[i - 1] != 0 && actnumber[i - 2] != 0) {
                        inWords[j] = iWords[actnumber[i]] + ' Hundred and';
                    }
                    else {
                        inWords[j] = iWords[actnumber[i]] + ' Hundred';
                    }
                    break;
                case 3:
                    if (actnumber[i] == 0 || actnumber[i + 1] == 1) {
                        inWords[j] = '';
                    }
                    else {
                        inWords[j] = iWords[actnumber[i]];
                    }
                    if (actnumber[i + 1] != 0 || actnumber[i] > 0) {
                        inWords[j] = inWords[j] + " Thousand";
                    }
                    break;
                case 4:
                    tens_complication();
                    break;
                case 5:
                    if (actnumber[i] == 0 || actnumber[i + 1] == 1) {
                        inWords[j] = '';
                    }
                    else {
                        inWords[j] = iWords[actnumber[i]];
                    }
                    if (actnumber[i + 1] != 0 || actnumber[i] > 0) {
                        inWords[j] = inWords[j] + " Lakh";
                    }
                    break;
                case 6:
                    tens_complication();
                    break;
                case 7:
                    if (actnumber[i] == 0 || actnumber[i + 1] == 1) {
                        inWords[j] = '';
                    }
                    else {
                        inWords[j] = iWords[actnumber[i]];
                    }
                    inWords[j] = inWords[j] + " Crore";
                    break;
                case 8:
                    tens_complication();
                    break;
                default:
                    break;
            }
            j++;
        }

        function tens_complication() {
            if (actnumber[i] == 0) {
                inWords[j] = '';
            }
            else if (actnumber[i] == 1) {
                inWords[j] = ePlace[actnumber[i - 1]];
            }
            else {
                inWords[j] = tensPlace[actnumber[i]];
            }
        }

        inWords.reverse();
        for (i = 0; i < inWords.length; i++) {
            finalWord += inWords[i];
        }

        return finalWord;
    }
});

/*
* return Fright on the basis of Booking Object
* param: Booking Object as input
* */
materialAdmin.filter('calculateFright', function () {
    return function (input) {
        if (!input)
            return false;

        switch (input.payment_basis) {
            case "PMT":
                return input.rate * input.total_weight;
                break;

            case "PUnit":
                return input.rate * input.total_no_of_units;
                break;

            case "Fixed":
                return input.rate;
                break;

            case "Fixed per Trip/Fixed per Booking":
                return input.rate;
                break;

            default:
                return false;
        }
    }
});
//
// materialAdmin.filter('jaFilter', function () {
// 	return function (input, arrToRemove) {
//
// 	}
// });

/*
* return Max Date on the basis of Date and Month
* param: Date, Month(number)
* */
materialAdmin.filter('setMaxDate', function () {
    return function (date, month) {
        if(!!Number(month) && !!date)
            return new Date(new Date(date).setMonth(new Date(date).getMonth() + Number(month)));
        return undefined;
    }
});

materialAdmin.filter('setMinDate', function () {
    return function (date, month) {
        if(!!Number(month) && !!date)
            return new Date(new Date(date).setMonth(new Date(date).getMonth() - Number(month)));
        return undefined;
    }
});


/*
* return
* param:
* */
materialAdmin.filter('filterRoute', function () {
    return function (aRoute) {
        if(!aRoute)
            return false;
        return aRoute.map( obj => {
            return obj.name + (obj.route_distance_text ? ('('+ obj.route_distance_text+')') : '');
        });
    }
});


materialAdmin.filter('calHourMin', function () {
    return function (duration) {
        if(!duration)
            return '';

        let string = '';
        if(duration>=1)
            string+=((parseInt(duration))+'Hr ');
        if(duration%1>0)
            string+=((parseInt((duration%1)*60))+'Min');

        return string;
    }
});

materialAdmin.filter('calHourMinfromSecs', function () {
    return function (duration) {
        if(!duration)
            return '';

        let string = '';
        if(duration>=3600)
            string+=((parseInt(duration/3600))+'Hr ');
        if(duration%3600>0)
            string+=((parseInt((duration%3600)/60))+'Min');

        return string;
    }
});

materialAdmin.filter('preferredVehicleFormat',function(){
    return function(input){
        if(!input)
            return 'NA';

        return  input.name + (input.group_name ? '(' + input.group_name +')' : '' ) ;
    };
});

materialAdmin.filter('formatNearestConsignor',function(utils){
    return function(input){
        if(!input || !input.gpsData || !input.nearestConsignor)
            return 'NA';

        return  utils.getDistanceInKm(input.gpsData.lat,input.gpsData.lng,input.nearestConsignor.lat,input.nearestConsignor.lng).toFixed(2)+' from '
            +input.nearestConsignor.name;
    };
});

/*
* return parsed data
* param: obj and parseString
* */
materialAdmin.filter('parseTableData', [function (
    $parse
) {
    return function (obj, parseString, scope) {
        if(!obj)
            return false;

        if(parseString)
            return scope.$eval(parseString);
        else
            return scope.$parent.$index+1;
    }
}]);

/*
* return Boolean
* param: number
* */
materialAdmin.filter('isFloat', [function () {
    return function (n) {
        if(!n)
            return false;

        return Number(n) === n && n % 1 !== 0;
    }
}]);

/*
* return Boolean
* param: number
* */
materialAdmin.filter('isNumber', [function () {
    return function (n) {
        if(!n)
            return false;

        return Number(n) === n && n % 1 !== 0;
    }
}]);

/*
* return: Trust as html content
* param: string
* */
materialAdmin.filter('trustAsHtml', [ '$sce', function (
    $sce
) {
    return function (s) {
        if(!s)
            return false;

        return $sce.trustAsHtml(s);
    }
}]);

/*
* return: Boolean
* param: any Type
* */
materialAdmin.filter('toBoolean', [ function () {
    return function (value, format=false) {
        return format ? !!value ? 'Yes' : 'No' : !!value;
    }
}]);


/*
* return: Halt Time in Day,Hr,Min
* param:
* object
* */
materialAdmin.filter('timeDuration',function(utils){
    return function(input){
        if(!input || !input.gpsData)
            return 'NA';

        let haltTime =  utils.calTimeDiffCurrentToLastInDHM(input.gpsData.location_time);
        if(input && input.last_known && !input.last_known.haltTime){
            input.last_known.haltTime = haltTime;
        }
        return haltTime;
    };
});

materialAdmin.filter('delayPerformance', function(){
    return function(input){

        if(input > 70)
            return 'Worst';
        else if(input > 50)
            return 'Not Ok';
        else if(input > 30)
            return 'Bad';
        else if(input > 15)
            return 'Good';
        else
            return 'Excellent';
    };
});

materialAdmin.filter('validateFormArray', function () {
    return function (formData, arr=[], length=0) {

        for(let i=0;i<length;i++){
            for(let k in arr){
                let strIndex = arr[k]+`[${i}]`;
                if(!formData[strIndex] || formData[strIndex].$invalid)
                    return true;
            }
        }

        return false;
    }
});

//handle undefine
materialAdmin.filter('hdlUdf', function(){
    return function(input, value){
        if(typeof input === 'undefined')
            return value;
        return input;
    };
});

// formula evaluater
materialAdmin.filter('formulaEvaluate', function(){
    return function(aFormula=[], scope, formName){

        let str = '',
            index=-1;

        aFormula.forEach( s => {
            let temp;

            if(s === '+' || s === '*' || s === '/' || s ==='-' || s === '(' || s === ')')
                str += s;
            else if(typeof s === 'number')
                str += s;
            else if((index = s.indexOf('(RC)'))+1){
                let key = s.slice(0, index);
                str += scope.invoice['rateChart' + key[0].toUpperCase() + key.slice(1)];
            }else
            if((temp = $(`form[name="${formName}"]`).find(`input[name="${s}"]`).attr('ng-model')))
                str += temp;
        });

        try{
            return scope.$eval(str);
        }catch (e) {
            return 0;
            console.log(e);
        }
    };
});

// Gr Charges sum
materialAdmin.filter('sumOfObject', function(){
    return function(charges = {}){

        if(!charges || typeof charges != 'object')
            return;

        let sum = 0;

        for(let c in charges){
            sum+=charges[c] || 0;
        }

        return sum;
    };
});

// Gr Charges sum
materialAdmin.filter('sumOfGrChargesWithTax', function(){
    return function(charges = {}, formList){

        if(!charges || typeof charges != 'object')
            return;

        let sum = 0;

        for(let c in charges){
            if(charges.hasOwnProperty(c) && !(formList && formList[c] && formList[c].notApplyTax))
                sum+=charges[c] || 0;
        }

        return sum;
    };
});

materialAdmin.filter('sumOfGrChargesWithoutTax', function(){
    return function(charges = {}, formList){

        if(!charges || typeof charges != 'object' || typeof formList != "object")
            return;

        let sum = 0;

        for(let c in charges){
            if(charges.hasOwnProperty(c) && formList && formList[c] && formList[c].notApplyTax)
                sum+=charges[c] || 0;
        }

        return sum;
    };
});

// object key sum
materialAdmin.filter('sumObjKey', function(){
    return function(obj = {}, key){

        if(!obj || !key)
            return 0;

        let sum = 0;

        for(let k in obj){
            if(obj.hasOwnProperty(k))
                sum+=(obj[k][key] || 0);
        }

        return sum;
    };
});

// filter array from multriple object
materialAdmin.filter('filterArrayFromObj', function(){
    return function(arr, key, obj){

        if(!arr || !key || !obj)
            return [];

        return arr.filter(o => !(obj[o[key]] && obj[o[key]].typ));
    };
});

// Check is input instanse of date
materialAdmin.filter('dateInstanse', function(){
    return function(input){

        return (input instanceof Date);
    };
});

materialAdmin.filter('filterSettleType', [
    'filterArrayFromArrayFilter',
    function(
        filterArrayFromArrayFilter
    ){
        return function(aSettle, oTrip, aExpense){

            if(!aSettle.length || !oTrip)
                return [];

            let arrToRem = [...(oTrip.trip_expenses || []).map(o => ({type: o.type}))];
            arrToRem.push(...aExpense.filter(o => o.trip_id === oTrip._id).map(o => ({type: o.type})));
            if(!arrToRem.length)
                return aSettle;

            return filterArrayFromArrayFilter(aSettle, 'name', arrToRem, 'type');
        };
    }]);

materialAdmin.filter('fetchClientAllowed', [
    function(){
        return function(scope, aClientR){

            if(!(aClientR && aClientR.length))
                return false;

            return scope.$configs.client_allowed.filter(o => aClientR.indexOf(o.clientId)+1).map(o => o.name).join(', ');
        };
    }]);

materialAdmin.filter('templateExtract', [
    function(){
        return function($scope, oBill, type){

            let billTemplate;

            if(type === 'bill'){
                if(!oBill.items[0].gr._id)
                    return [];

                let gr = oBill.items[0].gr;

                if (gr.billingParty && gr.billingParty.billTemplate && gr.billingParty.billTemplate.length)
                    billTemplate = gr.billingParty.billTemplate;
                else if (gr.customer && gr.customer.billTemplate && gr.customer.billTemplate.length)
                    billTemplate = gr.customer.billTemplate;
                else
                    billTemplate = $scope.$configs['Bill'] && $scope.$configs['Bill']['Bill Templates'] || [];
            }else if(type == 'cover note'){
                billTemplate = (oBill.billingParty && oBill.billingParty.billTemplate || []);

                (oBill.customer && oBill.customer.billTemplate || []).reduce((arr, oTemplate) => {
                    if(!arr.find(o => o.key === oTemplate.key))
                        arr.push(oTemplate);
                    return arr;
                }, billTemplate);
            }

            return (billTemplate || []).filter(function (o){
                if(type === 'bill')
                    return !o.type || o.type === 'bill';
                else
                    return o.type === type;
            });
        };
    }]);

