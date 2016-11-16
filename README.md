# HackNova Backend

A MyMLH Hackathon backend

&nbsp;

#### What is HackNova?

A super cool High School Hackathon.

#### What is this project?

A backend for said Hackathon

## Features

* Slack Notifications on signups (must enable)
* E-Mails via SendGrid (must enable)
* Web Dashboard (see [hacknova/admin](https://github.com/hacknova/admin))
* MyMLH Integration (by default ;))
* Sentry Error Reporting (must enable)

## Setup

### yarn

```bash
yarn
```

### npm

```bash
npm install
```

Modify the config, and run ArangoDB. There will be a docker-compose file soon.

## Setting up SendGrid

First get an account from SendGrid, then grab the API Key (from LINK). Create a template
for each scenario in the config, then publish the template id. Then done!

## Setting up Slack

This on is super easy, just grab a webhook URL from slack and place it into the config,
the backend will handle the rest!

## Setting up Sentry

This is really only needed for developers, so instructions too come...

### What's yarn.lock?

Instead of using npm (which still works) we use yarn which is 10000x faster (at least so it feels)
yarn.lock is used by yarn to isolate versions, urls, etc. We keep it to make sure
the yarn installs are fast as possible.

## License

MIT
