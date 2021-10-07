const defaultOptions = {throwErrorIfXmlNotValid: false, returnAttributeAsArray: false}

/**
 * sanitize xml and returning sanitized xml as string
 * @param {string} xml
 * @return {string}
 */

function sanitizeXml(xml) {
    //remove comments and other stuff
    return xml.replace(/(\r\n|\n|\r|\t)/gm, "").replace(/<!--.[^(><.)]*-->/g, '').replace('>\s*<', '><').replace(new RegExp(/>\s*</, 'g'), '><');
}

/**
 * validate given xml
 * @param {string} xml
 * @return {Boolean}
 */

function isXmlValid(xml) {
    //very simple yet powerful function that validate xml for us :D
    //feel free to add any logic that u wish to perform validation on given xml
    return xml.split('<').length === xml.split('>').length;
}


/**
 * create an instance of parser with options
 * @param {Object} options
 * @return {Object}
 */
function index(options = defaultOptions) {
    function getAttributesAsObject(tag) {
        if (!tag || !tag.includes('='))
            return options.returnAttributeAsArray ? [] : {};
        const regex = new RegExp('[\\s\\r\\t\\n]*([a-z0-9\\-_:]+)[\\s\\r\\t\\n]*=[\\s\\r\\t\\n]*([\'"])((?:\\\\\\2|(?!\\2).)*)\\2', 'ig');
        let obj = {};
        let match = true;
        const rootTag = tag.substring(0, tag.indexOf('>'))
        while ((match = regex.exec(rootTag))) {
            obj[match[1]] = match[3];
        }
        if (!options.returnAttributeAsArray)
            return obj;
        return Object.entries(obj).map(([key, value]) => ({key, value})) || [];
    }


    function processXml(xml) {
        //tag name should be in [1] index if it's a normal tag (ex: <tag>value</tag> )
        //tag name should be in [3] index if it's a singleton tag (ex: <tag /> )
        if (!xml) return null;
        const splitted = [...xml.matchAll(/<([\w:\\.]*)(?:\s[^>]*)*>((?:(?!<\1).)*)<\/\1>|<([\w:\\.]+)([\s\r\t\n]*([a-z0-9\-_]+)[\s\r\t\n]*=[\s\r\t\n]*(?<qoute>['"])((?:\\\k<qoute>|(?!\k<qoute>).)*)\k<qoute>)*\s*\/>/gm)];
        if (splitted.length === 1) {
            const res = splitted[0];
            const obj = {
                key: res[1] || res[3],
                attributes: getAttributesAsObject(res[0]),
            };
            if (res[2])
                if (res[2].includes('<'))
                    obj.value = processXml(res[2])
                else obj.value = res[2];
            else obj.value = null;
            return obj;
        } else if (splitted.length > 1) {
            return splitted.map(res => processXml(res[0]))
        }
        return null;
    }

    /**
     * parse xml to json object based on given options
     * @param {string} xml
     * @return {Object}
     */
    function parse(xml) {
        if (isXmlValid(xml)) {
            const sanitizedXml = sanitizeXml(xml);
            return processXml(sanitizedXml);
        } else {
            //xml is not valid !!
            if (options.throwErrorIfXmlNotValid)
                throw Error('xml is not valid !!');
            else return null;
        }
    }

    return {
        parse
    }
}


module.exports = index;
module.exports = Object.assign(module.exports,{
    sanitizeXml,
    isXmlValid
})