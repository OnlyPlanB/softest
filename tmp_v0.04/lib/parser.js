const queue = require('../utils/queue');
const error = require('../utils/error');
const common = require('../utils/common');
const sender = require('./sender');
const statement = require('./statement');
const event = require('./event');

/**
 * Check the coordinates of the callback information.
 * 
 * @param {object} info - Callback information for `click` event.
 */
function checkCoordinates(info) {
  if (info.x < 0 || info.y < 0) {
    throw error.coordinatesParam;
  }
}

/**
 * Determine if the click is valid click.
 * 
 * If click on some non-jumpable elements (like `<p>xxx</p>`), it is an invalid click.
 * If the click belongs to the click (target_blank) or click (target_self) operation,
 * it is a valid click.
 * 
 * @param {puppeteer.Page} page - The current page.
 * @param {object} info - Callback information for `click` event.
 */
async function isInvalidClick(page, info) {
  // Make `click` event wait `URLChange` event, see also annotate of `bindURLChangeListener`.
  // The waiting time is different depending on the network environment.
  // 动态配置参数：慢：60000；良好：~=4000；本地：<1000
  let flag = await queue.eventValidClick.dequeueBlocking(page, 1500);
  console.log('👏', flag);
  console.log('👏', info.targetName);

  // Condition 1: See also annotate of `initAllQueue`.
  // Condition 2: Invalid click when the flag is -1.
  if ((flag != -1 && info.targetName == 'LI') || (flag == -1)) {
    return true;
  }
  return false;
}

/**
 * Determine if the `ClickTargetSelf` event.
 * 
 * @param {puppeteer.Page} page - The current page.
 */
async function isClickTargetSelf(page) {
  console.log('原来长度:', queue.eventClickTargetSelf.length());
  let flag = await queue.eventClickTargetSelf.dequeueBlocking(page, 500);
  console.log('剩下长度:', queue.eventClickTargetSelf.length());
  console.log('👺', flag);
  if (flag == -1) {
    return false;
  }
  return true
}

/**
 * Parse the statement of puppeteer.
 * 
 * @param {puppeteer.Page} page - The current page.
 * @param {object} info - Callback information for `click` event.
 * @return {string} The statement of puppeteer.
 */
async function parseClick(page, info) {
  queue.eventClickTargetSelfOldPage.enqueue(page._target._targetInfo.url);

  checkCoordinates(info);

  if ((await isInvalidClick(page, info))) {
    return;
  }

  // return to `bindURLChangeListener` if the click is a 'ClickTargetSelf` event
  if ((await isClickTargetSelf(page))) {
    console.log('===> info send ', info);
    // Determined to be a click (target_self) operation and send callback information into queue.
    queue.eventClickTargetSelfCoordinates.enqueue(info);

    // If it is a ClickTargetSelf event, the original document will be destroyed,
    // and the following operation of parsing the XPath can no longer be run.Instead,
    // it should jump back to bindURLChangeListener to resolve the XPath.
    // See also annotate of `bindURLChangeListener`.
    return;
  }

  // parse `clickTargetBlank` event (operation 2 of `newTab` event)
  const stmt = await parseClickTargetBlank(page, info);
  await sender.sendData(stmt);

  // roolback
  queue.eventClickTargetSelfOldPage.dequeue();
}

/** 
 * Parse the statement corresponding to the `clickTargetBlank` event.
 * 
 * @param {puppeteer.Page} page - The current page.
 * @param {object} info - Callback information for `click` event.
 * @return {string} The statement of `clickTargetBlank` event.
 */
async function parseClickTargetBlank(page, info) {
  const xpath = await common.getXPathByElement(page, info);
  console.log('XPath: ', xpath);
  const ctb = new statement.ClickTargetBlank(event.clickTargetBlank);
  const stmt = ctb.getStatement(xpath, info);
  return stmt;
}

/**
 * Parse the statement corresponding to the `clickTargetSelf` event.
 * 
 * @param {puppeteer.Page} page - The current page.
 * @param {object} info - Callback information for `click` event.
 * @return {string} The statement of `clickTargetSelf` event.
 */
async function parseClickTargetSelf(page, info) {
  const xpath = await common.getXPathByElement(page, info);
  console.log('XPath: ', xpath);
  const cts = new statement.ClickTargetSelf(event.clickTargetSelf);
  const stmt = cts.getStatement(xpath, info);
  return stmt;
}

/**
 * Parse the statement corresponding to the `newTab` event.
 * 
 * @return {string} The statement of `newTab` event.
 */
function parseNewTab() {
  const nt = new statement.NewTab(event.newTab);
  const stmt = nt.getStatement();
  return stmt;
}

/**
 * Parse the statement corresponding to the `URLChange` event (operation 2 or operation 3).
 * 
 * @param {string} url - The target url.
 * @return {string} The statement of `URLChange` event.
 */
function parseURLChange(url) {
  const uc = new statement.URLChange(event.URLChange);
  const stmt = uc.getStatement(url);
  return stmt;
}

/**
 * Parse the statement corresponding to the `closeTab` event.
 * 
 * @return {string} The statement of `closeTab` event.
 */
function parseCloseTab() {
  const ct = new statement.CloseTab(event.closeTab);
  const stmt = ct.getStatement();
  return stmt;
}

module.exports = {
  parseClick,
  parseClickTargetSelf,
  parseNewTab,
  parseCloseTab,
  parseURLChange,
}