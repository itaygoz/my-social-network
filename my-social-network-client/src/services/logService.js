

function init() {
    // Sentry.init({ dsn: "https://c2cb02d72e0e4ba38b0c5f74cdd68344@o428823.ingest.sentry.io/5374589" });
}

function log(error) {
    // Sentry.captureException(error);
    console.error(error);
}

export default {
    init, log
};