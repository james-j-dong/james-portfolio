---
title: Dropshipping Experience on Etsy
summary: Dropshipping on Etsy until I was banned.
---

## Overview

At the time, dropshipping was sort of the latest fad. Everyone was posting about it on tiktok and reels (at least for my feed) so I figured it was worth a shot. This is the story of how I automated dropshipping end-to-end with a chrome extension.

## Stack

- **App:** Vanilla React + Python FlaskAPI
- **Pipelines:** No async workers -> App was just for me so I ran everything locally
- **AI:** Used OpenAI's early gpt 3.5 model (it was rough)

## The Story

Dropshipping seemed to become exponentially popular after COVID 19. Just an educated guess, but people were probably stuck quarantined in their house and had nothing to do. When it came to making money without leaving the house, dropshipping because the obvious answer and online influencers pushed the idea of how great it was. I figured... why not?

### The first attempt

The v0 was painfully simple. I would find clothes that looked cool from aliexpress with feedback from my friend Chinmay who had superior taste in design. From aliexpress I would download and copy the images and descriptions and create a duplicate on Etsy with a ~5x markup. When someone made a purchase on my Etsy store, I would make a purchase on aliexpress and ship it directly to the customer's door. The end.

### Building the Dropship Engine

Within the first few sales, I knew I could automate the entire thing with software. Without going too deep into details these were the features:

1. Automatically create scrape/create Etsy product listing data given _only the aliexpress link_
   1. Python Flask app would fetch the aliexpress url and scrape title, description, and first 5 images with bs4
   2. OpenAI API gpt 3.5 would be used to generate a cleaner, formatted title, descriptions, and other SEO optimized text content.
   3. Images had backgrounds removed and a DIY Etsy shop logo imposed with PIL and rembg.
   4. Product listings on Etsy with a video had much better SEO rankings so basic sideshow like videos with transitions were automatically created with moviepy
2. Create and publish the actual Etsy listing
   1. Modifying Etsy listings is behind auth so a chrome extension was created to interact directly with the Etsy UI and automatically input all of the details of the product: title, description, materials, size, weight, color, skus, etc.
3. Periodically pull Etsy orders and fulfill automatically on aliexpress
   1. n8n webhook would watch for Etsy orders and ping my api with info on name address etc
   2. Purchase would be made with my own hardcoded credit card info

## The Result

I made 6 figures over two years and then got banned. Changing the background and adding my own logo only did so much but Etsy was really cracking down on dropshippers. Changing the text like the title and description to be specifically tuned for SEO keywords greatly pushed my listings to the top. This was my first dabble into chrome extensions where I first understood its potential power.

This was also where I first got comfortable with LLM based AI tools and really had to work through early on shortcomings. I essentially had to set up pseudo agents where a second LLM instance would check the output of the first one. That's just how inconsistent AI was.

This was my first **real win** in software on my own and really ignited my love for powerful software. Please message me at jamesdong00@gmail.com if you would like to know more, lets talk.
