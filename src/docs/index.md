---
title: Overview, Status & Getting Started
menu:
  visible: false
---

# Current Status: <span class="text--danger">Alpha & Unstable.</span>

I'm building the site about Cushy Text with Cushy Text while I build Cushy 
Text. That's so ... meta. I'm doing my best to keep this documentation up-to-date
as I go from one breaking change to another. 

This is not yet ready for use. Feel free to poke around, but this needs a lot 
of finishing work before it's ready for prime time, regardless of how complete
things are starting to look.

## Installing 

For now, clone the repo. I'll have a `mod.ts` file and a generator to make some 
default content pages so that it works as a proper remote theme, but not until
a lot more stuff is finished.

Once you have the repo, 

```sh
$ deno task dev
```

This sets `LUME_DRAFTS` and starts the Lume local server.

```sh
$ deno task mock
```

This starts the _production_ server locally, on port 8000. If you edit the server
source, it will automatically reload itself, but _content will not auto-refresh
unless you're serving Lume in the background on port 3000 too. Use this for testing
changes to the production server, or redirects. It's not necessary for testing 
middleware.

## Current Focus

 - Blog / Tag archive pages need some love. I just created rough stubs.

 - Docs auto nav doesn't deal with nested directories very well. Also
   need some way to pass custom sidebar designs? thinking about it.

 - A long list of additional plugins, like the OG Image Generator 

 - I also need to finish the open dyslexic font switcher.

 - Make remote themes work with sparse initial content generated (two example 
   blog posts, three markdown document pages, one landing page). 

## Known Issues

 - Lume TOC plugins don't yet work with the new SSX flavor of MDX. I expect
   this to change before Lume3 is officially released.

 - Code highlighting plugins don't yet work with the new SSX flavor of MDX. Like
   the TOC issue, I expect this to be fixed before Lume3, so I'm not doing anything
   to work around it.

 - Lots of pages on this site are incomplete.

## Contributing

Feel free to email me at `timthepost@protonmail.com` if you'd like to collaborate, or open 
an issue or discussion on Github. 