/* eslint-disable react/no-unescaped-entities */
import React from 'react'

const Instructions = () => (
  <div>
    <p>
      <b>Perustiedot</b>
      <br />
      Reseptin lisääminen kannattaa aloittaa <a href="/manageingredients">ainesosaluettelosta.</a> Varmista, että kaiki reseptisi ainesosat löytyvät luettelosta ja että niille on ravintosisältö.
      <br />
      Reseptin perustiedot täytetään juuri kuten voisi ymmärtää. Työajoissa pyritään käyttämään minuutteja, esim. "60 min".
      <br />
      Valitse listalta kaikki relevantit tunnisteet reseptillesi. Tunnisteita voi käydä lisäämässä <a href="/tags/manage">tunnisteiden hallinnasta</a>.
    </p>
    <p>
      <b>Ainesosat</b>
      <br />
      Määrä täytetään numerona, esim. "2".
      <br />
      Yksikkö täytetään tekstinä, esim. "rkl". Pyri käyttämään grammoja ja selkeitä tilavuusmittoja (ml, tl, rkl, dl).
      <br />
      HUOM! Teelusikka on 5 ml ja ruokalusikka on 15 ml, eivätkä mitään abstrakteja omasta kaapista löytyviä ruokailuvälineitä!
      <br />
      Kun olet täyttänyt määrän ja yksikön, sekä valinnut ainesosan valikosta (valikosta voi hakea kirjoittamalla), klikkaa "Lisää"-nappia.
      <br />
      Lisätyt ainesosat ilmestyvät listaan ennen työvaiheita - tunnistat ne esimerkiksi rivin vieressä olevasta "Poista"-napista.
    </p>
    <p>
      <b>Työvaiheet</b>
      <br />
      Kirjoita (tai kopioi) työväiheet omaan kenttäänsä. Rivinvaihto tarkoittaa reseptilläkin rivinvaihtoa, mutta pitkä pätkä tekstiä ei, vaikka se menisikin kirjoittaessa toiselle riville.
      <br />
      Kentän alle ilmestyy tekstisi siinä muodossa, kuin se tulee näkymään reseptillä
    </p>
    Kun sekä ainesosien lista että työvaiheet on oikein, paina "Lisää resepti" -nappia.
  </div>
)

export default Instructions
