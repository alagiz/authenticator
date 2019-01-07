FROM ruby:2.5.3

RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs && gem install bundler
RUN mkdir /api-gateway
WORKDIR /api-gateway

COPY Gemfile /api-gateway/Gemfile
COPY Gemfile.lock /api-gateway/Gemfile.lock

RUN bundle install

COPY . /api-gateway