---
title: On latency
date: 2026-04-01
tags: [performance, ux]
summary: A short note on why p99 feels slower than p50 suggests.
---

Latency is not an average. It's a distribution — and humans notice the tail, not the middle.

## The cheap version

If your p50 is 80ms and your p99 is 1200ms, most people experience your product as "fast most of the time, occasionally broken." They'll describe it as the second one.

```
p50  ####
p90  ########
p99  ########################
```

## What to do

- Measure the tail, not just the mean.
- Make slow paths visible in the UI (spinners, skeletons) so the user sees work happening.
- Cut allocations in the hot path before reaching for caches.

More at [Gil Tene's talk on latency](https://www.infoq.com/presentations/latency-pitfalls/).
