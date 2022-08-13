# Fullstack-harjoitustyö - Reseptiapuri

https://reseptiapuri.herokuapp.com/

[Työaikakirjanpito](tyoaikakirjanpito.md)

## Sovelluksen tila nyt

Sovelluksessa voi kirjautumatta katsella reseptejä ja luoda käyttäjätunnuksen.

Kirjautunut käyttäjä voi lisätä reseptin ainesosat omalle ostoslistalleen, katsella listaa, ja poistaa sieltä yksittäisiä tuotteita.

Pääkäyttäjä voi lisätä reseptejä käyttöliittymän kautta.

### Backlog
- listataan reseptin ravintosisältö reseptin yhteydessä
- reseptin muokkausnäkymä (saatavilla reseptin lisääjälle ja pääkäyttäjälle)
- resepteille aihetunnisteet
- ostoslistalle tieto siitä, montako annosta sille on lisätty
- ostoslistalle tieto mitä reseptejä sinne on lisätty
 - mahdollisuus poistaa ostoslistalta reseptikohtaisesti
- selkeämpi ilmoitus käyttäjälle siitä, että palvelimen puolen sessio on loppunut/puuttuu
- turvallisemmat localstorage-kyselyt

## Harjoitustyön tavoite

Luodaan ohjelma, johon on mahdollista tallentaa reseptejä. Reseptien ainesosat tallennetaan relaatiotietokantaan, jolloin ainesosille on mahdollista hallita esim. ravintosisältöjen tietoja ja näin laskea reseptien ravintoarvot.

Käytännössä tarkoitus on tehdä isompi, parempi, ja kauniimpi versio aiemmasta kurssityöstäni tsoha-reseptikirjasto.herokuapp.com/.

## Sovelluksen alkuasetelma

Sovelluksen pohjana on käytetty esimerkkisovellusta https://github.com/fullstack-hy2020/create-app. Koodi vaati paljon päivityksiä riippuvuusongelmien takia. Kuitenkin suuri osa sovelluksen funktionaalisista osista ja esimerkiksi kansiorakenteen logiikka on tätä perua.