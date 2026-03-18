// Initializes the Notion client using the official Notion SDK and exports it for use in other modules.

// TODO add alternative token loading methods (e.g. config file, command line arg)

const { Client } = require('@notionhq/client');
require('dotenv').config();

// Initialize a Notion client
const notionToken = process.env.NOTION_TOKEN;
if (!notionToken) {
    throw new Error('NOTION_TOKEN is not defined in environment variables');
}

const client = new Client({
    auth: notionToken,
});

module.exports = client;