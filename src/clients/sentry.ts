import * as Sentry from "@sentry/node";

Sentry.init({
    dsn: "https://e45d0bfdd4163c1848aab0aa86cee360@o4505660636790784.ingest.sentry.io/4505660922265600",

    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
});

export default Sentry;
