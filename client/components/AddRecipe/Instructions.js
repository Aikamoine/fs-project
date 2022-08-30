/* eslint-disable react/no-unescaped-entities */
import React from 'react'

const Instructions = () => (
  <div>
    <b>Perustiedot</b>
    <ul>
      <li>
        Reseptin lisääminen kannattaa aloittaa <a href="/manageingredients">ainesosaluettelosta.</a> Varmista, että kaiki reseptisi ainesosat löytyvät luettelosta ja että niille on ravintosisältö.
      </li>
      <li>
        Reseptin perustiedot täytetään juuri kuten voisi ymmärtää. Työajoissa pyritään käyttämään minuutteja, esim. "60 min".
      </li>
      <li>
        Valitse listalta kaikki relevantit tunnisteet reseptillesi. Tunnisteita voi käydä lisäämässä <a href="/tags/manage">tunnisteiden hallinnasta</a>.
      </li>
      <li>
        "Sisältääkö resepti lisukkeen" tarkoittaa, että kuuluuko ainesosiin jo pasta, riisi, peruna, tms.
      </li>
    </ul>
    <br />
    <b>Ainesosat</b>
    <ul>
      <li>
        Määrä täytetään numerona, esim. "2".
      </li>
      <li>
        Yksikkö täytetään tekstinä, esim. "rkl". Pyri käyttämään grammoja ja selkeitä tilavuusmittoja (ml, tl, rkl, dl).
      </li>
      <li>
        HUOM! Teelusikka on 5 ml ja ruokalusikka on 15 ml, eivätkä mitään abstrakteja omasta kaapista löytyviä ruokailuvälineitä!
      </li>
      <li>
        Kun olet täyttänyt määrän ja yksikön, sekä valinnut ainesosan valikosta (valikosta voi hakea kirjoittamalla), klikkaa "Lisää"-nappia.
      </li>
      <li>
        Lisätyt ainesosat ilmestyvät listaan ennen työvaiheita - tunnistat ne esimerkiksi rivin vieressä olevasta "Poista"-napista.
      </li>
    </ul>
    <br />
    <b>Työvaiheet</b>
    <ul>
      <li>
        Kirjoita (tai kopioi) työväiheet omaan kenttäänsä. Rivinvaihto tarkoittaa reseptilläkin rivinvaihtoa, mutta pitkä pätkä tekstiä ei, vaikka se menisikin kirjoittaessa toiselle riville.
      </li>
      <li>
        Kentän alle ilmestyy tekstisi siinä muodossa, kuin se tulee näkymään reseptillä
      </li>
    </ul>
    Kun sekä ainesosien lista että työvaiheet on oikein, paina "Lisää resepti" -nappia.
  </div>
)

export default Instructions
