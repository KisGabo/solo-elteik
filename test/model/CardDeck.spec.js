// ezek a tesztelő környezethez kellenek
const chai = require('chai')
const assert = chai.assert
const AssertionError = chai.AssertionError

// importáld, ami kell
const CardDeck = require('../../server/model/CardDeck')

// ezt a változót ebben a fájban minden teszteset látja
let nagyonGlobalis

describe('Valami tesztelendő egység', function () {

  // ezt a változót ebben az *egységben* minden teszteset látja
  let valtozo

  it('a fenti egységnek mit kéne csinálnia', function () {
    // ... tesztelő kód ...

    let kapottEredmeny = 'valami'
    let elvartEredmeny = 'valami'

    // majd (de bármikor, akár lehet több is)
    // az állapot ellenőrzése az assert használatával
    assert.equal(kapottEredmeny, elvartEredmeny)
  })

  it('a fenti egység egy másik tesztesete', function () {
    // ...
  })

})

describe('Valami másik tesztelendő egység', function () {

  describe('Lehet egymásba ágyazva csoportosítani is az alegységeket', function () {

    before(function () {
      // ez lefut egyszer, mielőtt elkezdődik az ebben az egységben lévő
      // tesztesetek végrehajtása
      // (ilyet nem kötelező írni, csak ha kell)
    })

    beforeEach(function () {
      // ez lefut minden egyes teszteset előtt ebben az egységben
      // (ilyet nem kötelező írni, csak ha kell)
    })

    it('ennek az alegységnek ezt kéne csinálnia', function () {
      // ...
    })

    it('ennek az alegységnek egy másik tesztesete', function () {
      // ...
    })

  })

  describe('Másik alegység', function () {

    it ('ennek a másik alegységnek egy tesztesete', function () {
      // ...
    })

  })

})
