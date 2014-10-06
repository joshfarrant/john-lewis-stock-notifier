# john-lewis-stock-notifier

A node.js script that checks the stock level of a particular item in [John Lewis' online store](http://www.johnlewis.com), and sends a notification via [Pushover](http://www.pushover.net) within minutes of that item becoming in stock.

## How It Works

The script utilizes a html tag present on every item's page in John Lewis' online store. This tag, ```data-jl-stock```, is set to the item's current stock level, which presumably is then parsed and used to display the stock level in a more readable format; *Out of stock* or *More than 10 in stock*, etc.

By getting this page every few minutes and locating that tag, we can check to see if the value assigned to that tag is greather than zero, and thus be immediately alerted via Pushover the moment that item becomes in stock.

## Dependencies

This script's dependencies ([request](https://www.npmjs.org/package/request), [cheerio](https://www.npmjs.org/package/cheerio)) can be found on npm, and are installed as follows:

```
npm install request cheerio
```

## Usage

Credentials and configuration variables are stored in a *config.json* file in the root of the project, and should be formatted as follows:

```
{
    "url" : "ITEM_URL",
    "pushover" : {
        "token" : "PUSHOVER_API_TOKEN",
        "group" : "PUSHOVER_GROUP_KEY"
    }
}
```

*NB: The ```PUSHOVER_GROUP_KEY``` can be substituted for a single user key without issue.*