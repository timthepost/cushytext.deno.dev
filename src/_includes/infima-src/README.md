# Infima Source (PostCSS)

Right now, we're not just directly compiling the Infima `.scss` source files to
minified output as part of generation. That's a work-in-progress.

Right now, the site is using a regular build of Infima from the latest head
located in this directory, along with unminified versions of the helper scripts
while in development.

Be careful of making changes to the compiled output, especially if it's any
vendor code. Most people won't need to. But if you do need to change things in a
way you can't just override in style.css, edit the source files and run a build:

```sh
yarn install
yarn build
```

You can then grab the output in `dist/` (it has to be manually copied for right
now).

## TODO: Just generate from source all the time

We should just be able to go from source to compiled but un-minified (dev) and
compiled, minified and stripped of unused classes (prod). That's the goal.

It will probably be achieved in smaller incremental steps that make the
integration less hacky each time.
