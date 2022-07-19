#!/usr/bin/env node

// eslint-disable-next-line import/no-extraneous-dependencies
const ghpages = require('gh-pages');

const dir = 'dist';
ghpages.publish(dir, {
  repo: 'git@github.com:familyboat/examples.git',
  dest: 'web-component/wc-slider',
// eslint-disable-next-line no-console
}, (err) => {console.log(`building gh page has error: ${err}`)});
