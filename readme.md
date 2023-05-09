# Flakiness Dashboard
## **Description**
A simple dashboard to visualise E2E test flakiness using jobs' data from SauceLabs.

Project is built with:
- ReactJS Typescript ([Create React App](https://create-react-app.dev/)).
- [pnpm](https://pnpm.io/) as package manager.
- [TailwindCSS](https://tailwindcss.com/) for styling.

## **Setup**
### **Environment variables** ###

- Copy `.env.example` to `.env`.
- Make sure all **required** variables have values.

### **Dependencies**
Install required dependencies:
```
pnpm install
```
### **Start local server**
```
pmpm start
```

## **Data**
Data is fetched from SauceLabs using their [public APIs](https://docs.saucelabs.com/dev/api/).

**API entrypoint**: `https://api.eu-central-1.saucelabs.com`

### **Endpoints**
The endpoints are setup as environment variables.
Refer to [.env.example](.env.example).

- Test cases: `/v2/insights/rdc/test-cases`
- Builds: `/v2/builds/rdc` (not yet documented in SauceLabs docs)
- Jobs: `/v1/rdc/jobs`

Refer to SauceLabs' [APIs Docs](https://docs.saucelabs.com/dev/api/).

### **Test data**

Test data (`json`) is available for testing on local environments:
- [testcases.json](src/api/testcases.json)
- [builds.json](src/api/builds.json)
- [jobs.json](src/api/jobs.json)

Set `REACT_APP_API_ENV` environment variable to `LOCAL` to use the test data instead of the SauceLabs' API.

