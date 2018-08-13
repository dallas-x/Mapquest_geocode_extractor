const htmlparser = require("htmlparser2"),
    axios = require('axios'),
    fs = require('fs'),
    path = require('path'),
    filePath = path.join(__dirname, 'map.html'),
    writePath = path.join(__dirname, 'results.txt');

// Downloads html page
function extractHTML(mapQuestLink) {
    return new Promise((resolve, reject) => {
        try {
            axios({
                    method: 'get',
                    url: mapQuestLink,
                    responseType: 'stream'
                })
                .then((response) => {
                    const makeFile = response.data.pipe(fs.createWriteStream(filePath).on('close', _ => {
                        resolve('success');
                    }));

                })
                .catch((err) => {
                    throw(err);
                })
        } catch (error) {

        }
    })
}

// Looks for RouteData, extracts and returns the GeoCodes
function parseHTML() {
    return new Promise((resolve, reject) => {
        const listOfCords = [];
        let html = fs.readFileSync(filePath, {
            encoding: 'utf-8'
        });
        let newData = '';
        let routeData = false;
        let parser = new htmlparser.Parser({
            onopentag: function (name, attribs) {
                if (attribs.id == "RouteData") {
                    routeData = true;
                }
            },
            ontext: function (text) {
                if (routeData) {
                    newData += text;
                }
            },
            onclosetag: function (tagname) {
                if (routeData) {
                    routeData = false;
                    const mapJson = JSON.parse(newData);
                    const legs = mapJson.route.legs;
                    let writeStream = fs.createWriteStream(writePath);
                    legs.forEach((el) => {
                        let maneuvers = el.maneuvers
                        maneuvers.forEach((e) => {
                            listOfCords.push(`lat: ${e.startPoint.lat}, long: ${e.startPoint.lng}`)
                        });
                    });
                    resolve(listOfCords);
                }
            }
        }, {
            decodeEntities: true
        });
        parser.write(html);
    });

}

module.exports = { extractHTML, parseHTML };
