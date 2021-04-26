/*
 *   Copyright (c) 2020 routerabfrage
 *   All rights reserved.
 *   https://github.com/routerabfrage/License
 */
// jshint esversion: 8
const config = require("../config.json");

module.exports = (client) => {
    console.log(`Logged in as ${client.user.tag}!`);

    client.on("ready", async () =>{
        console.log("Le Bot est allumé")
        client.user.setStatus("online")
        client.user.setActivity("AcruxRôleplay", {type: "PLAYING"} );
    });
};