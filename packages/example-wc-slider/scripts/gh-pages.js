#!/usr/bin/env node

// eslint-disable-next-line import/no-extraneous-dependencies
const ghpages = require('gh-pages');

const dir = 'dist';
ghpages.publish(dir, {
  repo: 'git@github.com:familyboat/web-component-example.git',
  dest: 'examples/wc-slider',
});
