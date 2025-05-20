const LiteraryGroup = require("../models/literaryGroup");

exports.getAllLiteraryGroups = async (req, res) => {
  try {
    const result = await LiteraryGroup.find();
    if (result && result.length !== 0) {
      return res.status(200).send({
        msg: "LiteraryGroups found!",
        payload: result,
      });
    }
    res.status(404).send({ msg: "LiteraryGroups not found" });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getLiteraryGroupById = async (req, res) => {
  try {
    const result = await LiteraryGroup.findById(req.params.id);
    if (result) {
      return res.status(200).send({
        msg: "LiteraryGroup found",
        payload: result,
      });
    }
    res.status(404).send({ msg: "LiteraryGroup not found" });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.deleteLiteraryGroup = async (req, res) => {
  try {
    const result = await Period.findByIdAndDelete(req.params.id);
    if (result) {
      return res.status(200).send({
        msg: "LiteraryGroup deleted",
      });
    }
    res.status(500).send({ msg: "Something went wrong" });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateLiteraryGroup = async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      description: req.body.description,
      members: req.body.members,
    };
    const result = await Period.findByIdAndUpdate(req.params.id, data);
    if (result) {
      return res.status(200).send({
        msg: "LiteraryGroup updated",
        payload: result,
      });
    }
    res.status(500).send({
      msg: "LiteraryGroup was not updated",
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.createLiteraryGroup = async (req, res) => {
  try {
    const data = new LiteraryGroup({
      name: req.body.name,
      description: req.body.description,
      members: req.body.members,
    });
    const result = await data.save();
    if (result) {
      return res.status(201).send({
        msg: "LiteraryGroup created",
        payload: result,
      });
    }
    res.status(500).send({
      msg: "LiteraryGroup was not created",
    });
  } catch (error) {
    res.status(500).send(error);
  }
};
