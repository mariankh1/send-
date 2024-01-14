const storage = require('../storage');
const { statDeleteEvent } = require('../amplitude');

module.exports = async function(req, res) {
  try {
    const id = req.params.id;
    const meta = req.meta;
    const ttl = await storage.ttl(id);
    await storage.kill(id);
    res.sendStatus(200);
    statDeleteEvent({
      id,
      ip: req.ip,
      country: req.geo.country,
      state: req.geo.state,
      owner: meta.owner,
      download_count: meta.dl,
      ttl,
      agent: req.ua.browser.name || req.ua.ua.substring(0, 6)
    });
  } catch (e) {
    res.sendStatus(404);
  }
};
