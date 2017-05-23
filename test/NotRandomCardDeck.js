/**
 * Előre meghatározott sorrendű paklit szimulál (tesztelési célokra)
 * @module Server/Model
 * @author Bartalos Gábor
 */
class NotRandomCardDeck {

	/**
	 * @param {number} count Hány kártyalapos paklinak látszik ez kívülről
	 */
  	constructor (count) {
		this._initialCount = count
		this._count = count
		this._deck = []
	}

	/**
	 * A pakli aljára teszi az adott lapo(ka)t
	 * @param {Card} ...cards Egy vagy bármennyi lap
	 */
	setNext (...cards) {
		this._deck.push(...cards)
	}

	draw () {
		if (this._deck.length === 0) {
			throw new Error('Állíts be lapo(ka)t a setNext-tel')
		}

		--this._count
		return this._deck.shift()
	}

	count () {
		return this._count
	}

	shuffle () {
		this._count = this._initialCount
	}

}

module.exports = NotRandomCardDeck
