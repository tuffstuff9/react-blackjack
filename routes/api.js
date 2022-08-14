const express = require('express');
const router = express.Router();
let { Deck, Card } = require('../game/deck');
let { Player } = require('../game/player');

// Model
const User = require('../models/User');
const globalStat = require('../models/globalStat');

// Game Setup
let deck = new Deck();
let player = new Player();
let dealer = new Player();
let card = null;
let dealerReveal = null;

function resetGame() {
  deck = new Deck();
  deck.shuffle();

  player = new Player();
  dealer = new Player();

  let card = deck.deal();
  dealer.addCard(card);

  card = deck.deal();
  player.addCard(card);

  card = deck.deal();
  dealerReveal = card;

  card = deck.deal();
  player.addCard(card);
}

router.get('/startgame', (req, res) => {
  resetGame();
  globalStat.findOne({ _id: '6267a2f5b5ff4bd819e610bb' }).then((stat) => {
    stat.gamesPlayed += 1;
    stat.save();
  });
  res.json({
    playerScore: player.scoreHand,
    playerHand: player.hand,
    dealerScore: dealer.scoreHand,
    dealerHand: dealer.hand,
  });
});

router.get('/hit', (req, res) => {
  if (player.scoreHand.length === 2) {
    if (player.scoreHand[0] < 21) {
      card = deck.deal();
      player.addCard(card);
      // playerScore.textContent = 'Player Score: '.concat(player.scoreHand);

      if (player.scoreHand[0] > 21) {
        res.json({
          playerBusted: true,
          playerScore: player.scoreHand,
          playerHand: player.hand,
        });

        // dealerArea.removeChild(dealerArea.children[1]);
        // dealer.addCard(dealerReveal);
        // createCard(dealerReveal.suit, dealerReveal.value, dealerArea);
        if (dealer.scoreHand.length === 2) {
          // dealerScore.textContent = 'Dealer Score: '
          //   .concat(dealer.scoreHand[1])
          //   .concat(' --- DEALER WINS!');
        } else {
          // dealerScore.textContent = 'Dealer Score: '
          //   .concat(dealer.scoreHand)
          //   .concat(' --- DEALER WINS!');
        }
      } else {
        res.json({
          playerScore: player.scoreHand,
          playerHand: player.hand,
        });
      }
    } else {
      res.send('error');
    }
  } else {
    if (player.scoreHand < 21) {
      card = deck.deal();
      player.addCard(card);
      // playerScore.textContent = 'Player Score: '.concat(player.scoreHand);

      if (player.scoreHand > 21) {
        res.json({
          playerBusted: true,
          playerScore: player.scoreHand,
          playerHand: player.hand,
        });

        // dealerArea.removeChild(dealerArea.children[1]);
        // dealer.addCard(dealerReveal);
        // createCard(dealerReveal.suit, dealerReveal.value, dealerArea);
        if (dealer.scoreHand.length === 2) {
          // dealerScore.textContent = 'Dealer Score: '
          //   .concat(dealer.scoreHand[1])
          //   .concat(' --- DEALER WINS!');
        } else {
          // dealerScore.textContent = 'Dealer Score: '
          //   .concat(dealer.scoreHand)
          //   .concat(' --- DEALER WINS!');
        }
      } else {
        res.json({
          playerScore: player.scoreHand,
          playerHand: player.hand,
        });
      }
    } else {
      res.send('error');
    }
  }
});

router.get('/stand', (req, res) => {
  dealer.addCard(dealerReveal);

  while (dealer.scoreHand[0] < 17) {
    card = deck.deal();
    dealer.addCard(card);
  }

  // if (dealer.scoreHand.length === 2 && player.scoreHand.length === 2) {
  // } else if (dealer.scoreHand.length === 2) {
  // } else if (player.scoreHand.length === 2) {
  // }

  if (dealer.scoreHand > 21) {
    console.log('test 1');
    res.json({
      dealerBusted: true,
      dealerScore: dealer.scoreHand,
      dealerHand: dealer.hand,
    });
  } else {
    if (player.scoreHand.length === 2) {
      console.log('test 2');
      if (dealer.scoreHand.length === 2) {
        console.log('test 3');
        if (dealer.scoreHand[1] > player.scoreHand[1]) {
          console.log('test 4');
          res.json({
            winner: 'dealer',
            dealerScore: dealer.scoreHand,
            dealerHand: dealer.hand,
          });
        } else if (dealer.scoreHand[1] < player.scoreHand[1]) {
          console.log('test 5');
          res.json({
            winner: 'player',
            dealerScore: dealer.scoreHand,
            dealerHand: dealer.hand,
          });
        } else if (dealer.scoreHand[1] === player.scoreHand[1]) {
          console.log('test 6');
          res.json({
            winner: 'tie',
            dealerScore: dealer.scoreHand,
            dealerHand: dealer.hand,
          });
        } else {
          console.log('test 7');
        }
      } else if (dealer.scoreHand > player.scoreHand[1]) {
        console.log('test 9');
        res.json({
          winner: 'dealer',
          dealerScore: dealer.scoreHand,
          dealerHand: dealer.hand,
        });
      } else if (dealer.scoreHand < player.scoreHand[1]) {
        console.log('test 10');
        res.json({
          winner: 'player',
          dealerScore: dealer.scoreHand,
          dealerHand: dealer.hand,
        });
      } else if (dealer.scoreHand === player.scoreHand[1]) {
        console.log('test 11');
        res.json({
          winner: 'tie',
          dealerScore: dealer.scoreHand,
          dealerHand: dealer.hand,
        });
      }
    } else if (dealer.scoreHand.length === 2) {
      console.log('test 12');
      if (dealer.scoreHand[1] > player.scoreHand) {
        console.log('test 13');
        res.json({
          winner: 'dealer',
          dealerScore: dealer.scoreHand,
          dealerHand: dealer.hand,
        });
      } else if (dealer.scoreHand[1] < player.scoreHand) {
        console.log('test 14');
        res.json({
          winner: 'player',
          dealerScore: dealer.scoreHand,
          dealerHand: dealer.hand,
        });
      } else if (dealer.scoreHand[1] === player.scoreHand) {
        console.log('test 15');
        res.json({
          winner: 'tie',
          dealerScore: dealer.scoreHand,
          dealerHand: dealer.hand,
        });
      } else {
        console.log('test 16');
      }
    } else {
      if (dealer.scoreHand > player.scoreHand) {
        console.log('test 17');
        res.json({
          winner: 'dealer',
          dealerScore: dealer.scoreHand,
          dealerHand: dealer.hand,
        });
      } else if (dealer.scoreHand < player.scoreHand) {
        console.log('test 18');
        res.json({
          winner: 'player',
          dealerScore: dealer.scoreHand,
          dealerHand: dealer.hand,
        });
      } else if (dealer.scoreHand === player.scoreHand) {
        console.log('test 19');
        res.json({
          winner: 'tie',
          dealerScore: dealer.scoreHand,
          dealerHand: dealer.hand,
        });
      } else {
        res.json({
          winner: 'tie',
          dealerScore: dealer.scoreHand,
          dealerHand: dealer.hand,
        });
      }
    }
  }
});

router.get('/stats', (req, res) => {
  globalStat.findOne({ _id: '6267a2f5b5ff4bd819e610bb' }).then((stat) => {
    res.json(stat.gamesPlayed);
  });
});

module.exports = router;
