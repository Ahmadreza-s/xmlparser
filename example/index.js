const ebcomXmlParser = require('../index');
const parser = ebcomXmlParser({throwErrorIfXmlNotValid: true, returnAttributeAsArray: true})

const xml = `<note>
<to>Tove</to>
<from>Jani</from>
<heading>Reminder</heading>
<body>Don't forget me this weekend!</body>
</note>`;

const json = parser.parse(xml);

console.log(JSON.stringify(json, null, 2));