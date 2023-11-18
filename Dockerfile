FROM node:lts-alpine3.14
EXPOSE 4000
USER node
WORKDIR /site
COPY --chown=node:node site/ /site/
RUN npm install
CMD [ "node", "--max-old-space-size=4096", "node_modules/hexo-cli/bin/hexo", "s" ]
