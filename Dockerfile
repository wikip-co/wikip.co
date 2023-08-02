FROM node:lts-alpine3.14
WORKDIR /site
COPY site/package.json /site
COPY site/_config.yml /site
COPY site/source/_data /site/source/_data
COPY site/source/_posts /site/source/_posts
COPY site/themes /site/themes
RUN npm install
CMD [ "node", "--max-old-space-size=4096", "node_modules/hexo-cli/bin/hexo", "s" ]
EXPOSE 4000
