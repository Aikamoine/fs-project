# Fullstack-harjoitustyö - Reseptiapuri

https://reseptiapuri.herokuapp.com/

[Työaikakirjanpito](tyoaikakirjanpito.md)

## Sovelluksen tila nyt

Sovelluksessa voi kirjautumatta katsella reseptejä sekä ainesosien tietoja ja luoda käyttäjätunnuksen.

Kirjautunut käyttäjä voi lisätä reseptin ainesosat omalle ostoslistalleen, katsella listaa, ja poistaa sieltä yksittäisiä tuotteita, sekä kokonaisen reseptin sisällön.

Pääkäyttäjä voi lisätä reseptejä käyttöliittymän kautta ja hallita ainesosien ravintosisältöä.

### Backlog
- reseptin poisto ja editointi huomioimaan, jos resepti on jonkun ostoslistalla
  - nykyisin vain poistaa koko editoidun/poistetun reseptin listoilta
- reseptille lisukkeen, esim. riisi tai peruna, valinta ja sen huomiointi ravintoarvoissa
- selkeämpi ilmoitus käyttäjälle siitä, että palvelimen puolen sessio on loppunut/puuttuu

## Harjoitustyön tavoite

Luodaan ohjelma, johon on mahdollista tallentaa reseptejä. Reseptien ainesosat tallennetaan relaatiotietokantaan, jolloin ainesosille on mahdollista hallita esim. ravintosisältöjen tietoja ja näin laskea reseptien ravintoarvot.

Käytännössä tarkoitus on tehdä isompi, parempi, ja kauniimpi versio aiemmasta kurssityöstäni tsoha-reseptikirjasto.herokuapp.com/.

## Sovelluksen alkuasetelma

Sovelluksen pohjana on käytetty esimerkkisovellusta https://github.com/fullstack-hy2020/create-app. Koodi vaati paljon päivityksiä riippuvuusongelmien takia. Kuitenkin suuri osa sovelluksen funktionaalisista osista ja esimerkiksi kansiorakenteen logiikka on tätä perua.