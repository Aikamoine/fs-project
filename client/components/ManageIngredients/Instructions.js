/* eslint-disable react/no-unescaped-entities */
import React from 'react'

const Instructions = () => (
  <div>
    <b>Ainesosan lisääminen</b>
    <ul>
      <li>
        Jos ainesosa puuttuu, niin sen voi lisätä "Lisää ainesosa" - napista, tai hakemalla ravintotiedot Finelistä.
      </li>
      <li>
        Finelistä hakeminen onnistuu pudotusvalikon kautta ja klikkaamalla haluttua ainesosaa.
        <ul><li>Pudotusvalikossa on tekstihaku.</li></ul>
      </li>
      <li>
        Lisätty ainesosa ilmestyy listan ylimmäksi ja näkyy aina, riippumatta suodatus-kenttään kirjoitetusta tekstistä.
      </li>
    </ul>
    <br />
    <b>Tietojen muokkaaminen</b>
    <ul>
      <li>
        Ainesosan riviä klikkaamalla saat sen tiedot laajennettua. Tällöin voit muokata nimeä, ravintosisältöä ja painotietoja.
      </li>
      <li>
        Nimi johonkin uuteen muuttamalla jokainen ainesosaa käyttävä resepti päivittyy.
      </li>
      <li>
        Jos muutat nimen johonkin jo käytössä olevaan, niin kaikki muokattua ainesosaa käyttävät reseptit päivittyvät uuden ainesosan tiedoille.
        <ul>
          <li>
            Esimerkiksi jos luettelosta löytyy ainesosat nimeltä "sokeri" ja "sokeria", ja haluat yhdistää nämä jälkimmäisen alle, niin muokkaa ainesosan "sokeri" nimeksi "sokeria" ja päivitä.
          </li>
        </ul>
      </li>
      <li>
        Kappalepainon kenttään kirjoitetaan tuotteesta riippuen yleisesti käytetyn yksikön paino. Esimerkiksi keskimääräisen sipulin paino, tai yleisen tofupaketin paino.
      </li>
      <li>
        Desipainon kenttään laitetaan ainesosasta riippuen toinen kahdesta vaihtoehdosta:
        <ul>
          <li>Ainesosan ravintosisältö on per 100 grammaa - kuinka paljon yksi desi ainesosaa painaa (esim. sokeri, makaroni)</li>
          <li>Ainesosan ravintosisältö on per 100 millilitraa - laitetaan aina 100, esim. kerma</li>
          <li>Voi myös jättää tyhjäksi, jos ainesosaa ei käytännössä koskaan mitata tilavuuksissa</li>
        </ul>
      </li>
    </ul>
  </div>
)

export default Instructions
