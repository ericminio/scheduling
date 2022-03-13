[![Build Status](https://github.com/ericminio/yop-scheduling/actions/workflows/ci.yml/badge.svg)](https://github.com/ericminio/yop-scheduling/actions/workflows/ci.yml)


# Working Sofware

https://yop-scheduling.herokuapp.com

# About

[Vision](about/1.vision.feature)

# Run the tests

Make sure `geckodriver` is in your PATH

```
docker-compose up -d database
cd app
npm install
npm test
```

# Node version

Keep in sync `.nvmrc` and `Dockerfile`
