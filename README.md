# Blackjack

## Overview

This will be a web app which allows users to login and play blackjack. Users will have a balance and can place bets of any chosen amount.

If time permits, I will try to make this a network based game where multiple people can join the table and play with the same dealer.

## Data Model

The application will store the data in MongoDB Atlas

Application will use:

- User's name and info
- User's bet amount
- Storage of stats and money

An Example Search:

```javascript
class Game(amount) {
  this.amount = amount;
}
```

## [Link to Commented First Draft Schema](db.js)

## Wireframes

/play - user will be able to play here

/account - user can add money and see their stats here

## Site map

Sitemap image [here](/sitemap.png)

## User Stories or Use Cases

1. as non-registered user, I can register a new account with the site
2. as a user, I can play games
3. as a user, I can add money to my account

## Research Topics

(2 points) Heroku Deployment
I am planning on deploying to heroku

(Authentication with passport) 2 points
Using passport, mongodb, and bcrypt for authentication.

(4 point) React
I am planning on using React as my frontend.

## Annotations / References Used

1. [nypd arrest map](https://www.youtube.com/watch?v=eO54xtfrfPk)
2. [QGIS styles](https://tjukanov.org/qgis-styles)
