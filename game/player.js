let { Card } = require('./deck');

class Player {
  constructor() {
    this.score = [];
    this.hand = [];
  }

  addCard(card) {
    this.hand.push(card);
  }

  reset() {
    this.score = [];
    this.hand = [];
  }

  hand() {
    return this.hand;
  }

  get scoreHand() {
    this.score = [];
    let scoreNoAce = 0;
    let scoreAce = 0;

    this.hand.map((card) => {
      let val = card.value;

      if (val === 'J' || val === 'Q' || val === 'K') {
        scoreNoAce += 10;
      } else if (val !== 'A') {
        scoreNoAce += parseInt(val);
      }
    });

    scoreAce = scoreNoAce;

    this.hand.map((card) => {
      let val = card.value;

      if (val === 'A') {
        scoreNoAce += 1;
        scoreAce += 11;
      }
    });

    if (scoreNoAce === scoreAce) {
      this.score.push(scoreNoAce);
    } else {
      this.score.push(scoreNoAce);
      if (scoreAce <= 21) {
        this.score.push(scoreAce);
      }
    }

    return this.score;
  }
}

module.exports = {
  Player: Player,
};
