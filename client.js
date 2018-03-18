#!/usr/bin/env node

const program = require('commander');
const { prompt } = require('inquirer');
const TorrentSearchApi = require('torrent-search-api');

const torrentSearch = new TorrentSearchApi();
torrentSearch.enableProvider('1337x');

program
    .version('0.0.1')
    .description('Torrent search client');

program
    .command('search [options] <query>')
    .alias('s')
    .description('search for torrents')
    .option('-c --category <category>', 'Which search category to use')
    .option('-l --limit <limit>', 'Maximum Number of returned results')
    .action((query, options) => {
        var category = options.category || "All";
        var limit = options.limit || '20';
        torrentSearch.search(query, category, limit)
            .then(torrents => {
                console.table(torrents);
            })
            .catch(err => {
                console.log(err);
            });
    });

program
    .command('getProviderList')
    .alias('l')
    .description('List providers')
    .action(() => {
        //getProviderList();
        // Get providers
        console.table(torrentSearch.getProviders());
    });

program.parse(process.argv)