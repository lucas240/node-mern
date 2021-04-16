const WilderModel = require("../models/Wilder");
const createError = require("http-errors");

module.exports = {
  create: async (req, res, next) => {
    await WilderModel.init();
    const wilder = new WilderModel(req.body);
    const result = await wilder.save();
    res.json({ success: true, result });
  },
  read: async (req, res) => {
    const result = await WilderModel.find();
    res.json({ success: true, result });
  },
  update: async (req, res) => {
    const result = await WilderModel.updateOne({ _id: req.body._id }, req.body);
    if (result.nModified === 0) throw createError(400, `Id not found`);
    res.json({ success: true, result });
  },
  delete: (req, res) => {
    WilderModel.deleteOne({ _id: req.body._id })
      .then((result) => {
        if (!result)
          res.json({
            success: false,
            result: "No result with such ID was found",
          });
        res.json({ success: true, result });
      })
      .catch((err) => {
        res.json({ success: false, err });
      });
  },
};
