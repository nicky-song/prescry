FROM mhart/alpine-node:14
ARG TEST=false
ARG CI=false

ENV USER=local
ENV NODE_PATH=/node_modules
ENV PATH=$PATH:/node_modules/.bin:/node_modules/prescryptive-ux-common/node_modules/.bin
ENV NODE_OPTIONS=--max_old_space_size=8000

# add git

RUN apk update && apk upgrade && apk add --no-cache git=2.24.3-r0

# api install (will also create symlink to ../common, under ./node_modules/prescryptive-ux-common)
WORKDIR /var/src/common
COPY ./packages/common ./
RUN if [ "$CI" = "true" ] ; then yarn setup:ci; else yarn setup; fi
RUN yarn build

# common test
WORKDIR /var/src/common
RUN mkdir -p ./.jest
RUN if [ "$TEST" = "true" ] ; then yarn test; fi

