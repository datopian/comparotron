Comparotron: a simple way to visualize and share comparisons.

## Intro

Comparotron allows users to quickly create simple comparative visualizations.

There are already many graphing and apps out there so what's different about comparotron? 

The essence of the idea is simplicity and the power (and freedom) of constraints: comparotron is *only* about comparisons and limits you to just one or two numbers. That's it. No more, no less. We think that this constraint is powerful -- and fun! And lends itself to quick, creative story-telling.

As pictures 📷 are worth a thousand words let's dive in with some mockups that give a sense of the idea.

### The first mockup of the idea (by David McCandless) in 2010

The first mockup of the idea (by David McCandless) done for the [Where Does My Money Go][wdmmg] project (2010)

![](https://f.cloud.github.com/assets/180658/750549/198722d0-e4d0-11e2-8a57-998f68acfeaf.png)

### New mockups created as part of Open Data Day 2020

This is all real data by the way!

![](https://datahub.io/static/img/blog/comparotron-v0.2-march-2020-coronavirus-vs-flu.svg)

![](https://datahub.io/static/img/blog/comparotron-v0.2-march-2020-military-vs-aid.svg)

 ## History

The concept originated in 2010 as part of [Where Does My Money Go][wdmmg] when looking for ways to present government spending effectively. Giving a real sense of this kind of data can be hard because of the size, variety and abstractness of the figures -- what does $3bn of aid spending really *mean*?

Introducing comparison can help provide context, tangibility and "meaning". For example, we can compare aid spending to other spending items  such as spending on the military which will given a relative sense to the aid number.

Or, alternatively, we could compare aid expenditure to some external more "every-day" figure; for example, the cost of a loaf of bread of a teacher's salary yielding a comparison like "aid spending is equivalent to employing 10,000 teachers for a year".

[wdmmg]: https://app.wheredoesmymoneygo.org/

## Getting to an MVP

A central part of the [original conception][original] was a rich experience for user's to find/select the data points they wanted to use. This made sense if you already had a database of government spending data. Even when I moved away from this idea to allow all kinds of numeric data (in comparotron v0.1 in 2012), this assumption continued to inform the approach and I spent most of my effort on the functionality and UX for searching for and selecting data ptoints (indeed, I spent plenty oof time wondering about where data would be stored and come from e.g. would it be in elastic search, where would I source GDP per capita from etc).

[original]: https://github.com/datopian/comparotron/issues/1

But thinking about this, we can simplify a lot:

* Simplication 1: we can assume the user will find the data points and enter that info themselves => no need for fancy search or data sourcing
* Simplication 2: that still leaves us with an editor (and backend) for people to create "compares" ... but what about just using static website tech and storing this in markdown+frontmapper => no need for an editor, backend or APIs -- just use your text editor, markdown files and git(hub) as backend

Thanks to MVP approach we're gradually moving from building a complex 🚗 to making a much more manageable 🛹 Yeah 👌

### Essential user flows

What are the essential user flows? There are just two:

* **Create**: create a "compare" by entering one or more "factoids" (plus a title)
* **Show**: display the comparison in a beautiful and elegant way

MVP approach to these:

* **Create**: use a simple markdown file with frontmatter, edit it in a text editor, and push it to github (Even simpler: hand-craft this in a drawing app!)
* **Show**: let's use a static site generator to build the site and some basic JS (or even CSS) for the visualization
