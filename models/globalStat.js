const mongoose = require('mongoose');

const globalStatSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  gamesPlayed: {
    type: Number,
  },
});

const globalStat = mongoose.model('globalStat', globalStatSchema);

module.exports = globalStat;
