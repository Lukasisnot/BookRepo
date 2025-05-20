const Author = require("../models/author");

// GET all authors
exports.getAllAuthors = async (req, res) => {
  try {
    const result = await Author.find().populate('literary_group').populate('period');
    if (result.length > 0) {
      return res.status(200).send({
        msg: "Authors found",
        payload: result,
      });
    }
    res.status(404).send({ msg: "No authors found" });
  } catch (error) {
    res.status(500).send(error);
  }
};

// GET author by ID
exports.getAuthorById = async (req, res) => {
  try {
    const result = await Author.findById(req.params.id).populate('literary_group').populate('period');
    if (result) {
      return res.status(200).send({
        msg: "Author found",
        payload: result,
      });
    }
    res.status(404).send({ msg: "Author not found" });
  } catch (error) {
    res.status(500).send(error);
  }
};

// DELETE author
exports.deleteAuthor = async (req, res) => {
  try {
    const result = await Author.findByIdAndDelete(req.params.id);
    if (result) {
      return res.status(200).send({ msg: "Author deleted" });
    }
    res.status(404).send({ msg: "Author not found" });
  } catch (error) {
    res.status(500).send(error);
  }
};

// UPDATE author
exports.updateAuthor = async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      information: req.body.information,
      nationality: req.body.nationality,
      literary_group: req.body.literary_group,
      period: req.body.period,
    };
    const result = await Author.findByIdAndUpdate(req.params.id, data, { new: true });
    if (result) {
      return res.status(200).send({
        msg: "Author updated",
        payload: result,
      });
    }
    res.status(404).send({ msg: "Author not found" });
  } catch (error) {
    res.status(500).send(error);
  }
};

// CREATE author
exports.createAuthor = async (req, res) => {
  try {
    const data = new Author({
      name: req.body.name,
      information: req.body.information,
      nationality: req.body.nationality,
      literary_group: req.body.literary_group,
      period: req.body.period,
    });

    const result = await data.save();
    if (result) {
      return res.status(201).send({
        msg: "Author created",
        payload: result,
      });
    }
    res.status(500).send({ msg: "Author was not created" });
  } catch (error) {
    res.status(500).send(error);
  }
};
