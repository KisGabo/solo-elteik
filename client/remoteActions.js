/**
 * A view ezeket hívja meg, hogy adatot küldjön a szervernek.
 * Bővebb infó: /docs/szerver-iface.md "Kliens --> szerver" rész
 */

export function connect (name) {
  console.log('--> server: connect', name)
}

export function disconnect () {
  console.log('--> server: disconnect')
}

export function place (data) {
  console.log('--> server: place', data)
}

export function draw () {
  console.log('--> server: draw')
}
