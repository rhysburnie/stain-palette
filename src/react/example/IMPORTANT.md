# Ignore these files pretty much

> Revisit later maybe?...
> Keeps as ref for testing techniques in ava

I'm a bit iffy on this. Although tests pass I think there is
something not quite right because when I tried dropping the
example/PaletteStainsTable into another project (using stain-palette
as dependency) it didn't work as expected.

Although, at the time I was building it with rollup so that may have
been affecting it.

In either case I think I will simply just use the following in my
personal project (which was always the intention)
and see if any issues arise in real life usage.

* Palette
* react/PaletteProvider
* react/PaletteHOC
