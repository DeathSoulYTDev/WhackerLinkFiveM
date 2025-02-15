/*
* WhackerLink - WhackerLinkFiveM
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*
* Copyright (C) 2024 Caleb, K4PHP
*
*/

const fs = require('fs');
const yaml = require('js-yaml');

let config;
let codeplugs = {};
let sites;

loadConfig();
displayStartupMessage();
loadCodeplugs();
loadSitesConfig();

on('playerConnecting', () => {
    let wholeConfig = [];
    wholeConfig.sites = sites;
    emitNet('receiveSitesConfig', source, wholeConfig);
});

on('playerDropped', () => {
    // console.debug(`A player has left the server: ${reason}`);
});

onNet('getSitesConfig', () => {
    // console.debug(`Player ${source} requested sites config.`);

    let wholeConfig = {};
    wholeConfig.config = config;
    wholeConfig.sites = sites;
    emitNet('receiveSitesConfig', source, wholeConfig);
});

function loadConfig() {
    try {
        const fileContents = fs.readFileSync( GetResourcePath(GetCurrentResourceName()) + '/configs/config.yml', 'utf8');
        config = yaml.load(fileContents);
        // console.debug('config loaded:', config);
    } catch (e) {
        console.error('Error loading sites config:', e);
    }
}

function loadCodeplugs() {
    try {
        const codeplugDir = GetResourcePath(GetCurrentResourceName()) + '/codeplugs/';
        // const modelsDir = GetResourcePath(GetCurrentResourceName()) + '/client/ui/models/';

        fs.readdirSync(codeplugDir).forEach(file => {
            if (file.endsWith('.yml')) {
                const codeplugName = file.slice(0, -4);
                const fileContents = fs.readFileSync(codeplugDir + file, 'utf8');
                codeplugs[codeplugName] = yaml.load(fileContents);
            }
        });
        // console.debug('Codeplugs loaded:', Object.keys(codeplugs));
    } catch (e) {
        console.error('Error loading codeplugs:', e);
    }
}

function loadSitesConfig() {
    try {
        let path = "/configs/sites.yml";

        if (isDev() && fs.existsSync(GetResourcePath(GetCurrentResourceName()) + "/configs/sites_rox.yml")) {
            path = "/configs/sites_rox.yml";
            console.log("Used dev sites file!");
        }

        const fileContents = fs.readFileSync( GetResourcePath(GetCurrentResourceName()) + path, 'utf8');
        sites = yaml.load(fileContents).sites;
        // console.debug('Sites config loaded:', sites);
    } catch (e) {
        console.error('Error loading sites config:', e);
    }
}

function isDev() {
    return fs.existsSync( GetResourcePath(GetCurrentResourceName()) + '/.dev');
}

RegisterCommand('set_codeplug', (source, args) => {
    const codeplugName = args[0];
    // console.debug(codeplugs[codeplugName])
    if (codeplugs[codeplugName]) {
        // console.debug(`Setting codeplug for player ${source}: ${codeplugName}`);
        emitNet('receiveCodeplug', source, codeplugs[codeplugName]);
    } else {
        console.log(`Codeplug not found: ${codeplugName}`);
    }
}, false);

function displayStartupMessage() {
    console.log('============================================================');
    console.log('==                                                        ==');
    console.log('==                   WhackerLinkFiveM                     ==');
    console.log('==             Author: Caleb, K4PHP (_php_)               ==');
    console.log('==             GitHub: https://github.com/WhackerLink     ==');
    console.log('==                                                        ==');
    console.log('============================================================');

    console.log("WhackerLinkFiveM - FiveM client/interface for WhackerLinkServer\n" +
        "Copyright (C) 2024-2025 Caleb, K4PHP and WhackerLink contributors\n" +
        "This program comes with ABSOLUTELY NO WARRANTY\n" +
        "This is free software, and you are welcome to redistribute it\n" +
        "under certain conditions; Check the included LICENSE file for more details.\n");
}