let { Deck } = require('./deck');
var rl = require('readline-sync');

const deck = new Deck();
deck.shuffle();
console.log(deck);

// Wait for user's response.
// var userName = readlineSync.question('May I have your name? ');
// console.log('Hi ' + userName + '!');

// const SUITS = ['♠', '♥', '♦', '♣'];
// const VALUES = ['A', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'J', 'Q', 'K'];

// class Card {
// 	constructor(suit, value) {
// 		this.suit = suit;
// 		this.value = value;
// 	}
// }

// function createDeck() {
// 	let cards = [];

// 	SUITS.map((suit) => {
// 		VALUES.map((value) => {
// 			cards.push(new Card(suit, value));
// 		});
// 	});

// 	return cards;
// }

// class Deck {
// 	constructor(cards = createDeck()) {
// 		this.cards = cards;
// 	}

// 	get size() {
// 		return this.cards.length;
// 	}

// 	shuffle() {
// 		console.log('okaokay');
// 		// shuffled using Fisher-Yates algorithm obtained from dev.to
// 		for (let i = this.deckLength - 1; i > 0; i--) {
// 			const j = Math.floor(Math.random() * (i + 1));
// 			const temp = this.cards[i];
// 			this.cards[i] = this.cards[j];
// 			this.cards[j] = temp;
// 		}
// 	}

// 	deal() {
// 		// Popping the stack to remove last card and return it
// 		return this.cards.pop();
// 	}
// }

// module.exports = {
// 	Deck: Deck,
// 	Card: Card,
// };
