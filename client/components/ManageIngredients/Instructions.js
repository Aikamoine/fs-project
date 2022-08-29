/* eslint-disable react/no-unescaped-entities */
import React from 'react'

const Instructions = () => (
  <div>
    <b>Ainesosan lisääminen</b>
    <br />
    Jos ainesosa puuttuu, niin sen voi lisätä "Lisää ainesosa" - napista, tai hakemalla ravintotiedot Finelistä.
    <br />
    Finelistä hakeminen onnistuu pudotusvalikon kautta ja klikkaamalla haluttua ainesosaa. Pudotusvalikossa on tekstihaku.
    <br />
    Lisätty ainesosa ilmestyy listan ylimmäksi ja näkyy aina, riippumatta suodatus-kenttään kirjoitetusta tekstistä.
    <br />
    <br />
    <b>Tietojen muokkaaminen</b>
    <br />
    Ainesosan riviä klikkaamalla saat sen tiedot laajennettua. Tällöin voit muokata nimeä, ravintosisältöä ja painotietoja.
    <br />
    <br />
    Nimi johonkin uuteen muuttamalla jokainen ainesosaa käyttävä resepti päivittyy.
    <br />
    Jos muutat nimen johonkin jo käytössä olevaan, niin kaikki muokattua ainesosaa käyttävät reseptit päivittyvät uuden ainesosan tiedoille.
    <br />
    Esimerkiksi jos luettelosta löytyy ainesosat nimeltä "sokeri" ja "sokeria", ja haluat yhdistää nämä jälkimmäisen alle, niin muokkaa ainesosan "sokeri" nimeksi "sokeria" ja päivitä.
    <br />
    <br />
    Kappalepainon kenttään kirjoitetaan tuotteesta riippuen yleisesti käytetyn yksikön paino. Esimerkiksi keskimääräisen sipulin paino, tai yleisen tofupaketin paino.
    <br />
    <br />
    Desipainon kenttään laitetaan ainesosasta riippuen toinen kahdesta vaihtoehdosta:
    <ul>
      <li>Ainesosan ravintosisältö on per 100 grammaa - kuinka paljon yksi desi ainesosaa painaa (esim. sokeri, makaroni)</li>
      <li>Ainesosan ravintosisältö on per 100 millilitraa - laitetaan aina 100, esim. kerma</li>
    </ul>

  </div>
)

export default Instructions
