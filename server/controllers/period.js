const Period = require("../models/periods");

exports.getAllPeriods = async (req, res) => {
  try {
    const result = await Period.find();
    if (result && result.length !== 0) {
      return res.status(200).send({
        msg: "Periods found!",
        payload: result,
      });
    }
    res.status(404).send({ msg: "Periods not found" });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getPeriodById = async (req, res) => {
  try {
    const result = await Period.findById(req.params.id);
    if (result) {
      return res.status(200).send({
        msg: "Period found",
        payload: result,
      });
    }
    res.status(404).send({ msg: "Period not found" });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.deletePeriod = async (req, res) => {
  try {
    const result = await Period.findByIdAndDelete(req.params.id);
    if (result) {
      return res.status(200).send({
        msg: "Period deleted",
      });
    }
    res.status(500).send({ msg: "Something went wrong" });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updatePeriod = async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      years: req.body.years,
      characteristics: req.body.color,
    };
    const result = await Period.findByIdAndUpdate(req.params.id, data);
    if (result) {
      return res.status(200).send({
        msg: "Period updated",
        payload: result,
      });
    }
    res.status(500).send({
      msg: "Period was not updated",
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.createPeriod = async (req, res) => {
  try {
    const data = new Period({
      name: req.body.name,
      years: req.body.years,
      characteristics: req.body.characteristics,
    });
    const result = await data.save();
    if (result) {
      return res.status(201).send({
        msg: "Period created",
        payload: result,
      });
    }
    res.status(500).send({
      msg: "Period was not created",
    });
  } catch (error) {
    res.status(500).send(error);
  }
};
