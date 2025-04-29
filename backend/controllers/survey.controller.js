const Survey = require('../models/survey');

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Content cannot be empty!'
    });
    return;
  }

  const survey = new Survey({
    title: req.body.title,
    description: req.body.description,
    questions: req.body.questions
  });

  Survey.create(survey, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the survey.'
      });
    } else {
      res.send(data);
    }
  });
};

exports.findAll = (req, res) => {
  Survey.getAll((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving surveys.'
      });
    } else {
      res.send(data);
    }
  });
};

exports.findOne = (req, res) => {
  Survey.getById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Survey with id ${req.params.id} not found.`
        });
      } else {
        res.status(500).send({
          message: `Error retrieving survey with id ${req.params.id}`
        });
      }
    } else {
      res.send(data);
    }
  });
};

exports.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Content cannot be empty!'
    });
    return;
  }

  Survey.update(req.params.id, req.body, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Survey with id ${req.params.id} not found.`
        });
      } else {
        res.status(500).send({
          message: `Error updating survey with id ${req.params.id}`
        });
      }
    } else {
      res.send(data);
    }
  });
};

exports.delete = (req, res) => {
  Survey.delete(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Survey with id ${req.params.id} not found.`
        });
      } else {
        res.status(500).send({
          message: `Error deleting survey with id ${req.params.id}`
        });
      }
    } else {
      res.send({ message: 'Survey was deleted successfully!' });
    }
  });
}; 