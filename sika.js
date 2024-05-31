//SikaNoppa muuttujat
const maksimiPelurit = 10
const aaniEfektit = {
    up:new Audio('sounds/up.mp3'),
    down:new Audio('sounds/down.mp3'),
    throwe:new Audio('sounds/throw.mp3'),
    finaali:[new Audio('sounds/close1.mp3'), new Audio('sounds/close2.mp3')]
}
let laskuri = 0
let heitto = 0
let tulos = 0
let vuoroNro = 1
let voittoraja = 100

//Apufunktiot
const sattuma = (syote) => Math.floor(Math.random()*syote)
const tapahtumaKysely = (tag) => document.querySelectorAll(tag)
const elementtiHaku = (id) => document.getElementById(id)

//Pelin alotusfunktiot
function noppaMaara() {
    if (heitto === 0) {
        if (tapahtumaKysely('button')[0].innerHTML == '1 Noppa') {
            elementtiHaku('maara').innerHTML = '2 Noppaa'
            tapahtumaKysely('img')[1].src = 'pics/2dice.png'
        } else {
            elementtiHaku('maara').innerHTML = '1 Noppa'
            tapahtumaKysely('img')[1].src = 'pics/1dice.png'
        }
    } else {
        elementtiHaku('muikkari').innerHTML = 'Vaihettaan sitten uuven pelin alussa'
    }
}

function nostaVR() {
    if (heitto == 0) {
        if (voittoraja < 300) {
            voittoraja += 50        
        } else {
            voittoraja = 100
        }
        elementtiHaku('vr').innerHTML = voittoraja
    } else {
        elementtiHaku('muikkari').innerHTML = 'Eikös se tää sovittu jo pelin alussa'
    }
}

function lisaaPelaaja() {    
    if (heitto === 0) {
        if (laskuri >= maksimiPelurit) {
            elementtiHaku('muikkari').innerHTML = 'Kaik pelpaikat on täynnään'
        } else {
            laskuri++
            let nimi = ''
            const placeHolderit = ["D'Artagnan", "Athos", "Porthos", "Aramis", 
            "Planchet", "Grimaud", "Mosqueton", "Bazin", "de Treville", "Richelieu"]
            //Taulukon luontivakiot
            const taulu = tapahtumaKysely('table')[0]
            const pelaaja = taulu.insertRow(laskuri)
            const nroKentta = pelaaja.insertCell(0)
            const nimiKentta = pelaaja.insertCell(1)
            const pisteKentta = pelaaja.insertCell(2)
            const nimiSyotto = document.createElement('INPUT')
            //Syötön hallinta
            const lisaaNappi = tapahtumaKysely('button')[1]
            //Taulukon valmistelu
            pelaaja.id = 'pelaaja'+laskuri
            elementtiHaku('pelaaja1').style.backgroundColor = 'pink'
            nroKentta.innerHTML = `${laskuri}.`
            nimiKentta.appendChild(nimiSyotto).id = 'nmi'+laskuri
            nimiKentta.id = 'nimi'+laskuri
            nimiSyotto.setAttribute('type', 'text')
            nimiSyotto.required
            nimiSyotto.placeholder = placeHolderit[laskuri-1]
            nimiSyotto.focus()
            //lisaaPelaaja-nappi off
            lisaaNappi.disabled = true
            //input-kentän kuuntelija 'Enter'
            nimiSyotto.addEventListener("keydown", (event) => {          
                if (event.key === 'Enter') {
                    event.preventDefault()
                    nimi = tapahtumaKysely('input')[0].value
                    if (nimi == '' || nimi == null) {
                        elementtiHaku('nimi'+laskuri).innerHTML = placeHolderit[laskuri-1]
                    } else {
                        elementtiHaku('nimi'+laskuri).innerHTML = nimi
                }
                //lisaaPelaaja-nappi on
                lisaaNappi.disabled = false
            }
        })
            pisteKentta.id = 'pisteet'+laskuri
            pisteKentta.innerHTML = 0
        }
    } else {
        elementtiHaku('muikkari').innerHTML = 'Vuan jos seuraavalle pelille tuut'
    }
}

//Pelin toimintafunktiot
function nopanHeitto() { 
    if (heitto == 0 && elementtiHaku('ohjeet') != null) {
        elementtiHaku('ohjeet').remove()
    }  
    let noppa1 = sattuma(6)+1
    let noppa2 = sattuma(6)+1
    if (laskuri < 2) {
        elementtiHaku('muikkari').innerHTML = 'Pari pelloojaa ois hyvä'
    } else {
        heitto = 1
        //yksi noppa
        elementtiHaku('muikkari').innerHTML = ''
        if (elementtiHaku('maara').innerHTML == '1 Noppa') {
            tapahtumaKysely('img')[2].src = 'pics/n'+noppa1+'.png'
            tapahtumaKysely('img')[2].style.rotate = sattuma(360)+'deg'
            if (noppa1 == 1) {
                ykkosLopetus()
            } else {
                tulos += noppa1
            }
        } else {
        //kaksi noppaa
            tapahtumaKysely('img')[2].src = 'pics/n'+noppa1+'.png'
            tapahtumaKysely('img')[2].style.rotate = sattuma(135)+'deg'
            tapahtumaKysely('img')[3].src = 'pics/n'+noppa2+'.png'
            tapahtumaKysely('img')[3].style.rotate = sattuma(225)+'deg'
            if (noppa1 == 1 && noppa2 == 1) {
                tulos += 25
            } else if (noppa1 == 1 || noppa2 == 1) {
                ykkosLopetus()
            } else if (noppa1 == noppa2) {
                tulos += (noppa1 + noppa2) * 2
            } else {
                tulos += (noppa1 + noppa2)
            }
        }
        aaniEfektit.throwe.play()
        elementtiHaku('tulos').innerHTML = tulos
        }
}

function vuoronLopetus() {
    if (heitto != 0) {
        var yhtPisteet = Number(elementtiHaku('pisteet'+vuoroNro).innerHTML)
        elementtiHaku('pisteet'+vuoroNro).innerHTML = yhtPisteet + Number(elementtiHaku('tulos').innerHTML)
        elementtiHaku('tulos').innerHTML = 0
        tulos = 0
        aaniEfektit.up.play()
        vuoronVaihto()
    }
}

function ykkosLopetus() {
    tulos = 0
    elementtiHaku('tulos').innerHTML = 0
    aaniEfektit.down.play()
    vuoronVaihto()
}

function vuoronVaihto() {
    if (Number(elementtiHaku('pisteet'+vuoroNro).innerHTML) >= voittoraja) {
        voitto()
    } else {
        elementtiHaku('pelaaja'+vuoroNro).style.backgroundColor = 'aqua'
        vuoroNro++
        if (vuoroNro > laskuri) {
            vuoroNro =1
        }
        elementtiHaku('pelaaja'+vuoroNro).style.backgroundColor = 'pink'
    }
}

function voitto() {
    const voittaja = elementtiHaku('pelaaja'+vuoroNro)
    const master = elementtiHaku('poyta1')
    //Nappien poisto
    elementtiHaku('lisaa').remove()
    elementtiHaku('maara').remove()
    //Voittotaulun muotoilut
    aaniEfektit.finaali[sattuma(2)].play()
    tapahtumaKysely('header')[0].style.height = '210px'
    tapahtumaKysely('header')[0].style.fontSize = '2.9em'
    master.style.color = 'gold'
    master.style.fontSize = '3em'
    master.style.textAlign = 'center'
    master.style.paddingTop = '5%'
    tapahtumaKysely('img')[0].style.top = '2%'
    master.innerHTML = `VOITTAJA <br><b><i>${elementtiHaku('nimi'+vuoroNro).innerHTML}<i><b><br>`
    voittaja.style.backgroundColor = 'gold'
    //Uuden pelin aloitus
    var uusiPeli = document.createElement('BUTTON')
    master.appendChild(uusiPeli).innerHTML = 'Uusi Peli'
    uusiPeli.id = 'restart'
    elementtiHaku('restart').addEventListener('click', function(){location.reload()})
}
