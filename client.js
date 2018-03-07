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
  .command('search <query>')
  .alias('s')
  .description('search for torrents')
  .action((query) => {
	torrentSearch.search(query, 'Movies', 20)
     	.then(torrents => {
         	console.log(torrents);
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
	console.log(torrentSearch.getProviders());
  });

program.parse(process.argv)
