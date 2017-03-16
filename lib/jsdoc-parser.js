const lex = (content) => {
    const rules = {
        block: /\/\*\*\s+([\s\S]*?)\s+\*\//g,
        infoline: /^-+$/,
        type: /^@(class|method|event)\s+(.+?)(?:\s+(.+?))?$/,
        method: /^(.+?)\((.*)\)$/,
        map: /^@(extends|version)\s+(.+?)$/,
        flag: /^@(public|private|static|override|ignore|deprecated)$/,
        param: /^@param\s+\{(.+?)(?:=(.*?))?\}\s+(.+?)(?:\s+(.+?))?$/,
        return: /^@return\s+\{(.+?)\}\s+(.+?)(?:\s+(.+?))?$/,
        property: /^@property\s+\{(.+?)\}\s+(.+?)(?:\s+(.+?))?$/,
        author: /^@author\s+(.+?)$/,
    };

    const tokens = [];
    let cap;
    while ((cap = rules.block.exec(content))) {
        const token = {
            type: null,
            params: [],
            return: null,
            properties: [],
        };
        const lines = cap[1].split('\n');
        lines.forEach((line) => {
            line = line.replace(/^\s*\*\s*/, '').replace(/\s*$/, '');

            let cap2;

            // Type
            if (rules.infoline.exec(line))
                token.type = 'info';

            if ((cap2 = rules.type.exec(line))) {
                token.type = cap2[1];
                token.name = cap2[2];
                token.lowerName = token.name[0].toLowerCase() + token.name.slice(1);
                token.description = cap2[3];

                if (token.type === 'method') {
                    const match = token.name.match(rules.method);

                    if (match) {
                        token.name = match[1];
                        token.body = match[2].replace(/,/g, ', ');
                    }
                }
            }

            if ((cap2 = rules.map.exec(line)))
                token[cap2[1]] = cap2[2];

            if ((cap2 = rules.flag.exec(line)))
                token[cap2[1]] = true;

            if ((cap2 = rules.param.exec(line))) {
                token.params.push({
                    name: cap2[3].replace(/^options\./, ''),
                    type: cap2[1].replace(/\|/g, '<br>'),
                    default: cap2[2],
                    description: cap2[4],
                });
            }

            if ((cap2 = rules.return.exec(line))) {
                token.return = {
                    name: cap2[2],
                    type: cap2[1].replace(/\|/g, '<br>'),
                    description: cap2[3],
                };
            }

            if ((cap2 = rules.property.exec(line))) {
                token.properties.push({
                    name: cap2[2],
                    type: cap2[1].replace(/\|/g, '<br>'),
                    description: cap2[3],
                });
            }
        });

        if (token.type)
            tokens.push(token);
    }

    return tokens;
};

const parse = (content) => {
    const tokens = lex(content);
    const data = {
        class: null,
        methods: [],
        staticMethods: [],
        inheritedMethods: [],
        events: [],
        inheritedEvents: [],
    };

    tokens.forEach((token) => {
        if (token.type === 'class' && !data.class)
            data.class = token;
        else if (token.type === 'method' && token.public && !token.static && !token.inherited)
            data.methods.push(token);
        else if (token.type === 'method' && token.public && token.static && !token.inherited)
            data.staticMethods.push(token);
        else if (token.type === 'method' && token.public && token.inherited) {
            data.inheritedMethods.push(token);

            if (data.methods.some((method) => method.name === token.name))
                token.overridden = true;
        } else if (token.type === 'event' && !token.inherited)
            data.events.push(token);
        else if (token.type === 'event' && token.inherited) {
            data.inheritedEvents.push(token);

            if (data.events.some((event) => event.name === token.name))
                token.overridden = true;
        }
    });

    return data;
};

exports.parse = parse;
