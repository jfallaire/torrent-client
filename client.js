#!/usr/bin/env node

const cTable = require('console.table');
const program = require('commander');
const { prompt } = require('inquirer');
const _ = require('underscore');
const TorrentSearchApi = require('torrent-search-api');



const torrentSearch = new TorrentSearchApi();
torrentSearch.enableProvider('1337x');

program
    .version('0.0.1')
    .description('Torrent search client');

program
    .command('search <query>')
    .alias('s')
    .description('search for torrents')
    .option('-c, --category [category]', 'Which search category to use')
    .option('-l, --limit [limit]', 'Maximum Number of returned results')
    .option('-m, --magnet', 'Add magnet url to returned results')
    .action((query, options) => {
        var category = options.category || "All";
        var limit = options.limit || '20';
        torrentSearch.search(query, category, limit)
            .then(torrents => {
                var magnetPromises = [];
                _.each(torrents, (t, idx) => {
                    torrents[idx] = _.omit(t, ['desc', 'provider']);
                    if (options.magnet) {
                        magnetPromises.push(torrentSearch.getMagnet(t))
                    }
                });

                Promise.all(magnetPromises).then(magnets => {
                    _.each(magnets, (m, idx) => {
                        torrents[idx].magnet = m;
                    });
                    console.table(torrents);
                });

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