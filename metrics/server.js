

// Init
const Prometheus = require('prom-client')
const httpRequestDurationMicroseconds = new Prometheus.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['route'],
  // buckets for response time from 0.1ms to 500ms
  buckets: [0.10, 5, 15, 50, 100, 200, 300, 400, 500]
})

//We need to collect the response time after each request and report it with the route label.

// After each response
httpRequestDurationMicroseconds
  .labels(req.route.path)
  .observe(responseTimeInMs)

//We can register a route a GET /metrics endpoint to expose our metrics in the right format for Prometheus .

// Metrics endpoint
app.get('/metrics', (req, res) => {
  res.set('Content-Type', Prometheus.register.contentType)
  res.end(Prometheus.register.metrics())
})

