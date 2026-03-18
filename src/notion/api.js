// Handles interactions with the Notion API with the help of the official Notion SDK. This includes fetching page content, updating blocks, etc.

// TODO add more API functions as needed (e.g. updateBlock, createBlock, etc.)

const notion = require('./client');

async function getAllChildren(blockId) {
    const blocks = [];
    let cursor = undefined;
    do {
        const res = await notion.blocks.children.list({
        block_id: blockId,
        start_cursor: cursor,
        page_size: 100
        });

        blocks.push(...res.results);
        cursor = res.has_more ? res.next_cursor : undefined;
    } while (cursor);

    return blocks;
}

module.exports = {
    getAllChildren
};