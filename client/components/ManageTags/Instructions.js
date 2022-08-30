/* eslint-disable react/no-unescaped-entities */
import React from 'react'

const Instructions = () => (
  <div>
    <b>Ohjeet</b>
    <ul>
      <li>
        +-napista saat lisättyä uuden tunnisteen
      </li>
      <li>
        Anna lisätylle tunnisteelle nimi ja määritä onko se ruoka-annos ennen tallentamista.
        <ul>
          <li>Tämän menettelyn on tarkoitus helpottaa ostoslistan sisältävien annosten laskentaa.</li>
        </ul>
      </li>
      <li>
        Ruoka-annos määrittää lasketaanko tunnisteen sisältävä resepti ostoslistan resepteissä ruoka-annosten vai muiden annoksien joukkoon.
      </li>
      <li>
        Jos jokin resepti sisältää yhdenkin tunnisteen, jonka Ruoka-annos -arvo on "Ei", niin resepti tulkitaan muuksi kuin ruoka-annokseksi.
      </li>
      <li>
        Esimerkiksi tunnisteet "g-muok", "jälkiruoka" ja "pähkinä" sisältävä resepti ei ole ruoka-annos, koska se sisältää tunnisteen "jälkiruoka".
      </li>
    </ul>
  </div>
)

export default Instructions
